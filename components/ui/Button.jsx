import Link from "next/link";
import Magnetic from "./Magnetic";

function Roll({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

// Outlined pill (default), solid off-white pill, or dark-on-paper pill.
export default function Button({ href, children, variant = "outline", className = "", magnetic = true, ...rest }) {
  const cls = `pill ${variant === "solid" ? "pill--solid" : ""} ${variant === "dark" ? "pill--dark" : ""} ${className}`;
  const inner = <Roll>{children}</Roll>;

  const el = href ? (
    href.startsWith("mailto:") || href.startsWith("http") ? (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    )
  ) : (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export { Roll };
