export function isSafeHandle(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_.@-]{3,32}$/.test(value);
}

export function isPasswordLike(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 256;
}

export function isInviteKey(value: unknown): value is string {
  return typeof value === "string" && /^CYBER-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
