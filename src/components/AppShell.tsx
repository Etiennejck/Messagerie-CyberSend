import { Flame, Mail, MessageSquare, Radio, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mockUser } from "../lib/session";
import { SecurityBadge } from "./SecurityBadge";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { label: "Accueil", to: "/", icon: Radio },
  { label: "Dashboard", to: "/dashboard", icon: UserRound },
  { label: "Invitation", to: "/invite", icon: Mail },
  { label: "Messagerie", to: "/session", icon: MessageSquare },
  { label: "Burn", to: "/session?burn=1", icon: Flame }
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-terminal/20 bg-void/88 px-4 py-3 shadow-[0_0_28px_rgba(5,255,138,0.1)] backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="terminal-glow-text text-xl font-black uppercase tracking-[0.18em] text-terminal sm:text-2xl">
              CYBERSEND
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <SecurityBadge label="SECURE MODE" />
            </div>
          </div>

          <nav aria-label="Global navigation" className="terminal-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:overflow-visible lg:pb-0">
            {navItems.map(({ label, to, icon: Icon }) => {
              const itemPath = to.split("?")[0];
              const targetHasSearch = to.includes("?");
              const active = targetHasSearch
                ? `${location.pathname}${location.search}` === to
                : itemPath === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(itemPath) && !location.search;
              return (
                <Link
                  key={label}
                  to={to}
                  className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition duration-200 sm:px-4 ${
                    active
                      ? "border-terminal/60 bg-terminal/15 text-white shadow-command"
                      : "border-terminal/20 bg-black/25 text-emerald-100/75 hover:border-cyanwire/60 hover:text-cyanwire"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <SecurityBadge label="SECURE MODE" />
            <div className="rounded-xl border border-terminal/25 bg-black/35 px-3 py-2 text-xs text-emerald-100/80">
              <span className="mr-2 text-cyanwire">user</span>
              <span className="text-terminal">{mockUser.handle}</span>
            </div>
          </div>
        </div>
        {!isHome ? (
          <div className="mx-auto mt-3 w-full max-w-7xl">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-cyanwire/30 bg-cyanwire/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyanwire transition hover:border-cyanwire/70 hover:bg-cyanwire/10 focus:outline-none focus-visible:shadow-focusRing"
            >
              cd .. / back
            </button>
          </div>
        ) : null}
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
