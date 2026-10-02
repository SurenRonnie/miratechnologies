// Plain mono index label, e.g. "02 / Services". No dots, no badges.
export default function SectionLabel({ index, children, className = "" }) {
  return (
    <p className={`t-label text-dim ${className}`}>
      {index} <span className="px-1 opacity-60">/</span> {children}
    </p>
  );
}
