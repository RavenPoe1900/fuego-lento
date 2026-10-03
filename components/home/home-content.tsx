"use client";

import { useStoreStatus } from "@/lib/use-store-status";
import { DeliveryCoverage } from "./delivery-coverage";
import { Experience } from "./experience";
import { Families } from "./families";
import { FinalCta } from "./final-cta";
import { Hero } from "./hero";
import { HomeMenu } from "./home-menu";
import { Manifesto } from "./manifesto";
import { Pause } from "./pause";
import { Specialties } from "./specialties";
import { Testimonials } from "./testimonials";
import { TrustStrip } from "./trust-strip";

/**
 * Dos recorridos sobre una misma página:
 * - Rápido: hero → menú → producto → carrito o estado del servicio.
 * - Exploratorio: hero → manifiesto → familias → menú → especialidades → experiencia → confianza → cobertura.
 * Cada sección tiene una composición distinta. Sin menú aprobado solo se muestran las que no dependen de datos de producto.
 */
export function HomeContent() {
  const { showMenu } = useStoreStatus();
  return (
    <>
      <Hero />
      <Manifesto />
      {showMenu && (
        <>
          <Families />
          <HomeMenu />
          <Pause />
          <Specialties />
          <Experience />
          <TrustStrip />
          <Testimonials />
        </>
      )}
      <FinalCta />
      <DeliveryCoverage />
    </>
  );
}
