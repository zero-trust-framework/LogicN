// =============================================================================
// Galerina Phase R3 — Package Type Registry
//
// Provides a static map of known @galerinaa/* package names to the type names
// they export. Used by the symbol resolver and type checker to suppress
// SPORE-TYPE-001 for types imported from known packages.
//
// This registry is the source of truth for cross-module type injection.
// When an `import X from "@galerinaa/foo"` statement is encountered, all types
// listed for that package are pre-registered so no unknown-type diagnostic
// fires for them.
// =============================================================================

export const KNOWN_PACKAGE_TYPES: ReadonlyMap<string, readonly string[]> = new Map([
  ["@galerinaa/healthcare-types", ["Email", "PatientId", "DOB", "PhoneNumber", "MedicalRecordId", "DiagnosisCode", "ProcedureCode", "ProviderNpi"]],
  ["@galerinaa/financial-types", ["Amount", "CurrencyCode", "AccountId", "TransactionId", "PaymentMethodId", "InvoiceId", "ReceiptId"]],
  ["@galerinaa/auth-types", ["UserId", "SessionId", "AuthToken", "RefreshToken", "PermissionId", "RoleId"]],
  ["@galerinaa/common-types", ["Url", "IpAddress", "Hostname", "Port", "TraceId", "CorrelationId"]],
  ["@galerinaa/ai-types", ["ModelId", "PromptId", "EmbeddingId", "InferenceResult", "ClassificationLabel"]],
  // Phase R3: expanded domain type packages
  ["@galerinaa/order-types", ["OrderId", "OrderStatus", "LineItem", "OrderTotal", "ShippingAddress", "DeliveryEstimate"]],
  ["@galerinaa/patient-types", ["PatientId", "MedicalRecord", "Diagnosis", "Prescription", "LabResult", "ConsentRecord"]],
  ["@galerinaa/notification-types", ["NotificationId", "NotificationChannel", "NotificationPayload", "DeliveryStatus"]],
  ["@galerinaa/identity-types", ["IdentityId", "VerificationCode", "BiometricHash", "DeviceFingerprint"]],
  ["@galerinaa/document-types", ["DocumentId", "DocumentType", "DocumentStatus", "Signature", "Timestamp"]],
  ["@galerinaa/webhook-types", ["WebhookId", "WebhookEvent", "WebhookPayload", "DeliveryAttempt"]],
]);

// ---------------------------------------------------------------------------
// Phase R3: Known domain types
//
// Commonly used domain type names that are valid even without an explicit
// import declaration. Level 5+ CEC examples often use these types directly
// without a full package import. Any type in this set will not trigger
// SPORE-TYPE-001 even when it is absent from BUILT_IN_TYPES and no import
// statement was present.
// ---------------------------------------------------------------------------

export const KNOWN_DOMAIN_TYPES: ReadonlySet<string> = new Set([
  "Email", "PatientId", "UserId", "OrderId", "ProductId", "CustomerId",
  "SessionId", "AuthToken", "PaymentMethodId", "InvoiceId", "WebhookId",
  "WebhookEvent", "PhoneNumber", "Diagnosis", "MedicalRecord", "LabResult",
  "ConsentRecord",
]);

/**
 * Returns the list of type names exported by the given package.
 *
 * If the package is not in KNOWN_PACKAGE_TYPES, an empty array is returned.
 * These type names should be seeded into the type checker and symbol resolver
 * so that importing them does not produce SPORE-TYPE-001 diagnostics.
 */
export function resolveImportedTypes(packageName: string): readonly string[] {
  return KNOWN_PACKAGE_TYPES.get(packageName) ?? [];
}

/**
 * Phase R3: Load type names for a package.
 *
 * Resolution order:
 *   1. KNOWN_PACKAGE_TYPES (fastest, static registry)
 *   2. package.galerina.yaml from node_modules (Phase 11E; stub returns [] here)
 *
 * @param packageName   The npm/package name, e.g. "@galerinaa/order-types".
 * @param _projectRoot  Optional project root path (used in Phase 11E for manifest lookup).
 * @returns             The type names exported by this package, or [] if unknown.
 */
export function loadManifestTypes(packageName: string, _projectRoot?: string): readonly string[] {
  // 1. Check KNOWN_PACKAGE_TYPES first (fastest path)
  const known = KNOWN_PACKAGE_TYPES.get(packageName);
  if (known !== undefined) return known;
  // 2. Try to load from node_modules/{packageName}/package.galerina.yaml
  // Phase R3: stub — returns [] if not found locally
  // Full implementation: Phase 11E loads from filesystem
  return [];
}
