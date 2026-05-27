import type { ButtonHTMLAttributes, ReactNode } from "react";

type TerminalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
};

const variants = {
  primary: "border-terminal/70 bg-terminal/10 text-terminal hover:border-terminal hover:bg-terminal/20 hover:text-white",
  ghost: "border-cyanwire/50 bg-cyanwire/5 text-cyanwire hover:border-cyanwire/80 hover:bg-cyanwire/10 hover:text-white",
  danger: "border-red-400/60 bg-red-500/10 text-red-300 hover:border-red-300/80 hover:bg-red-500/20 hover:text-white"
};

export function TerminalButton({ children, variant = "primary", className = "", ...props }: TerminalButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] shadow-command transition duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:shadow-focusRing active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
