import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div role="group" aria-label={`Cantidad de ${label}`} className="inline-flex items-center rounded-ui border border-line bg-surface">
      <button
        type="button"
        aria-label={`Disminuir cantidad de ${label}`}
        className="inline-flex size-11 items-center justify-center rounded-ui hover:bg-white/10 disabled:opacity-35"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Aumentar cantidad de ${label}`}
        className="inline-flex size-11 items-center justify-center rounded-ui hover:bg-white/10 disabled:opacity-35"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
