import { site } from "@/lib/site";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#registro", label: "Registrarme" },
  { href: "#atencion", label: "Ayuda" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-gold-500/25 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-16 sm:pb-12 sm:pt-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/marble-e.jpg" alt="" loading="lazy" className="size-full object-cover object-right opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a0709,rgba(10,7,9,.8)_45%,#0a0709)]" />
      </div>

      <div className="wrap flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.png" alt="" width={64} height={64} className="size-16 object-contain" />
        <p className="mt-3 font-caps text-xl tracking-[.4em] text-gold-200">DRESA</p>
        <p className="mt-4 max-w-xs font-display text-xl leading-snug text-cream/75 sm:max-w-md sm:text-2xl">{site.tagline}</p>

        <nav aria-label="Pie de página" className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="py-2 text-[.68rem] uppercase tracking-[.2em] text-cream/65 transition-colors hover:text-gold-200">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hairline mt-8 w-full max-w-sm" />
        <p className="mt-6 text-xs leading-relaxed tracking-wide text-cream/45">
          © 2026 DRESA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
