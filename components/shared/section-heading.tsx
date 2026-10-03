import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
  onLight,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
  /** Sobre fondo crema */
  onLight?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`mb-10 max-w-2xl lg:mb-12 ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${onLight ? "!text-ember" : ""}`}>{eyebrow}</p>}
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      {description && <p className={`lead mt-3 ${onLight ? "text-ink/75" : "text-cream2"}`}>{description}</p>}
      {children}
    </div>
  );
}
