import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { runCli } from "../dist/index.js";

describe("LogicN graph command", () => {
  it("generates graph JSON and report files from workspace metadata", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "logicn-core-cli-graph-"));
    await writeFile(
      join(cwd, "logicn.workspace.json"),
      `${JSON.stringify(
        {
          name: "LogicN-test",
          packages: [
            "packages-logicn/logicn-core",
            "packages-logicn/logicn-core-security",
            "packages-logicn/logicn-devtools-project-graph",
          ],
          docs: {
            language: "packages-logicn/logicn-core",
            security: "packages-logicn/logicn-core-security",
            projectGraph: "packages-logicn/logicn-devtools-project-graph",
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    await writeFile(
      join(cwd, "AGENTS.md"),
      "# Agent Instructions\n\nUse build/graph before broad changes.\n",
      "utf8",
    );

    const result = await runCli(["graph", "--out", "graph-out"], cwd);
    const graph = JSON.parse(
      await readFile(join(cwd, "graph-out", "logicn-devtools-project-graph.json"), "utf8"),
    );
    const report = await readFile(
      join(cwd, "graph-out", "LogicN_GRAPH_REPORT.md"),
      "utf8",
    );
    const aiMap = await readFile(join(cwd, "graph-out", "logicn-ai-map.md"), "utf8");
    const html = await readFile(
      join(cwd, "graph-out", "logicn-devtools-project-graph.html"),
      "utf8",
    );

    assert.equal(result.ok, true);
    assert.equal(graph.nodes.some((node) => node.id === "package:logicn-core"), true);
    assert.equal(
      graph.nodes.some((node) => node.id === "doc:AGENTS.md"),
      true,
    );
    assert.equal(
      graph.edges.some((edge) => edge.kind === "generates"),
      true,
    );
    assert.match(report, /LogicN Graph Report/);
    assert.match(aiMap, /LogicN AI Map/);
    assert.match(html, /LogicN Project Graph/);

    const query = await runCli(["graph", "query", "logicn-core-security", "--out", "graph-out"], cwd);
    const explain = await runCli(
      ["graph", "explain", "package:logicn-core-security", "--out", "graph-out"],
      cwd,
    );
    const path = await runCli(
      [
        "graph",
        "path",
        "package:logicn-devtools-project-graph",
        "report:project-graph",
        "--out",
        "graph-out",
      ],
      cwd,
    );

    assert.equal(query.ok, true);
    assert.match(query.details?.join("\n") ?? "", /package:logicn-core-security/);
    assert.equal(explain.ok, true);
    assert.match(explain.message, /logicn-core-security/);
    assert.equal(path.ok, true);
  });
});
