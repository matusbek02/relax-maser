export function LeafOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M10 190C10 190 60 170 95 130C130 90 145 40 145 10" />
      <path d="M40 165c-8-18-2-34 10-42 6 14 4 32-10 42Z" />
      <path d="M40 165c18 6 34-2 41-14-14-7-32-6-41 14Z" />
      <path d="M75 130c-9-17-4-34 8-42 7 13 6 31-8 42Z" />
      <path d="M75 130c18 5 33-3 40-16-14-6-32-4-40 16Z" />
      <path d="M107 92c-9-17-5-34 6-43 8 13 7 31-6 43Z" />
      <path d="M107 92c18 4 33-5 39-18-14-5-32-2-39 18Z" />
      <path d="M129 52c-8-17-3-34 8-42 7 13 6 31-8 42Z" />
      <path d="M129 52c18 5 33-4 39-17-14-6-32-3-39 17Z" />
      <circle cx="145" cy="12" r="3" />
    </svg>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="rule-gold w-16 sm:w-28" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2c3 4 4 7 4 10a4 4 0 1 1-8 0c0-3 1-6 4-10Z" />
        <path d="M12 12v10" />
      </svg>
      <span className="rule-gold w-16 sm:w-28" />
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="text-center">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="mt-4 text-4xl sm:text-5xl text-gilded">{title}</h2>
      <Divider className="mt-6" />
    </div>
  );
}