import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_REVIEW_NOTE, LEGAL_UPDATED, legalPages } from "@/data/legal";

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];
  return { title: page?.title ?? "Legal" };
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();
  return (
    <article className="container-x max-w-3xl py-14 lg:py-20">
      <h1 className="t-h2">{page.title}</h1>
      <p className="lead mt-4 text-cream2">{page.intro}</p>
      <p className="mt-3 text-[0.875rem] text-muted">Última actualización: {LEGAL_UPDATED}. {LEGAL_REVIEW_NOTE}</p>
      <div className="mt-10 space-y-9">
        {page.sections.map((s, i) => (
          <section key={s.heading} aria-labelledby={`sec-${i}`}>
            <h2 id={`sec-${i}`} className="text-[1.5rem] leading-tight">{s.heading}</h2>
            <div className="mt-3 max-w-[65ch] space-y-3 text-base leading-relaxed text-cream2">
              {s.body.map((p) => (<p key={p}>{p}</p>))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
