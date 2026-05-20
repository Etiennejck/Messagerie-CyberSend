type SecurityBadgeProps = {
  label: string;
  status?: "secure" | "volatile" | "mock";
};

const statusClass = {
  secure: "border-terminal/60 text-terminal",
  volatile: "border-cyanwire/60 text-cyanwire",
  mock: "border-neonviolet/60 text-violet-300"
};

export function SecurityBadge({ label, status = "secure" }: SecurityBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 border bg-black/45 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] shadow-[inset_0_0_18px_rgba(5,255,138,0.035)] backdrop-blur-sm sm:text-xs ${statusClass[status]}`}>
      <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-current" />
      {label}
    </span>
  );
}
