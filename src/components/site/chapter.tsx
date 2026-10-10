import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Diagonales doradas de las esquinas, el mismo gesto del arte del logo. */
function Corners() {
  return (
    <>
      <svg aria-hidden viewBox="0 0 420 420" className="pointer-events-none absolute right-0 top-0 -z-10 w-[46vw] max-w-[520px] opacity-80">
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d5b384" stopOpacity="0" /><stop offset=".6" stopColor="#d5b384" /><stop offset="1" stopColor="#b27fe2" />
          </linearGradient>
        </defs>
        <path d="M120 0 L420 300" stroke="url(#cg1)" strokeWidth="1.2" fill="none" />
        <path d="M190 0 L420 230" stroke="#9558ca" strokeOpacity=".45" strokeWidth="14" fill="none" />
        <path d="M260 0 L420 160" stroke="#d5b384" strokeOpacity=".35" strokeWidth="1" fill="none" />
      </svg>
      <svg aria-hidden viewBox="0 0 420 420" className="pointer-events-none absolute bottom-0 left-0 -z-10 w-[46vw] max-w-[520px] rotate-180 opacity-80">
        <path d="M120 0 L420 300" stroke="url(#cg1)" strokeWidth="1.2" fill="none" />
        <path d="M190 0 L420 230" stroke="#9558ca" strokeOpacity=".45" strokeWidth="14" fill="none" />
        <path d="M260 0 L420 160" stroke="#d5b384" strokeOpacity=".35" strokeWidth="1" fill="none" />
      </svg>
    </>
  );
}

export function Chapter({
  id, bg = "a", flip, pos = "50% 50%", tone = "violet", className, children,
}: {
  id?: string; bg?: "a" | "c" | "d" | "e"; flip?: boolean; pos?: string; tone?: "violet" | "gold"; className?: string; children: ReactNode;
}) {
  const glow = tone === "violet"
    ? "radial-gradient(60% 50% at 80% 20%, rgba(149,88,202,.28), transparent 70%)"
    : "radial-gradient(60% 50% at 20% 80%, rgba(213,179,132,.2), transparent 70%)";
  return (
    <section id={id} className={cn("relative isolate overflow-hidden py-28 sm:py-40", className)}>
      <div aria-hidden className="absolute inset-0 -z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/media/marble-${bg}.jpg`} alt="" loading="lazy" decoding="async"
          className="size-full object-cover opacity-55"
          style={{ objectPosition: pos, transform: flip ? "scaleX(-1) scale(1.08)" : "scale(1.08)" }}
        />
        <div className="absolute inset-0" style={{ background: glow }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0709 0%, rgba(10,7,9,.35) 20%, rgba(10,7,9,.45) 78%, #0a0709 100%)" }} />
      </div>
      <Corners />
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Head({
  eyebrow, children, sub,
}: { eyebrow: string; children: ReactNode; sub?: string }) {
  return (
    <header className="rise mx-auto max-w-3xl text-center">
      <span className="pill">{eyebrow}</span>
      <h2 className="h-display mt-7 pb-1">{children}</h2>
      {sub && <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">{sub}</p>}
    </header>
  );
}

export function Bezel({ children, className, inner }: { children: ReactNode; className?: string; inner?: string }) {
  return (
    <div className={cn("bezel", className)}>
      <div className={cn("bezel-in", inner)}>{children}</div>
    </div>
  );
}
