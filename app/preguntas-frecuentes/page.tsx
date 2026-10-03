import type { Metadata } from "next";
import { FaqPage } from "@/components/home/faq-page";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  alternates: { canonical: "/preguntas-frecuentes/" },
};

export default function Page() {
  return <FaqPage />;
}
