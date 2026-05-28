import { Flame, KeyRound, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SecurityBadge } from "../components/SecurityBadge";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalLine } from "../components/TerminalLine";
import { TerminalWindow } from "../components/TerminalWindow";
import { getContacts } from "../lib/api";
import { useAuth } from "../lib/auth";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }
    void getContacts(user.id).then((result) => {
      if (result.ok) {
        setContactCount(result.data?.contacts.length ?? 0);
      }
    });
  }, [user]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-2xl font-black uppercase text-terminal">CyberSend</Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl border border-terminal/25 bg-black/35 px-3 py-2 text-xs text-emerald-100/80">
            operator <span className="text-terminal">{user?.handle}</span>
          </span>
          <SecurityBadge label="SECURE MODE" />
        </div>
      </div>
      <TerminalWindow title="operator.dashboard">
        <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
          <div>
            <TerminalLine prefix="user">{user?.handle}</TerminalLine>
            <TerminalLine prefix="status" tone="cyan">SECURE MODE</TerminalLine>
            <TerminalLine prefix="contacts">{contactCount}</TerminalLine>
            <TerminalLine prefix="public-key" tone="muted">{user?.publicKey ? "ECDH-P256-ACTIVE" : "EPHEMERAL-AUTH"}</TerminalLine>
          </div>
          <div className="grid gap-3">
            <TerminalButton type="button" onClick={() => navigate("/invite")}>
              <KeyRound size={16} />
              Generate invite key
            </TerminalButton>
            <TerminalButton type="button" variant="ghost" onClick={() => navigate("/session")}>
              <Radio size={16} />
              Open session
            </TerminalButton>
            <TerminalButton type="button" variant="danger" onClick={() => navigate("/session?burn=1")}>
              <Flame size={16} />
              Burn session
            </TerminalButton>
          </div>
        </div>
      </TerminalWindow>
    </main>
  );
}
