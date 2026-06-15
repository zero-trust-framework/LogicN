// =============================================================================
// @logicn/devtools-pci — Public API
// =============================================================================

export { runPciAudit } from "./pci-checker.js";
export {
  type PciFinding,
  type PciAuditReport,
  type PciRequirement,
  ALL_PCI_REQUIREMENTS,
} from "./types.js";

// Black Box compliance ledger (#146) — hash-linked, append-only compliance
// report over the @logicn/core-sentinel-egress audit ledger.
export {
  readEgressBatches,
  buildComplianceReport,
  buildComplianceReportFromDir,
  appendComplianceLedger,
  readComplianceLedger,
  verifyComplianceChain,
  type EgressBatch,
  type ComplianceDecision,
  type ComplianceEntry,
  type ComplianceReport,
} from "./compliance-ledger.js";

/** Package version */
export const DEVTOOLS_PCI_VERSION = "0.1.0";
