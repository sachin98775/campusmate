export default function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl bg-white shadow-lg border border-gray-200",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

