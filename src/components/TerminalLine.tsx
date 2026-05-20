import type { ReactNode } from "react";

type TerminalLineProps = {
  prefix?: string;
  children: ReactNode;
  tone?: "normal" | "muted" | "danger" | "cyan";
};

const toneClass = {
  normal: "text-terminal",
  muted: "text-emerald-200/70",
  danger: "text-red-300",
  cyan: "text-cyanwire"
};

export function TerminalLine({ prefix = ">", children, tone = "normal" }: TerminalLineProps) {
  return (
    <p className={`break-words text-sm leading-7 sm:text-[0.95rem] ${toneClass[tone]}`}>
      <span className="mr-2 select-none text-cyanwire/80">{prefix}</span>
      <span>{children}</span>
    </p>
  );
}
