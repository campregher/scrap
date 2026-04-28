export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}
