import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPages } from "@/data/legal";

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];
  return { title: page?.title ?? "Legal", robots: { index: false } };
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();
  return (
    <article className="container-x max-w-3xl py-16">
      <h1 className="mb-4 text-5xl">{page.title}</h1>
      <p className="mb-8 rounded-ui border border-gold/40 bg-gold/10 p-4 text-[#e3bd88]">
        Contenido pendiente. Este documento debe ser redactado y revisado legalmente según la ubicación del negocio antes de publicar la web.
      </p>
      <ul className="list-disc space-y-3 pl-5 text-cream2">
        {page.sections.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </article>
  );
}
