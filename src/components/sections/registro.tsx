"use client";

import { useState, type FormEvent } from "react";
import { Check, Crown, Gift, Home } from "lucide-react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { cn } from "@/lib/utils";

const perks = [
  { icon: Home, t: "Todo en tu domicilio", d: "Profesionales verificados que van hasta vos." },
  { icon: Gift, t: "Beneficios de bienvenida", d: "Promociones exclusivas para miembros." },
  { icon: Crown, t: "Trato de primer nivel", d: "Reservas prioritarias y atención personal." },
];

export function Registro() {
  const [perfil, setPerfil] = useState<"cliente" | "profesional">("cliente");
  const [state, setState] = useState<"idle" | "sending" | "ok">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending"); setError("");
    try {
      const res = await fetch("/api/registro", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, perfil }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setState("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos registrarte. Probá de nuevo.");
      setState("idle");
    }
  }

  return (
    <Chapter id="registro" bg="d" flip pos="60% 40%" tone="gold">
      <Head eyebrow="Regístrese ya" sub="Creá tu cuenta en menos de un minuto y empezá a reservar, recomendar y acumular beneficios.">
        Entrá al <em className="text-gold">círculo</em> DRESA.
      </Head>

      <div className="rise mt-16 grid gap-4 sm:mt-20 lg:grid-cols-2 lg:gap-6">
        <Bezel inner="flex flex-col justify-center p-6 sm:p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.png" alt="" width={220} height={220} className="pointer-events-none absolute -bottom-10 -right-6 size-64 object-contain opacity-[.12]" />
          <p className="font-display text-3xl leading-tight text-gold sm:text-4xl">Una experiencia pensada para vos.</p>
          <ul className="mt-10 space-y-7">
            {perks.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex items-center gap-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-300">
                  <Icon className="size-6" strokeWidth={1} />
                </span>
                <div>
                  <p className="font-display text-2xl text-cream">{t}</p>
                  <p className="text-sm text-cream/60">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Bezel>

        <Bezel inner="p-6 sm:p-10">
          {state === "ok" ? (
            <div className="grid min-h-[24rem] place-items-center text-center" role="status">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-400 text-ink-950"><Check className="size-8" /></span>
                <p className="mt-6 font-display text-4xl text-gold">Bienvenida/o a DRESA</p>
                <p className="mt-3 text-cream/70">Recibimos tu registro. Te contactaremos por WhatsApp muy pronto.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-1.5 rounded-full border border-gold-500/25 p-1" role="radiogroup" aria-label="Tipo de perfil">
                {(["cliente", "profesional"] as const).map((p) => (
                  <button
                    key={p} type="button" role="radio" aria-checked={perfil === p} onClick={() => setPerfil(p)}
                    className={cn("min-h-11 rounded-full text-[.68rem] uppercase tracking-[.16em] transition-all duration-500 ease-lux", perfil === p ? "bg-gold-400 text-ink-950" : "text-cream/70")}
                  >
                    {p === "cliente" ? "Quiero servicios" : "Soy profesional"}
                  </button>
                ))}
              </div>
              {[
                { n: "nombre", l: "Nombre y apellido", t: "text", a: "name" },
                { n: "email", l: "Email", t: "email", a: "email" },
                { n: "whatsapp", l: "WhatsApp", t: "tel", a: "tel" },
                { n: "ciudad", l: "Ciudad / zona", t: "text", a: "address-level2" },
              ].map((f) => (
                <div key={f.n} className="field-wrap">
                  <input id={`r-${f.n}`} name={f.n} type={f.t} autoComplete={f.a} placeholder=" " required={f.n !== "ciudad"} className="field" />
                  <label htmlFor={`r-${f.n}`}>{f.l}</label>
                </div>
              ))}
              {error && <p role="alert" className="text-sm text-violet-300">{error}</p>}
              <button type="submit" disabled={state === "sending"} className="btn-gold w-full">
                {state === "sending" ? "Enviando…" : "Crear mi cuenta"}
              </button>
              <p className="text-center text-xs text-cream/45">Tus datos se usan solo para contactarte por DRESA.</p>
            </form>
          )}
        </Bezel>
      </div>
    </Chapter>
  );
}
