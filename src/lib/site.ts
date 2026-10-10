export const site = {
  name: "DRESA",
  domain: "dresa.com.ar",
  url: "https://www.dresa.com.ar",
  tagline: "Elevamos tu imagen y tu belleza a otro nivel, en tu domicilio.",
  // WhatsApp de DRESA (formato internacional, sin + ni espacios). Se puede cambiar con NEXT_PUBLIC_WHATSAPP.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5491164795516",
};

export const services = [
  { id: "peluqueria", name: "Peluquería", line: "Color, corte y brillo de salón, sin salir de casa." },
  { id: "barberia", name: "Barbería", line: "Fade, barba y ritual clásico con precisión de maestro." },
  { id: "unas", name: "Uñas", line: "Manicura y diseño de autor. Detalle en cada milímetro." },
  { id: "maquillaje", name: "Maquillaje", line: "Piel de campaña para tus noches y tus días importantes." },
  { id: "cejas-pestanas", name: "Cejas y Pestañas", line: "Mirada definida, natural y de larga duración." },
  { id: "masajes", name: "Masajes", line: "Descontracturantes y de relax. Tu living, tu spa." },
  { id: "estetica", name: "Estética", line: "Tratamientos faciales y corporales con técnica profesional." },
  { id: "imagen-estilo", name: "Imagen y Estilo", line: "Asesoría integral para que tu imagen hable por vos." },
  { id: "cosmetologia", name: "Cosmetología", line: "Cuidado de la piel guiado por especialistas." },
  { id: "depilacion", name: "Depilación", line: "Suavidad duradera, con la máxima comodidad." },
] as const;

export const accesos = [
  { id: "registro", label: "Regístrese ya" },
  { id: "recomendar", label: "Recomendar ya" },
  { id: "red", label: "Controle su red" },
  { id: "carrito", label: "Carrito de compras" },
  { id: "billetera", label: "Billetera virtual" },
  { id: "testimonios", label: "Testimonio" },
  { id: "atencion", label: "Atención al cliente" },
] as const;

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
