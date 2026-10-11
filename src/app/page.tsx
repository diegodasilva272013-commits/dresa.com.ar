import { Hero } from "@/components/site/hero";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Manifiesto } from "@/components/sections/manifiesto";
import { Servicios } from "@/components/sections/servicios";
import { Registro } from "@/components/sections/registro";
import { Recomendar } from "@/components/sections/recomendar";
import { Red } from "@/components/sections/red";
import { Carrito } from "@/components/sections/carrito";
import { Billetera } from "@/components/sections/billetera";
import { Testimonios } from "@/components/sections/testimonios";
import { Atencion } from "@/components/sections/atencion";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifiesto />
        <Servicios />
        <Registro />
        <Recomendar />
        <Red />
        <Carrito />
        <Billetera />
        <Testimonios />
        <Atencion />
      </main>
      <Footer />
    </>
  );
}
