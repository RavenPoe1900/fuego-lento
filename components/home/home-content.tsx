"use client";

import { useStoreStatus } from "@/lib/use-store-status";
import { DeliveryCoverage } from "./delivery-coverage";
import { FinalCta } from "./final-cta";
import { Hero } from "./hero";
import { HomeFaq } from "./home-faq";
import { HomeMenu } from "./home-menu";
import { HowToOrder } from "./how-to-order";
import { MeatCards } from "./meat-cards";
import { Specialties } from "./specialties";
import { Testimonials } from "./testimonials";

/**
 * Cada bloque responde a una pregunta, en este orden:
 * ¿qué hay? (hero) → ¿qué platos preparados? → ¿qué cortes de la parrilla? → ¿qué carnes para cocinar? →
 * ¿cómo lo pido? → ¿cómo lo recibo? → ¿dudas?
 * Sin carta aprobada solo se muestran los bloques que no dependen de datos de producto.
 */
export function HomeContent() {
  const { showMenu, orderingEnabled } = useStoreStatus();
  return (
    <>
      <Hero />
      {showMenu && (
        <>
          <HomeMenu />
          <Specialties />
          <MeatCards />
          {orderingEnabled && <HowToOrder />}
          <Testimonials />
        </>
      )}
      <FinalCta />
      <DeliveryCoverage />
      <HomeFaq />
    </>
  );
}
