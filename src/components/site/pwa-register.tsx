"use client";

import { useEffect, useState } from "react";
import { Check, Download, EllipsisVertical, Share, SquarePlus, X } from "lucide-react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type Platform = "ios" | "android" | "other";

const DISMISS_KEY = "dresa-install-dismissed";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  // iPadOS 13+ se identifica como Mac con pantalla táctil
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/i.test(ua) || iPadOS) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

/** Registra el service worker y ofrece la instalación como app en cualquier celular. */
export function PwaRegister() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [platform, setPlatform] = useState<Platform>("other");
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const p = detectPlatform();
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === "1"; } catch {}

    let timer: number | undefined;
    const init = window.setTimeout(() => {
      setPlatform(p);
      setInstalled(standalone);
      // Aviso automático, una sola vez, solo en celulares y si todavía no está instalada
      if (!standalone && !dismissed && p !== "other") timer = window.setTimeout(() => setOpen(true), 9000);
    }, 0);

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as InstallEvent); };
    const onInstalled = () => { setInstalled(true); setOpen(false); setDeferred(null); };
    const onAsk = () => setOpen(true); // botón "Instalar" del menú
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("dresa:install", onAsk);
    return () => {
      window.clearTimeout(init); window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("dresa:install", onAsk);
    };
  }, []);

  function close() {
    setOpen(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  }

  if (!open) return null;

  const step = "flex items-center gap-3 rounded-2xl border border-gold-500/20 bg-white/[.03] p-3.5 text-left";
  const ico = "grid size-10 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300";

  return (
    <div className="fixed inset-0 z-[96] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Instalar DRESA">
      <button className="absolute inset-0 bg-black/70" onClick={close} aria-label="Cerrar" />
      <div
        className="relative w-full max-w-md rounded-t-[2rem] border border-gold-500/30 bg-ink-900 p-6 shadow-[0_-20px_80px_-20px_rgba(0,0,0,.9)] sm:rounded-[2rem]"
        style={{ paddingBottom: "max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))", animation: "sheet-in .5s cubic-bezier(.32,.72,0,1)" }}
      >
        <button onClick={close} aria-label="Cerrar" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-cream/60 hover:text-cream">
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-4 pr-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" width={56} height={56} className="size-14 rounded-2xl" />
          <div>
            <p className="font-display text-2xl leading-tight text-gold-200">Instalá DRESA</p>
            <p className="text-sm text-cream/60">Abrila como una app, desde tu pantalla de inicio.</p>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {installed ? (
            <div className={step}><span className={ico}><Check className="size-5" /></span><p className="text-sm text-cream/80">DRESA ya está instalada en este dispositivo.</p></div>
          ) : deferred ? (
            <button onClick={install} className="btn-gold w-full"><Download className="size-4" /> Instalar ahora</button>
          ) : platform === "ios" ? (
            <>
              <div className={step}><span className={ico}><Share className="size-5" strokeWidth={1.5} /></span><p className="text-sm text-cream/85"><b className="font-medium text-gold-200">1.</b> Tocá el botón <b className="font-medium">Compartir</b> de Safari (el cuadrado con la flecha hacia arriba).</p></div>
              <div className={step}><span className={ico}><SquarePlus className="size-5" strokeWidth={1.5} /></span><p className="text-sm text-cream/85"><b className="font-medium text-gold-200">2.</b> Elegí <b className="font-medium">Agregar a pantalla de inicio</b>.</p></div>
              <div className={step}><span className={ico}><Check className="size-5" strokeWidth={1.5} /></span><p className="text-sm text-cream/85"><b className="font-medium text-gold-200">3.</b> Tocá <b className="font-medium">Agregar</b>. Listo, DRESA queda en tu iPhone.</p></div>
              <p className="pt-1 text-xs text-cream/45">Si no ves esa opción, abrí esta página desde Safari.</p>
            </>
          ) : (
            <>
              <div className={step}><span className={ico}><EllipsisVertical className="size-5" strokeWidth={1.5} /></span><p className="text-sm text-cream/85"><b className="font-medium text-gold-200">1.</b> Tocá el menú <b className="font-medium">⋮</b> del navegador.</p></div>
              <div className={step}><span className={ico}><Download className="size-5" strokeWidth={1.5} /></span><p className="text-sm text-cream/85"><b className="font-medium text-gold-200">2.</b> Elegí <b className="font-medium">Instalar aplicación</b> o <b className="font-medium">Agregar a pantalla principal</b>.</p></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
