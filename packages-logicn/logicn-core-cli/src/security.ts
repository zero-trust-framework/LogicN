const SECRET_PATTERNS: readonly RegExp[] = [
  /bearer\s+[a-z0-9._~+/=-]+/gi,
  /(api[_-]?key\s*=\s*)[^\s]+/gi,
  /(token\s*=\s*)[^\s]+/gi,
  /(password\s*=\s*)[^\s]+/gi,
  /(cookie\s*:\s*)[^\r\n]+/gi,
  /(private[_-]?key\s*=\s*)[\s\S]+/gi
];

export function redactCliOutput(value: string): string {
  return SECRET_PATTERNS.reduce(
    (current, pattern) => current.replace(pattern, (_match, prefix?: string) => `${prefix ?? ""}SecureString(redacted)`),
    value
  );
}
