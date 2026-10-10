import { accesos, services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-gold-500/25 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/marble-e.jpg" alt="" loading="lazy" className="size-full object-cover object-right opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a0709,rgba(10,7,9,.75)_40%,#0a0709)]" />
      </div>
      <div className="wrap">
        <div className="mx-auto max-w-xl text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.png" alt="" width={72} height={72} className="mx-auto size-[4.5rem] object-contain" />
          <p className="mt-4 font-caps text-2xl tracking-[.4em] text-gold-200">DRESA</p>
          <p className="mt-5 font-display text-2xl leading-snug text-cream/80">{site.tagline}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-10 text-center sm:text-left">
          <nav aria-label="Accesos">
            <p className="eyebrow">Accesos</p>
            <ul className="mt-5 space-y-3">
              {accesos.map((a) => (
                <li key={a.id}><a href={`#${a.id}`} className="text-cream/70 transition-colors hover:text-gold-200">{a.label}</a></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Servicios">
            <p className="eyebrow">Servicios</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.id}><a href="#servicios" className="text-cream/70 transition-colors hover:text-gold-200">{s.name}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hairline mt-16" />
        <p className="mt-6 text-center text-xs tracking-wider text-cream/45">© 2026 DRESA · {site.domain}</p>
      </div>
    </footer>
  );
}
