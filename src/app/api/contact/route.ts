import { validateContact } from "@/lib/contact/validate";
import type { ContactInput } from "@/lib/contact/validate";

export async function POST(request: Request): Promise<Response> {
  let body: Partial<ContactInput> = {};
  try {
    body = (await request.json()) as Partial<ContactInput>;
  } catch {
    return Response.json({ ok: false, errors: { message: "Invalid request." } }, { status: 400 });
  }
  const result = validateContact(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }
  // TODO(integración): enviar el email/registrar el lead con un servicio real.
  return Response.json({ ok: true }, { status: 200 });
}
