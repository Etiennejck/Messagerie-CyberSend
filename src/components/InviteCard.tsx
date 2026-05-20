import { Copy, KeyRound } from "lucide-react";
import { TerminalButton } from "./TerminalButton";
import { TerminalLine } from "./TerminalLine";

type InviteCardProps = {
  inviteKey: string;
  inviteLink: string;
  onCopy: () => void;
};

export function InviteCard({ inviteKey, inviteLink, onCopy }: InviteCardProps) {
  return (
    <div className="border border-cyanwire/40 bg-black/45 p-4">
      <div className="mb-4 flex items-center gap-3 text-cyanwire">
        <KeyRound size={18} />
        <span className="text-xs uppercase tracking-[0.2em]">Invite payload</span>
      </div>
      <TerminalLine prefix="key" tone="cyan">
        {inviteKey}
      </TerminalLine>
      <TerminalLine prefix="link" tone="muted">
        {inviteLink}
      </TerminalLine>
      <TerminalButton type="button" onClick={onCopy} variant="ghost" className="mt-4 w-full sm:w-auto">
        <Copy size={16} />
        copy invite link
      </TerminalButton>
    </div>
  );
}
