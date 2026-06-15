import { test } from "node:test";
import assert from "node:assert/strict";
import { SecurityTrap, HardenedBorderViolation } from "../dist/index.js";

// Regression: the Tower routes on `instanceof SecurityTrap` / `instanceof HardenedBorderViolation`.
// `class X extends Error` loses its prototype link when down-levelled / re-bundled, so each
// constructor must call Object.setPrototypeOf. memory + state previously omitted it (egress/io had
// it) — this locks the instanceof + prototype-identity contract so all four sentinels stay consistent.
for (const Cls of [SecurityTrap, HardenedBorderViolation]) {
  test(`${Cls.name}: instanceof + prototype chain + fields are robust`, () => {
    const e = new Cls("LSM-TEST-001", "boom");
    assert.ok(e instanceof Cls, "instanceof the class");
    assert.ok(e instanceof Error, "instanceof Error");
    assert.equal(Object.getPrototypeOf(e), Cls.prototype, "prototype identity restored");
    assert.equal(e.code, "LSM-TEST-001");
    assert.equal(e.name, Cls.name);
    assert.equal(e.message, "boom");
    let caught = null;
    try { throw e; } catch (err) { caught = err; }
    assert.ok(caught instanceof Cls, "catchable as its own class (Tower routing contract)");
  });
}
