import { LinkButton } from "@/components/shared/button";

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center gap-4 py-28 text-center">
      <h1 className="text-6xl">Esta página se quemó</h1>
      <p className="text-cream2">No encontramos lo que buscabas.</p>
      <LinkButton href="/">Volver al inicio</LinkButton>
    </div>
  );
}
