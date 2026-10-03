import type { ReactNode } from "react";

type Tone = "neutral" | "ember" | "gold" | "ok" | "err";
const tones: Record<Tone, string> = {
  neutral: "bg-white/10 text-cream",
  ember: "bg-ember text-cream",
  gold: "bg-gold/20 text-[#e3bd88] border border-gold/40",
  ok: "bg-ok/20 text-[#a9c79a] border border-ok/40",
  err: "bg-err/15 text-[#f0867b] border border-err/40",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${tones[tone]}`}>
      {children}
    </span>
  );
}
