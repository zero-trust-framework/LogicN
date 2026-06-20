// egress-guard.test.mjs — outbound SSRF / egress protection.

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyHost, guardOutboundHost, guardOutboundUrl, validateWebhookTarget,
} from "../dist/index.js";

describe("classifyHost — IANA special-purpose ranges", () => {
  const cases = [
    ["127.0.0.1", "loopback"], ["127.255.255.254", "loopback"],
    ["10.1.2.3", "private"], ["172.16.5.5", "private"], ["172.31.255.1", "private"], ["192.168.0.1", "private"],
    ["172.15.0.1", "public"], ["172.32.0.1", "public"], // just outside 172.16/12
    ["169.254.169.254", "metadata"], ["169.254.1.1", "linkLocal"],
    ["100.64.0.1", "cgnat"], ["0.0.0.0", "unspecified"], ["255.255.255.255", "broadcast"],
    ["224.0.0.1", "multicast"], ["240.0.0.1", "reserved"], ["192.0.2.1", "reserved"], ["198.18.0.1", "reserved"],
    ["8.8.8.8", "public"], ["1.1.1.1", "public"],
    ["::1", "loopback"], ["::", "unspecified"], ["fe80::1", "linkLocal"], ["fc00::1", "uniqueLocal"],
    ["fd00:ec2::254", "metadata"], ["ff02::1", "multicast"], ["2606:4700::1111", "public"],
    ["localhost", "loopback"], ["api.localhost", "loopback"], ["metadata.google.internal", "metadata"],
    ["printer.local", "linkLocal"], ["db.internal", "private"], ["intranet", "private"], ["example.com", "public"],
  ];
  for (const [host, expected] of cases) {
    it(`${host} → ${expected}`, () => assert.equal(classifyHost(host).category, expected));
  }
});

describe("classifyHost — numeric-IP SSRF bypasses normalize to the real range", () => {
  // All of these are 127.0.0.1 in disguise — naive string checks miss them.
  for (const h of ["2130706433", "0x7f000001", "0177.0.0.1", "127.1", "127.0.1"]) {
    it(`${h} → loopback (normalized 127.0.0.1)`, () => assert.equal(classifyHost(h).category, "loopback"));
  }
  it("::ffff:127.0.0.1 (IPv4-mapped) → loopback", () => assert.equal(classifyHost("::ffff:127.0.0.1").category, "loopback"));
  it("0x0a000001 → private (10.0.0.1)", () => assert.equal(classifyHost("0x0a000001").category, "private"));
});

describe("guardOutboundHost — fail-closed (deny-by-default)", () => {
  it("a public host is allowed", () => assert.equal(guardOutboundHost("example.com").allowed, true));
  it("private/loopback/linkLocal are denied by default", () => {
    for (const h of ["10.0.0.1", "127.0.0.1", "169.254.1.1", "::1", "192.168.1.1"]) {
      assert.equal(guardOutboundHost(h).allowed, false, `${h} denied`);
    }
  });
  it("the metadata endpoint is denied even with allowNonPublicHosts (needs its own explicit flag)", () => {
    assert.equal(guardOutboundHost("169.254.169.254", { allowNonPublicHosts: true }).allowed, false);
    assert.equal(guardOutboundHost("169.254.169.254", { allowMetadataEndpoint: true }).allowed, true);
  });
  it("allowNonPublicHosts opens private ranges (opt-in)", () => {
    assert.equal(guardOutboundHost("10.0.0.1", { allowNonPublicHosts: true }).allowed, true);
  });
  it("an explicit allow-list permits a specific internal host", () => {
    assert.equal(guardOutboundHost("10.0.0.5", { allowedHosts: ["10.0.0.5"] }).allowed, true);
  });
  it("invalid hosts are denied even with allowNonPublicHosts", () => {
    assert.equal(guardOutboundHost("bad host!", { allowNonPublicHosts: true }).allowed, false);
  });
  it("FQDNs flag requiresDnsRecheck (DNS-rebinding defence)", () => {
    assert.equal(guardOutboundHost("example.com").requiresDnsRecheck, true);
    assert.equal(guardOutboundHost("8.8.8.8").requiresDnsRecheck, false); // a literal IP needs no recheck
  });
});

describe("guardOutboundUrl — scheme + credentials + host", () => {
  it("https to a public host is allowed", () => assert.equal(guardOutboundUrl("https://example.com/p").allowed, true));
  it("plaintext http is denied (scheme allow-list = https)", () => assert.equal(guardOutboundUrl("http://example.com/").allowed, false));
  it("http allowed when explicitly permitted", () => assert.equal(guardOutboundUrl("http://example.com/", { allowedSchemes: ["https", "http"] }).allowed, true));
  it("non-http schemes denied (ftp/file/gopher)", () => {
    for (const u of ["ftp://example.com/", "file:///etc/passwd", "gopher://x/"]) assert.equal(guardOutboundUrl(u).allowed, false, u);
  });
  it("embedded credentials (userinfo) denied — parser-confusion SSRF", () => {
    assert.equal(guardOutboundUrl("https://user:pass@evil.com/").allowed, false);
    assert.equal(guardOutboundUrl("https://169.254.169.254@example.com/").code, "LogicN_NETWORK_SSRF_URL_CREDENTIALS_DENIED");
  });
  it("metadata via decimal-IP URL is denied", () => assert.equal(guardOutboundUrl("https://2852039166/").allowed, false)); // 169.254.169.254
  it("unparseable URL fails closed", () => assert.equal(guardOutboundUrl("http://[bad").allowed, false));
});

describe("validateWebhookTarget — strict, ignores caller relaxations", () => {
  it("public https webhook allowed", () => assert.equal(validateWebhookTarget("https://hooks.example.com/x").allowed, true));
  it("private webhook denied even if caller passes allowNonPublicHosts", () => {
    assert.equal(validateWebhookTarget("https://10.0.0.5/hook", { allowNonPublicHosts: true }).allowed, false);
  });
  it("metadata webhook denied even if caller passes allowMetadataEndpoint", () => {
    assert.equal(validateWebhookTarget("https://169.254.169.254/", { allowMetadataEndpoint: true }).allowed, false);
  });
  it("plaintext webhook denied", () => assert.equal(validateWebhookTarget("http://hooks.example.com/").allowed, false));
  it("an allow-listed internal receiver is still honoured", () => {
    assert.equal(validateWebhookTarget("https://10.0.0.9/hook", { allowedHosts: ["10.0.0.9"] }).allowed, true);
  });
});
