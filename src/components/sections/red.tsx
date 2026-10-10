"use client";

import { useMemo, useState } from "react";
import { Chapter, Head, Bezel } from "@/components/site/chapter";
import { cn } from "@/lib/utils";

type N = { id: string; x: number; y: number; level: number; parent?: string; name: string; active: boolean };

// Vista demostrativa: estructura de red de tres niveles con datos de muestra.
function build(): N[] {
  const nodes: N[] = [{ id: "yo", x: 300, y: 40, level: 0, name: "Vos", active: true }];
  const l1 = ["Camila", "Lucía", "Martín"];
  const names2 = ["Sofía", "Julián", "Valen", "Agus", "Romina", "Nico", "Paula", "Dante", "Flor"];
  l1.forEach((name, i) => {
    const x = 110 + i * 190;
    nodes.push({ id: `a${i}`, x, y: 150, level: 1, parent: "yo", name, active: true });
    for (let j = 0; j < 3; j++) {
      const k = i * 3 + j;
      nodes.push({ id: `b${k}`, x: x - 70 + j * 70, y: 270, level: 2, parent: `a${i}`, name: names2[k], active: k % 4 !== 3 });
    }
  });
  return nodes;
}

export function Red() {
  const nodes = useMemo(() => build(), []);
  const [level, setLevel] = useState(2);
  const [hover, setHover] = useState<string | null>(null);
  const visible = nodes.filter((n) => n.level <= level);
  const members = visible.length - 1;
  const active = visible.filter((n) => n.level > 0 && n.active).length;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <Chapter id="red" bg="c" flip pos="40% 50%">
      <Head eyebrow="Controle su red" sub="Visualizá quién forma parte de tu red, quién está activo y cómo crece en cada nivel.">
        Su red, <em className="text-amethyst">nivel por nivel.</em>
      </Head>

      <div className="rise mx-auto mt-14 flex max-w-xs justify-center gap-2" role="tablist" aria-label="Nivel de la red">
        {[1, 2].map((l) => (
          <button
            key={l} role="tab" aria-selected={level === l} onClick={() => setLevel(l)}
            className={cn("min-h-11 flex-1 rounded-full border px-5 text-[.68rem] uppercase tracking-[.16em] transition-all duration-500 ease-lux",
              level === l ? "border-gold-400 bg-gold-400 text-ink-950" : "border-gold-500/35 text-cream/75 hover:border-gold-300")}
          >
            Nivel {l}
          </button>
        ))}
      </div>

      <dl className="rise mx-auto mt-6 grid max-w-4xl grid-cols-3 gap-3 sm:gap-5">
        {[["Integrantes", members], ["Activos", active], ["Niveles", level]].map(([k, v]) => (
          <Bezel key={k} inner="px-3 py-6 text-center">
            <dd className="font-display text-5xl leading-none text-gold sm:text-6xl">{v}</dd>
            <dt className="mt-2 text-[.6rem] uppercase tracking-[.18em] text-cream/55 sm:text-[.68rem]">{k}</dt>
          </Bezel>
        ))}
      </dl>

      <Bezel className="rise mx-auto mt-3 max-w-4xl sm:mt-5" inner="p-3 sm:p-8">
        <svg viewBox="0 0 600 320" className="w-full" role="img" aria-label="Diagrama de tu red en niveles">
          <defs>
            <radialGradient id="ng" cx="50%" cy="40%"><stop offset="0" stopColor="#f3e5c8" /><stop offset="1" stopColor="#b8946a" /></radialGradient>
            <radialGradient id="nv" cx="50%" cy="40%"><stop offset="0" stopColor="#d3aaf2" /><stop offset="1" stopColor="#6f3a9f" /></radialGradient>
          </defs>
          {visible.filter((n) => n.parent).map((n) => {
            const p = byId[n.parent!];
            return (
              <path key={`l${n.id}`} d={`M${p.x} ${p.y} C${p.x} ${(p.y + n.y) / 2}, ${n.x} ${(p.y + n.y) / 2}, ${n.x} ${n.y}`}
                fill="none" stroke={n.active ? "#d5b384" : "#6b5a48"} strokeWidth="1.2" strokeDasharray={n.active ? "0" : "4 5"}
                style={n.active ? { strokeDasharray: "6 6", animation: "dash 2.4s linear infinite" } : undefined} opacity=".7" />
            );
          })}
          {visible.map((n) => (
            <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onClick={() => setHover(n.id)} style={{ cursor: "pointer" }}>
              {n.active && <circle cx={n.x} cy={n.y} r="12" fill="none" stroke="#b27fe2" style={{ transformOrigin: `${n.x}px ${n.y}px`, animation: "pulse-ring 2.6s ease-out infinite" }} />}
              <circle cx={n.x} cy={n.y} r={n.level === 0 ? 17 : n.level === 1 ? 13 : 10} fill={n.level === 0 ? "url(#ng)" : n.active ? "url(#nv)" : "#2c2230"} stroke={n.active ? "#e6cca2" : "#6b5a48"} strokeWidth="1" />
              <text x={n.x} y={n.y + (n.level === 0 ? 34 : 28)} textAnchor="middle" fontSize="11" fill={hover === n.id ? "#f3e5c8" : "#f6eee2"} opacity={hover === n.id || n.level < 2 ? 0.9 : 0.6}>{n.name}</text>
            </g>
          ))}
        </svg>
        <div className="flex items-center justify-center gap-6 pb-1 text-xs text-cream/55">
          <span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-violet-500" /> Activo</span>
          <span className="flex items-center gap-2"><i className="size-2.5 rounded-full bg-ink-700 ring-1 ring-gold-600" /> Inactivo</span>
          <span className="text-cream/35">Vista de ejemplo</span>
        </div>
      </Bezel>
    </Chapter>
  );
}
