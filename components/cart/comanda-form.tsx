"use client";

import type { InputHTMLAttributes } from "react";
import { useCheckout } from "@/store/checkout-store";

const control = (error?: string) =>
  `w-full min-h-12 rounded-ui border bg-surface px-3 text-base text-cream placeholder:text-muted transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 ${error ? "border-err" : "border-line"}`;

/** Datos mínimos para enviar el pedido por WhatsApp: nombre, dirección (si es a domicilio) y notas. */
export function ComandaForm({ errors }: { errors: Record<string, string> }) {
  const method = useCheckout((s) => s.deliveryMethod);
  const customer = useCheckout((s) => s.customer);
  const address = useCheckout((s) => s.address);
  const set = useCheckout((s) => s.set);

  return (
    <div className="space-y-4">
      <Field id="name" label="Nombre" required error={errors.name} autoComplete="name" value={customer.name} onChange={(e) => set({ customer: { ...customer, name: e.target.value } })} />
      {method === "delivery" && (
        <Field id="street" label="Dirección" required error={errors.street} autoComplete="street-address" placeholder="Calle, número, apartamento y referencias" value={address.street} onChange={(e) => set({ address: { street: e.target.value } })} />
      )}
      <div className="space-y-1.5">
        <label htmlFor="notes" className="block text-sm font-medium">Notas para el pedido <span className="text-cream2">(opcional)</span></label>
        <textarea id="notes" maxLength={300} rows={2} className={`${control()} py-2.5`} value={customer.notes} onChange={(e) => set({ customer: { ...customer, notes: e.target.value } })} />
      </div>
    </div>
  );
}

function Field({ id, label, required, error, ...rest }: { id: string; label: string; required?: boolean; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? <span className="text-fire" aria-hidden> *</span> : null}
      </label>
      <input id={id} name={id} aria-required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={control(error)} {...rest} />
      {error && <p id={`${id}-err`} role="alert" className="text-sm text-err">{error}</p>}
    </div>
  );
}
