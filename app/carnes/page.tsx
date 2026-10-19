import type { Metadata } from "next";
import { CarnesView } from "@/components/carnes/carnes-view";

export const metadata: Metadata = {
  title: "Carnes para cocinar",
  alternates: { canonical: "/carnes/" },
};

export default function CarnesPage() {
  return <CarnesView />;
}
