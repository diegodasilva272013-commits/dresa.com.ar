"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "dresa-install-dismissed";

export function PwaRegister() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === "1"; } catch {}
    if (standalone || dismissed) return;

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let timer: number | undefined;
    if (isIos) {
      timer = window.setTimeout(() => { setIos(true); setOpen(true); }, 9000);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
      timer = window.setTimeout(() => setOpen(true), 9000);
    };
    const onInstalled = () => { setOpen(false); setDeferred(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    // Permite que el botón "Instalar" del header abra el aviso.
    const onAsk = () => setOpen(true);
    window.addEventListener("dresa:install", onAsk);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("dresa:install", onAsk);
    };
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  };

  if (!open || (!deferred && !ios)) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar DRESA"
      className="fixed inset-x-3 z-[90] flex items-center gap-4 rounded-[1.4rem] border border-gold-500/30 bg-ink-900/95 p-3.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)] sm:right-auto sm:left-5 sm:w-[26rem]"
      style={{ bottom: "max(5.5rem, calc(4.75rem + env(safe-area-inset-bottom)))" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon-192.png" alt="" width={48} height={48} className="size-12 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight text-gold-200">Instalá DRESA en tu dispositivo</p>
        {ios && !deferred ? (
          <p className="mt-0.5 text-xs leading-snug text-cream/70">
            Tocá <Share className="mx-0.5 inline size-3.5 -translate-y-px" aria-label="Compartir" /> y elegí
            “Agregar a pantalla de inicio”.
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-cream/70">Acceso directo, pantalla completa y modo sin conexión.</p>
        )}
      </div>
      {deferred && (
        <button onClick={install} className="btn-gold !min-h-10 !px-4 !text-[.7rem]">
          <Download className="size-3.5" /> Instalar
        </button>
      )}
      <button onClick={close} aria-label="Cerrar" className="grid size-9 shrink-0 place-items-center rounded-full text-cream/60 hover:text-cream">
        <X className="size-4" />
      </button>
    </div>
  );
}
