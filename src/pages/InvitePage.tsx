import { FormEvent, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { InviteCard } from "../components/InviteCard";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalLine } from "../components/TerminalLine";
import { TerminalWindow } from "../components/TerminalWindow";
import { acceptInvite, createInvite } from "../lib/api";
import { generateRandomInviteKey } from "../lib/crypto";
import { mockUser } from "../lib/session";

export function InvitePage() {
  const { inviteKey } = useParams();
  const [generatedKey, setGeneratedKey] = useState("");
  const [acceptedHandle, setAcceptedHandle] = useState("");
  const [status, setStatus] = useState("");
  const activeKey = inviteKey ?? generatedKey;
  const inviteLink = useMemo(() => (activeKey ? `${window.location.origin}/invite/${activeKey}` : ""), [activeKey]);

  async function handleGenerate() {
    const key = generateRandomInviteKey();
    setGeneratedKey(key);
    const result = await createInvite({ ownerId: mockUser.id, inviteKey: key });
    setStatus(result.ok ? "invite stored as volatile mock relation metadata" : "invite generated locally; function unavailable");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setStatus("invite link copied");
  }

  async function handleAccept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeKey || acceptedHandle.trim().length < 3) {
      setStatus("enter a handle before accepting");
      return;
    }
    const result = await acceptInvite({ inviteKey: activeKey, handle: acceptedHandle });
    setStatus(result.ok ? "connection accepted; relation simulated" : "connection simulated locally; function unavailable");
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <TerminalWindow title={inviteKey ? "invite.incoming" : "invite.generator"}>
        {inviteKey ? (
          <form onSubmit={handleAccept} className="space-y-4">
            <TerminalLine tone="cyan">incoming secure invitation detected</TerminalLine>
            <TerminalLine prefix="key">{inviteKey}</TerminalLine>
            <label htmlFor="accept-handle" className="block text-sm text-cyanwire">accept as handle</label>
            <input id="accept-handle" value={acceptedHandle} onChange={(event) => setAcceptedHandle(event.target.value)} className="w-full border border-terminal/35 bg-black/60 px-3 py-3 text-terminal outline-none focus:border-cyanwire" />
            <TerminalButton type="submit">Accept connection</TerminalButton>
          </form>
        ) : (
          <div className="space-y-5">
            <TerminalLine tone="muted">invite keys are hashed by Function before future persistence</TerminalLine>
            <TerminalButton type="button" onClick={handleGenerate}>Generate invite key</TerminalButton>
            {generatedKey ? <InviteCard inviteKey={generatedKey} inviteLink={inviteLink} onCopy={handleCopy} /> : null}
          </div>
        )}
        {status ? <div className="mt-5"><TerminalLine tone="cyan">{status}</TerminalLine></div> : null}
      </TerminalWindow>
    </main>
  );
}
