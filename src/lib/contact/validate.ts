export interface ContactInput { name: string; email: string; message: string }
export interface ValidationResult {
  ok: boolean;
  errors: Partial<Record<keyof ContactInput, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: Partial<ContactInput>): ValidationResult {
  const errors: Partial<Record<keyof ContactInput, string>> = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const message = (input.message ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Tell us a little more (10+ characters).";
  return { ok: Object.keys(errors).length === 0, errors };
}
