import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full min-h-[52px] rounded-ui border bg-surface2 px-4 text-base text-cream placeholder:text-muted transition-colors focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/40";

function Wrapper({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? <span className="text-fire" aria-hidden> *</span> : <span className="ml-1 text-cream2">(opcional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-cream2">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-sm text-err">
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, error?: string, hint?: string) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined);

type Common = { id: string; label: string; error?: string; hint?: string; required?: boolean };

export function TextField({ id, label, error, hint, required, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        name={id}
        required={false}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describe(id, error, hint)}
        className={`${control} ${error ? "border-err" : "border-line"}`}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextAreaField({ id, label, error, hint, required, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={describe(id, error, hint)}
        className={`${control} min-h-24 py-3 ${error ? "border-err" : "border-line"}`}
        {...rest}
      />
    </Wrapper>
  );
}

export function SelectField({ id, label, error, hint, required, children, ...rest }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        name={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describe(id, error, hint)}
        className={`${control} ${error ? "border-err" : "border-line"}`}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}
