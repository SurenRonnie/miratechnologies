export default function Arrow({ dir = "right", size = 14 }) {
  const rotate = { right: 0, left: 180, up: -90, down: 90, "up-right": -45 }[dir] ?? 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}
