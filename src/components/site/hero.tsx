"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Cinzel } from "next/font/google";
import GlyphPortal from "@/components/ui/glyph-portal";
import { accesos, site } from "@/lib/site";

// Cinzel Bold: capitales romanas, en la línea del wordmark del logo.
const portalFont = Cinzel({ subsets: ["latin"], weight: ["700"], display: "swap" });
const WORD = "DRESA";
const FALLBACK = '"Times New Roman", serif';

/** Escena que se ve a través de las letras: aurora amatista + oro, con video opcional encima. */
function PortalScene() {
  const [video, setVideo] = useState(true);
  return (
    <div
      style={{ position: "absolute", inset: 0, transform: "scale(var(--gp-field-scale,1))", overflow: "hidden", background: "#1a1020" }}
    >
      {/* Respaldo si el video no carga: degradé de marca */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #b8946a 0%, #6f3a9f 60%, #2a1245 100%)" }} />
      {video && (
        <video
          className="absolute inset-0 size-full object-cover"
          src="/media/hero-loop.mp4" poster="/media/poster.jpg"
          style={{ filter: "brightness(1.45) contrast(1.05)" }}
          autoPlay muted loop playsInline preload="auto"
          onError={() => setVideo(false)}
          aria-hidden="true"
        />
      )}
      {/* Piso de luz: evita que las letras se pierdan en los momentos oscuros del video, sin teñirlo */}
      {video && (
        <div
          className="absolute inset-0"
          style={{ mixBlendMode: "lighten", background: "linear-gradient(135deg, #6b5238 0%, #50367a 60%, #3a2354 100%)" }}
        />
      )}
    </div>
  );
}

function Front() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-10 lg:px-14">
        <a href="#top" className="flex items-center gap-3" aria-label="DRESA">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.png" alt="" width={44} height={44} className="size-10 object-contain sm:size-11" />
          <span className="font-caps text-[.95rem] tracking-[.36em] text-gold-200">DRESA</span>
        </a>
        <nav aria-label="Accesos" className="hidden items-center gap-7 xl:flex">
          {accesos.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="text-[.68rem] uppercase tracking-[.2em] text-cream/75 transition-colors hover:text-gold-200">
              {a.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => window.dispatchEvent(new Event("dresa:menu"))}
          className="grid size-11 place-items-center rounded-full border border-gold-500/35 text-gold-200 xl:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <p className="absolute inset-x-6 text-center font-display text-[1.05rem] italic text-gold-300/90 sm:text-xl"
        style={{ bottom: "calc(100% - var(--gp-word-top, 35%) + 28px)" }}>
        Belleza · Imagen · Estilo
      </p>
      <p className="absolute inset-x-8 mx-auto max-w-xl text-center font-display text-lg leading-snug text-cream/85 sm:text-2xl"
        style={{ top: "calc(var(--gp-word-bottom, 50%) + 26px)" }}>
        {site.tagline}
      </p>
      <p className="absolute inset-x-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] [@media(any-pointer:coarse)]:bottom-24 flex items-center justify-center gap-3 text-center text-[.65rem] uppercase tracking-[.3em] text-gold-400/80">
        <span className="h-px w-8 bg-gold-500/50" /> Deslizá para entrar <span className="h-px w-8 bg-gold-500/50" />
      </p>
    </>
  );
}

export function Hero() {
  const [family, setFamily] = useState<string | null>(null);

  useEffect(() => {
    let done = false;
    const finish = (f: string) => { if (!done) { done = true; setFamily(f); } };
    const name = portalFont.style.fontFamily;
    const t = window.setTimeout(() => finish(FALLBACK), 2000);
    document.fonts.load(`700 100px ${name}`, WORD).then(
      () => finish(name),
      () => finish(FALLBACK),
    );
    return () => { done = true; window.clearTimeout(t); };
  }, []);

  if (!family) {
    return (
      <div id="top" className="grid min-h-svh place-items-center bg-ink-950" role="status" aria-label="Cargando">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.png" alt="DRESA" width={96} height={96} className="size-24 animate-pulse object-contain" />
      </div>
    );
  }

  return (
    <div id="top">
      <GlyphPortal
        className="dresa-portal"
        word={WORD}
        fontFamily={family}
        fontWeight={700}
        scrollLength={2}
        interactive
        enterLabel="Entrar"
        background={<PortalScene />}
        front={<Front />}
      >
        <Welcome />
      </GlyphPortal>
    </div>
  );
}

function Welcome() {
  return (
    <div className="mx-auto w-full max-w-6xl text-center">
      <p className="pill relative">Bienvenida</p>
      <h2 className="h-display relative mx-auto mt-7 max-w-4xl pb-1">
        Tu mejor versión, <em className="text-gold">sin salir de casa.</em>
      </h2>
      <div className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gold-500/25 bg-gold-500/20 lg:grid-cols-4">
        {accesos.map((a, i) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="group relative flex min-h-32 items-end justify-between gap-2 bg-ink-950/75 p-5 backdrop-blur-md transition-colors hover:bg-violet-800/60 sm:min-h-36"
          >
            <span className="absolute right-4 top-4 font-caps text-[.65rem] tracking-widest text-violet-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-[1.35rem] leading-none text-cream sm:text-[1.7rem]">{a.label}</span>
            <ArrowUpRight className="size-5 shrink-0 text-gold-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        ))}
        <a href="#servicios" className="group flex min-h-28 items-end justify-between bg-gold-400/90 p-5 text-ink-950 transition-colors hover:bg-gold-300 sm:min-h-36">
          <span className="font-display text-[1.35rem] leading-none sm:text-[1.7rem]">Ver los 10 servicios</span>
          <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
