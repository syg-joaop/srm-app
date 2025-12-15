export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isRequired(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

export function minLength(value: string, length: number): boolean {
  return value.length >= length;
}

export function maxLength(value: string, length: number): boolean {
  return value.length <= length;
}
