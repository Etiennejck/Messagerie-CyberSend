import { KeyRound, LogIn, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { SecurityBadge } from "../components/SecurityBadge";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalLine } from "../components/TerminalLine";
import { TerminalWindow } from "../components/TerminalWindow";

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full place-items-center gap-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <section className="max-w-3xl">
          <div className="mb-5 flex flex-wrap gap-2 sm:mb-6">
            <SecurityBadge label="SECURE MODE" />
            <SecurityBadge label="NO MESSAGE STORAGE" status="volatile" />
          </div>
          <h1 className="terminal-glow-text text-5xl font-black uppercase leading-none text-terminal sm:text-7xl lg:text-8xl">CyberSend</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-100/80 sm:text-lg">Private terminal messaging. No history. No traces.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-[1.15fr_0.9fr_0.62fr]">
            <Link to="/session" className="min-w-0">
              <TerminalButton className="w-full sm:w-auto">
                <Play size={16} />
                Start secure session
              </TerminalButton>
            </Link>
            <Link to="/register" className="min-w-0">
              <TerminalButton variant="ghost" className="w-full sm:w-auto">
                <KeyRound size={16} />
                Create account
              </TerminalButton>
            </Link>
            <Link to="/login" className="min-w-0">
              <TerminalButton variant="ghost" className="w-full sm:w-auto">
                <LogIn size={16} />
                Login
              </TerminalButton>
            </Link>
          </div>
        </section>

        <TerminalWindow title="boot.sequence">
          <TerminalLine>initializing volatile memory</TerminalLine>
          <TerminalLine tone="cyan">loading browser crypto module</TerminalLine>
          <TerminalLine tone="muted">messages: local state only</TerminalLine>
          <TerminalLine tone="muted">persistence: contacts, invites, public keys only</TerminalLine>
          <TerminalLine>
            ready<span className="terminal-cursor" aria-hidden="true" />
          </TerminalLine>
        </TerminalWindow>
      </div>
    </main>
  );
}
