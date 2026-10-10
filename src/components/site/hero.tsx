"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Menu } from "lucide-react";
import { Cinzel } from "next/font/google";
import GlyphPortal from "@/components/ui/glyph-portal";
import { accesos, site } from "@/lib/site";

// Cinzel Bold: capitales romanas, en la línea del wordmark del logo.
const portalFont = Cinzel({ subsets: ["latin"], weight: ["700"], display: "swap" });
const WORD = "DRESA";
const FALLBACK = '"Times New Roman", serif';

/** Escena que se ve a través de las letras: aurora amatista + oro, con video opcional encima. */
/**
 * Dentro de las letras corre un tramo del video en loop. Al hacer scroll, el video completo
 * se va revelando (sincronizado con el scroll) hasta mostrar el logo entero a pantalla completa.
 */
function PortalScene({ idleRef, scrubRef }: { idleRef: RefObject<HTMLVideoElement | null>; scrubRef: RefObject<HTMLVideoElement | null> }) {
  const [video, setVideo] = useState(true);
  return (
    <div style={{ position: "absolute", inset: 0, transform: "scale(var(--gp-field-scale,1))", overflow: "hidden", background: "#120a18" }}>
      {/* Respaldo si el video no carga: degradé de marca */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #d9b98a 0%, #b58ae0 55%, #6f3a9f 100%)" }} />
      {video && (
        <>
          <video
            ref={idleRef} className="absolute inset-0 size-full object-cover"
            src="/media/hero-loop.mp4" poster="/media/poster.jpg"
            style={{ filter: "brightness(2.4) contrast(1.15) saturate(1.15)" }}
            autoPlay muted loop playsInline preload="auto"
            onError={() => setVideo(false)} aria-hidden="true"
          />
          {/* Video completo: en vertical (celular) se escala para que el logo entre entero */}
          <div className="absolute inset-0" style={{ opacity: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/marble-a.jpg" alt="" className="dresa-scrub-bg absolute inset-0 size-full object-cover" />
            <video
              ref={scrubRef} className="dresa-scrub"
              src="/media/hero-scrub.mp4" style={{ filter: "brightness(1.1) contrast(1.05)" }}
              muted playsInline preload="auto" aria-hidden="true"
            />
          </div>
        </>
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
  const idleRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef<HTMLVideoElement>(null);

  // Sin estado de React: se mueve el video directamente en cada frame de scroll.
  const onProgress = (p: number) => {
    const idle = idleRef.current, scrub = scrubRef.current;
    if (!idle || !scrub) return;
    const smooth = (a: number, b: number, n: number) => { const t = Math.min(1, Math.max(0, (n - a) / (b - a))); return t * t * (3 - 2 * t); };
    (scrub.parentElement as HTMLElement).style.opacity = String(smooth(0.06, 0.36, p));
    if (p > 0.5) { if (!idle.paused) idle.pause(); } else if (idle.paused) idle.play().catch(() => {});
    if (scrub.readyState >= 1 && scrub.duration) {
      const target = Math.min(scrub.duration - 0.05, scrub.duration * smooth(0.04, 0.8, p));
      if (Math.abs(scrub.currentTime - target) > 0.03) scrub.currentTime = target;
    }
  };

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
        scrollLength={2.2}
        interactive
        enterLabel="Entrar"
        background={<PortalScene idleRef={idleRef} scrubRef={scrubRef} />}
        onProgress={onProgress}
        front={<Front />}
      >
        <Welcome />
      </GlyphPortal>
    </div>
  );
}

/** Al entrar, el video queda libre a pantalla completa: sin texto encima. */
function Welcome() {
  return <div aria-hidden />;
}
