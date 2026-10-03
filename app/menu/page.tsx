import type { Metadata } from "next";
import { MenuView } from "@/components/menu/menu-view";

export const metadata: Metadata = {
  title: "Menú",
  alternates: { canonical: "/menu/" },
};

export default function MenuPage() {
  return <MenuView />;
}
