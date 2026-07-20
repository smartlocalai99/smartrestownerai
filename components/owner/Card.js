export default function Card({ className = "", children }) {
  return (
    <div className={`shadow-soft rounded-2xl border border-line/60 bg-surface p-4 ${className}`}>
      {children}
    </div>
  );
}
