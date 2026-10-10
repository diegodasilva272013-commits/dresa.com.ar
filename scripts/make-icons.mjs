// Genera iconos PWA y la marca "D" con fondo transparente a partir de public/brand/logo.jpg
import sharp from "sharp";

const src = "public/brand/logo.jpg";
const BG = { r: 11, g: 8, b: 10 };

// Recorte cuadrado de la "D"
const crop = { left: 320, top: 160, width: 620, height: 620 };

const mark = await sharp(src).extract(crop).toBuffer();

// Fondo -> transparente usando la luminancia como alfa
const { data, info } = await sharp(mark).raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
  const m = Math.max(data[i], data[i + 1], data[i + 2]);
  const a = Math.min(255, Math.max(0, (m - 26) * 3.2));
  out[j] = data[i]; out[j + 1] = data[i + 1]; out[j + 2] = data[i + 2]; out[j + 3] = a;
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png().toFile("public/brand/mark.png");

const markPng = await sharp("public/brand/mark.png").toBuffer();
async function icon(size, file, scale) {
  const inner = Math.round(size * scale);
  const m = await sharp(markPng).resize(inner, inner).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 3, background: BG } })
    .composite([{ input: m, gravity: "center" }]).png().toFile(file);
}
await icon(192, "public/icons/icon-192.png", 0.8);
await icon(512, "public/icons/icon-512.png", 0.8);
await icon(512, "public/icons/maskable-512.png", 0.58);
await icon(180, "public/icons/apple-touch-icon.png", 0.78);
await icon(64, "src/app/icon.png", 0.9);
await sharp(src).resize(1200, 1200).jpeg({ quality: 86 }).toFile("public/brand/og.jpg");
console.log("ok");
