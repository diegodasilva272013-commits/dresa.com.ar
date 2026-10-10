"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { accesos } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [{ id: "servicios", label: "Servicios" }, ...accesos];

export function Nav() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const hero = document.querySelector(".dresa-portal");
      const past = hero ? hero.getBoundingClientRect().top < -window.innerHeight * 0.9 : window.scrollY > 400;
      setShown(past);
      let current = "";
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = l.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(update); };
    const onMenu = () => setOpen(true);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("dresa:menu", onMenu);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("dresa:menu", onMenu);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-3 mt-3 flex h-14 min-[1328px]:mx-auto max-w-[1360px] items-center justify-between gap-4 rounded-full border border-gold-500/25 bg-ink-950/70 px-4 backdrop-blur-xl sm:px-6">
          <a href="#top" className="flex items-center gap-2.5" aria-label="DRESA, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.png" alt="" width={32} height={32} className="size-8 object-contain" />
            <span className="font-caps text-sm tracking-[.32em] text-gold-200">DRESA</span>
          </a>
          <nav aria-label="Principal" className="hidden items-center gap-1 2xl:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-[.64rem] uppercase tracking-[.14em] transition-colors",
                  active === l.id ? "bg-gold-400/15 text-gold-200" : "text-cream/70 hover:text-gold-200",
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event("dresa:install"))}
              className="hidden items-center gap-2 rounded-full border border-gold-500/40 px-4 py-2 text-[.68rem] uppercase tracking-[.16em] text-gold-200 transition hover:bg-gold-400/10 sm:inline-flex"
            >
              <Download className="size-3.5" /> Instalar
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="grid size-10 place-items-center rounded-full text-gold-200 2xl:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[80] bg-ink-950/95 backdrop-blur-2xl transition-all duration-500",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!open}
      >
        <div className="absolute -right-24 top-10 size-72 rounded-full bg-violet-600/30 blur-3xl" />
        <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-gold-500/30 text-gold-200">
          <X className="size-5" />
        </button>
        <nav className="relative flex h-full flex-col justify-center gap-1 px-8" aria-label="Menú móvil">
          {links.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-gold-500/15 py-3.5 transition-all"
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms", transform: open ? "none" : "translateY(16px)", opacity: open ? 1 : 0 }}
            >
              <span className="font-caps text-xs tracking-widest text-violet-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-3xl text-cream group-active:text-gold-300 sm:text-4xl">{l.label}</span>
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); window.dispatchEvent(new Event("dresa:install")); }}
            className="btn-gold mt-8 self-start"
          >
            <Download className="size-4" /> Instalar app
          </button>
        </nav>
      </div>
    </>
  );
}
