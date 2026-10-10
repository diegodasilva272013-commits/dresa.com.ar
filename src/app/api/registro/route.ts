import { NextResponse } from "next/server";

const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const mail = String(body.email ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").replace(/[^\d+]/g, "");
  const ciudad = String(body.ciudad ?? "").trim();
  const perfil = body.perfil === "profesional" ? "profesional" : "cliente";

  if (nombre.length < 2) return NextResponse.json({ ok: false, error: "Ingresá tu nombre." }, { status: 422 });
  if (!email.test(mail)) return NextResponse.json({ ok: false, error: "El email no es válido." }, { status: 422 });
  if (whatsapp.replace(/\D/g, "").length < 8) return NextResponse.json({ ok: false, error: "Ingresá un WhatsApp válido." }, { status: 422 });

  // TODO: persistir (base de datos / CRM / email). Por ahora solo se registra en el log del servidor.
  console.log("[registro]", { nombre, mail, whatsapp, ciudad, perfil, at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
