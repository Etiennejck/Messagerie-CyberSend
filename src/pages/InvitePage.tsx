import { FormEvent, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { InviteCard } from "../components/InviteCard";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalLine } from "../components/TerminalLine";
import { TerminalWindow } from "../components/TerminalWindow";
import { acceptInvite, createInvite } from "../lib/api";
import { useAuth } from "../lib/auth";
import { generateRandomInviteKey } from "../lib/crypto";

export function InvitePage() {
  const { inviteKey } = useParams();
  const { user } = useAuth();
  const [generatedKey, setGeneratedKey] = useState("");
  const [pastedInvite, setPastedInvite] = useState("");
  const [status, setStatus] = useState("");
  const pastedKey = useMemo(() => {
    const value = pastedInvite.trim();
    if (!value) {
      return "";
    }
    try {
      const url = new URL(value);
      const segments = url.pathname.split("/").filter(Boolean);
      return segments[segments.length - 1] ?? "";
    } catch {
      // Plain API keys are accepted as-is; URLs are normalized above.
    }
    const segments = value.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? value;
  }, [pastedInvite]);
  const activeKey = inviteKey ?? (pastedKey || generatedKey);
  const inviteLink = useMemo(() => (activeKey ? `${window.location.origin}/invite/${encodeURIComponent(activeKey)}` : ""), [activeKey]);

  async function handleGenerate() {
    if (!user) {
      setStatus("login required before generating an invite");
      return;
    }
    const key = generateRandomInviteKey();
    setGeneratedKey(key);
    const result = await createInvite({ ownerId: user.id, inviteKey: key, publicKey: user.publicKey });
    setStatus(result.ok ? "invite stored as volatile relationship metadata" : result.error ?? "invite creation failed");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setStatus("invite link copied");
  }

  async function handleShare() {
    if (!inviteLink) {
      setStatus("generate or paste an invite before sharing");
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({ title: "CyberSend invitation", text: "Open this secure CyberSend invitation", url: inviteLink });
        setStatus("native share sheet opened");
        return;
      }
      await navigator.clipboard.writeText(inviteLink);
      setStatus("share API unavailable; invite link copied");
    } catch {
      setStatus("share cancelled or unavailable");
    }
  }

  async function handleAccept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setStatus("login required before accepting");
      return;
    }
    if (!activeKey) {
      setStatus("missing invitation key");
      return;
    }
    const result = await acceptInvite({ inviteKey: activeKey, userId: user.id, handle: user.handle, publicKey: user.publicKey });
    setStatus(result.ok ? `connection accepted; session ${result.data?.sessionId.slice(0, 12)}...` : result.error ?? "connection failed");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-8 sm:px-6">
      <div className="w-full">
      <TerminalWindow title={inviteKey ? "invite.incoming" : "invite.generator"}>
        {inviteKey ? (
          <form onSubmit={handleAccept} className="space-y-4">
            <TerminalLine tone="cyan">incoming secure invitation detected</TerminalLine>
            <TerminalLine prefix="key">{inviteKey}</TerminalLine>
            <TerminalLine prefix="user" tone="muted">{user?.handle}</TerminalLine>
            <TerminalButton type="submit">Accept connection</TerminalButton>
          </form>
        ) : (
          <div className="space-y-5">
            <TerminalLine tone="muted">invite keys are hashed by Function before future persistence</TerminalLine>
            <div className="space-y-2 rounded-2xl border border-terminal/20 bg-black/30 p-4">
              <label htmlFor="invite-paste" className="block text-sm text-cyanwire">paste API key or invitation link</label>
              <input
                id="invite-paste"
                value={pastedInvite}
                onChange={(event) => setPastedInvite(event.target.value)}
                placeholder="https://cybersend.local/invite/key or API key"
                className="terminal-input"
              />
              {pastedKey ? <TerminalLine prefix="parsed" tone="cyan">{pastedKey}</TerminalLine> : null}
            </div>
            <TerminalButton type="button" onClick={handleGenerate}>Generate invite key</TerminalButton>
            {activeKey ? <InviteCard inviteKey={activeKey} inviteLink={inviteLink} onCopy={handleCopy} onShare={handleShare} /> : null}
          </div>
        )}
        {status ? <div className="mt-5"><TerminalLine tone="cyan">{status}</TerminalLine></div> : null}
      </TerminalWindow>
      </div>
    </main>
  );
}
