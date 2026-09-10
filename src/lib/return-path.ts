export function safeReturnPath(value: string, fallback: string) {
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\x00-\x20]/.test(value)
  )
    return fallback;
  const url = new URL(value, "https://kingsword.invalid");
  return url.origin === "https://kingsword.invalid"
    ? url.pathname + url.search + url.hash
    : fallback;
}
