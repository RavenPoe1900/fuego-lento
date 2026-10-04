"use client";

import type { InputHTMLAttributes } from "react";
import { useCheckout } from "@/store/checkout-store";

const control = (error?: string) =>
  `w-full min-h-11 rounded-ui border bg-transparent px-3 text-[0.9375rem] text-cream placeholder:text-muted transition-colors focus:border-gold focus:outline-none ${error ? "border-err" : "border-line"}`;

/** Datos mínimos para enviar la comanda directamente por WhatsApp. */
export function ComandaForm({ errors }: { errors: Record<string, string> }) {
  const method = useCheckout((s) => s.deliveryMethod);
  const customer = useCheckout((s) => s.customer);
  const address = useCheckout((s) => s.address);
  const set = useCheckout((s) => s.set);

  return (
    <div className="space-y-4">
      <Field id="name" label="Nombre" error={errors.name} autoComplete="name" value={customer.name} onChange={(e) => set({ customer: { ...customer, name: e.target.value } })} />
      {method === "delivery" && (
        <Field id="street" label="Dirección" error={errors.street} autoComplete="street-address" placeholder="Calle, número, referencia" value={address.street} onChange={(e) => set({ address: { ...address, street: e.target.value } })} />
      )}
      <div className="space-y-1.5">
        <label htmlFor="notes" className="block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold">Notas</label>
        <textarea id="notes" maxLength={300} rows={2} className={`${control()} py-2.5`} value={customer.notes} onChange={(e) => set({ customer: { ...customer, notes: e.target.value } })} />
      </div>
    </div>
  );
}

function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold">{label}</label>
      <input id={id} name={id} aria-required aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={control(error)} {...rest} />
      {error && <p id={`${id}-err`} role="alert" className="text-sm text-err">{error}</p>}
    </div>
  );
}
