import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "DRESA · Belleza y estilo a domicilio",
    short_name: "DRESA",
    description: "Elevamos tu imagen y tu belleza a otro nivel, en tu domicilio.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0709",
    theme_color: "#0a0709",
    lang: "es-AR",
    categories: ["beauty", "lifestyle", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Regístrese ya", url: "/#registro" },
      { name: "Billetera virtual", url: "/#billetera" },
      { name: "Atención al cliente", url: "/#atencion" },
    ],
  };
}
