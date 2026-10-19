import type { Metadata } from "next";
import { CarnesView } from "@/components/carnes/carnes-view";

export const metadata: Metadata = {
  title: "Carnes a domicilio",
  alternates: { canonical: "/carnes/" },
};

export default function CarnesPage() {
  return <CarnesView />;
}
