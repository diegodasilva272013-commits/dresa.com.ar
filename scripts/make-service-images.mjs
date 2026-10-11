// Optimiza las fotos de servicios: recorta bordes/franjas oscuras y exporta WebP nítido 4:5.
// Uso: node scripts/make-service-images.mjs <carpeta-con-las-fotos>
import sharp from "sharp";
import path from "node:path";

const dir = process.argv[2];
const map = {
  depilacion: 10, peluqueria: 11, "cejas-pestanas": 12, barberia: 14, unas: 17,
  estetica: 18, "imagen-estilo": 19, maquillaje: 20, cosmetologia: 21, masajes: 22,
};

for (const [id, n] of Object.entries(map)) {
  const src = path.join(dir, `${n}.jpg`);
  const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  // Última fila "con imagen": se descarta la franja oscura inferior (viñeta de la foto).
  let bottom = h;
  for (let y = h - 1; y > h * 0.7; y--) {
    let sum = 0;
    for (let x = Math.floor(w * 0.1); x < w * 0.9; x++) sum += data[y * w + x];
    if (sum / (w * 0.8) > 38) { bottom = y + 1; break; }
  }
  const m = 8; // borde negro fino de las fotos
  const crop = { left: m, top: m, width: w - 2 * m, height: Math.min(bottom, h - m) - m };
  await sharp(src).extract(crop)
    .resize(720, 900, { fit: "cover", position: sharp.strategy.attention })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 84 })
    .toFile(`public/services/${id}.webp`);
  console.log(id, "alto útil", crop.height);
}
