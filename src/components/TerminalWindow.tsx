import type { ReactNode } from "react";

type TerminalWindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export function TerminalWindow({ title, children, className = "", actions }: TerminalWindowProps) {
  return (
    <section className={`terminal-window overflow-hidden border border-terminal/40 bg-panel/90 shadow-terminal backdrop-blur-md transition duration-300 ${className}`}>
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-terminal/25 bg-void/86 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-terminal shadow-[0_0_12px_rgba(5,255,138,0.9)]" aria-hidden="true" />
          <span className="truncate text-[0.7rem] uppercase tracking-[0.22em] text-cyanwire sm:text-xs">{title}</span>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className="relative z-10 p-4 sm:p-6">{children}</div>
    </section>
  );
}
