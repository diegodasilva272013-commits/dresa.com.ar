"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Conv = {
  endSession: () => Promise<void>;
  setMicMuted: (m: boolean) => void;
  getInputVolume: () => number;
  getOutputVolume: () => number;
  getInputByteFrequencyData: () => Uint8Array;
  getOutputByteFrequencyData: () => Uint8Array;
};
type Phase = "idle" | "connecting" | "live" | "error";
type Mode = "speaking" | "listening";

const BARS = 72;

/** Agente de voz de DRESA (ElevenLabs) con interfaz propia a pantalla completa. */
export function VoiceAgent() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<Mode>("listening");
  const [muted, setMuted] = useState(false);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState("");

  const conv = useRef<Conv | null>(null);
  const session = useRef(0); // identifica cada intento de llamada: si se cuelga antes de conectar, se descarta
  const canvas = useRef<HTMLCanvasElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("listening");
  const open = phase !== "idle";

  const stop = useCallback(async () => {
    const c = conv.current;
    conv.current = null;
    session.current += 1;
    setPhase("idle"); setMuted(false); setSecs(0); setError("");
    try { await c?.endSession(); } catch {}
  }, []);

  const start = useCallback(async () => {
    const id = ++session.current;
    setPhase("connecting"); setError(""); setMode("listening"); modeRef.current = "listening";
    try {
      // El permiso del micrófono se pide acá, con el gesto del usuario.
      await navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => s.getTracks().forEach((t) => t.stop()));
      const { Conversation } = await import("@elevenlabs/client");
      const c = await Conversation.startSession({
        agentId: site.agentId,
        connectionType: "webrtc",
        onConnect: () => { if (id === session.current) setPhase("live"); },
        onDisconnect: () => { if (id !== session.current) return; conv.current = null; setPhase("idle"); setMuted(false); setSecs(0); },
        onModeChange: ({ mode: m }: { mode: string }) => {
          const next: Mode = m === "speaking" ? "speaking" : "listening";
          modeRef.current = next; setMode(next);
        },
        onError: () => { if (id !== session.current) return; setError("Se cortó la conexión. Probá de nuevo."); setPhase("error"); },
      });
      if (id !== session.current) { await c.endSession().catch(() => {}); return; } // se colgó mientras conectaba
      conv.current = c as unknown as Conv;
    } catch (e) {
      if (id !== session.current) return;
      const denied = e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError");
      setError(denied
        ? "Necesitamos acceso al micrófono para hablar con DRESA. Habilitalo en los permisos del navegador."
        : "No pudimos iniciar la llamada. Probá de nuevo en unos segundos.");
      setPhase("error");
    }
  }, []);

  // Cronómetro de la llamada
  useEffect(() => {
    if (phase !== "live") return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Bloqueo de scroll + Escape para colgar
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && void stop();
    window.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, stop]);

  // Colgar al salir de la página
  useEffect(() => () => { void conv.current?.endSession().catch(() => {}); }, []);

  // Animación del orbe: sin estado de React, directo al DOM en cada frame.
  useEffect(() => {
    if (!open) return;
    const cv = canvas.current, el = orb.current;
    if (!cv || !el) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, level = 0;
    const t0 = performance.now();

    const fit = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = cv.getBoundingClientRect();
      cv.width = Math.round(width * d); cv.height = Math.round(height * d);
    };
    fit();
    window.addEventListener("resize", fit);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const c = conv.current;
      const speaking = modeRef.current === "speaking";
      let raw = 0;
      let freq: Uint8Array | null = null;
      if (c) {
        try {
          raw = speaking ? c.getOutputVolume() : c.getInputVolume();
          freq = speaking ? c.getOutputByteFrequencyData() : c.getInputByteFrequencyData();
        } catch {}
      }
      const idle = 0.04 + 0.025 * Math.sin((now - t0) / 700); // respiración suave
      const target = reduce ? 0.06 : Math.max(idle, Math.min(1, raw * 1.6));
      level += (target - level) * 0.22;
      el.style.setProperty("--lvl", level.toFixed(3));
      el.style.transform = `scale(${1 + level * 0.55})`;

      const { width: w, height: h } = cv;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, base = Math.min(w, h) * 0.285;
      ctx.lineCap = "round";
      for (let i = 0; i < BARS; i++) {
        const a = (i / BARS) * Math.PI * 2 - Math.PI / 2;
        const v = freq && freq.length ? freq[Math.floor((i / BARS) * Math.min(freq.length, 96))] / 255 : 0;
        const len = (reduce ? 0.02 : 0.04 + v * 0.34 + level * 0.06) * Math.min(w, h) * 0.5;
        const r1 = base * (1 + level * 0.55) + 14, r2 = r1 + len;
        const g = ctx.createLinearGradient(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        g.addColorStop(0, speaking ? "rgba(230,204,162,.95)" : "rgba(178,127,226,.95)");
        g.addColorStop(1, speaking ? "rgba(178,127,226,0)" : "rgba(230,204,162,0)");
        ctx.strokeStyle = g; ctx.lineWidth = Math.max(2, w * 0.0042);
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
  }, [open]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try { conv.current?.setMicMuted(next); } catch {}
  };

  const label =
    phase === "connecting" ? "Conectando…"
    : phase === "error" ? "No se pudo conectar"
    : muted ? "Micrófono silenciado"
    : mode === "speaking" ? "DRESA está hablando"
    : "Te escucho";
  const time = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <>
      {/* Botón flotante: oculto mientras dura la llamada */}
      <button
        type="button"
        onClick={start}
        aria-label="Hablar con DRESA por voz"
        className={cn(
          "group fixed right-[4.75rem] z-[60] flex h-14 items-center gap-3 rounded-full border border-gold-300/50 py-0 pl-1.5 pr-5 shadow-[0_18px_50px_-12px_rgba(149,88,202,.7)] transition-all duration-500 ease-lux hover:-translate-y-0.5 active:scale-[.97] sm:right-[5.5rem]",
          "bg-[linear-gradient(110deg,#f1dcb2,#cfa971_50%,#b8946a)] text-[#1a1008]",
          open && "pointer-events-none translate-y-4 opacity-0",
        )}
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <span className="relative grid size-11 place-items-center rounded-full bg-ink-950 text-gold-200">
          <span aria-hidden className="absolute inset-0 rounded-full border border-violet-400/70" style={{ animation: "pulse-ring 2.4s ease-out infinite" }} />
          <PhoneCall className="size-5" strokeWidth={1.4} />
        </span>
        <span className="text-[.72rem] font-medium uppercase tracking-[.18em]">Hablá con DRESA</span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Llamada con DRESA" className="fixed inset-0 z-[95] flex flex-col overflow-hidden bg-ink-950" style={{ animation: "voice-in .6s cubic-bezier(.32,.72,0,1)" }}>
          {/* Fondo: mármol de marca + resplandores */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/marble-d.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-40" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,rgba(111,58,159,.35),transparent_70%),linear-gradient(180deg,rgba(10,7,9,.7),rgba(10,7,9,.92))]" />

          <header className="relative flex items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/mark.png" alt="" width={36} height={36} className="size-9 object-contain" />
              <span className="font-caps text-sm tracking-[.34em] text-gold-200">DRESA</span>
            </div>
            <span className="font-caps text-sm tabular-nums tracking-[.2em] text-gold-300">{phase === "live" ? time : ""}</span>
          </header>

          {/* Orbe */}
          <div className="relative flex flex-1 items-center justify-center">
            <canvas ref={canvas} aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[min(96vw,80svh,46rem)] -translate-x-1/2 -translate-y-1/2" />
            <div
              ref={orb}
              aria-hidden
              className="relative aspect-square w-[min(56vw,40svh,23rem)] rounded-full will-change-transform"
              style={{
                background: mode === "speaking"
                  ? "radial-gradient(circle at 35% 30%, #fbf0d6 0%, #e6cca2 28%, #b8946a 58%, #6f3a9f 100%)"
                  : "radial-gradient(circle at 35% 30%, #ead3fb 0%, #b27fe2 30%, #7a3fb5 62%, #2a1245 100%)",
                boxShadow: "0 0 calc(40px + var(--lvl,0) * 160px) calc(var(--lvl,0) * 36px) rgba(149,88,202,.55), inset 0 0 60px rgba(255,255,255,.18)",
                transition: "background .6s ease",
                opacity: phase === "connecting" ? 0.7 : 1,
                animation: phase === "connecting" ? "voice-wait 1.6s ease-in-out infinite" : undefined,
              }}
            >
              {/* Brillo interno */}
              <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.55),transparent_46%)] mix-blend-soft-light" />
            </div>
          </div>

          <div className="relative px-6 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
            <p aria-live="polite" className="font-display text-3xl text-cream sm:text-4xl">{label}</p>
            {phase === "error" && <p role="alert" className="mx-auto mt-3 max-w-sm text-sm text-cream/70">{error}</p>}
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button" onClick={toggleMute} disabled={phase !== "live"}
                aria-label={muted ? "Activar micrófono" : "Silenciar micrófono"} aria-pressed={muted}
                className={cn("grid size-16 place-items-center rounded-full border transition-all duration-500 ease-lux active:scale-95 disabled:opacity-40",
                  muted ? "border-gold-300 bg-gold-400 text-ink-950" : "border-gold-500/50 bg-white/5 text-gold-100")}
              >
                {muted ? <MicOff className="size-6" strokeWidth={1.4} /> : <Mic className="size-6" strokeWidth={1.4} />}
              </button>
              {phase === "error" && (
                <button type="button" onClick={start} className="btn-gold !min-h-16">Reintentar</button>
              )}
              <button
                type="button" onClick={() => void stop()} autoFocus
                aria-label="Colgar"
                className="grid size-20 place-items-center rounded-full bg-[#d6403f] text-white shadow-[0_18px_44px_-10px_rgba(214,64,63,.8)] transition-all duration-500 ease-lux hover:scale-105 active:scale-95"
              >
                <PhoneOff className="size-8" strokeWidth={1.5} />
              </button>
            </div>
            <p className="mt-5 text-xs text-cream/45">Tu voz se procesa para responderte. Colgá cuando quieras.</p>
          </div>
        </div>
      )}
    </>
  );
}
