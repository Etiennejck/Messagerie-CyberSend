import { Copy, KeyRound, Mail, Share2 } from "lucide-react";
import { TerminalButton } from "./TerminalButton";
import { TerminalLine } from "./TerminalLine";

type InviteCardProps = {
  inviteKey: string;
  inviteLink: string;
  onCopy: () => void;
  onShare: () => void;
};

export function InviteCard({ inviteKey, inviteLink, onCopy, onShare }: InviteCardProps) {
  const mailtoHref = `mailto:?subject=${encodeURIComponent("CyberSend invitation")}&body=${encodeURIComponent(`Open this CyberSend secure invitation: ${inviteLink}`)}`;

  return (
    <div className="rounded-2xl border border-cyanwire/40 bg-black/45 p-4 shadow-[0_0_24px_rgba(5,255,138,0.08)]">
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
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <TerminalButton type="button" onClick={onCopy} variant="ghost" className="w-full px-3">
          <Copy size={16} />
          copy
        </TerminalButton>
        <a href={mailtoHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyanwire/50 bg-cyanwire/5 px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyanwire shadow-command transition hover:border-cyanwire/80 hover:bg-cyanwire/10 hover:text-white focus:outline-none focus-visible:shadow-focusRing">
          <Mail size={16} />
          mailto
        </a>
        <TerminalButton type="button" onClick={onShare} variant="ghost" className="w-full px-3">
          <Share2 size={16} />
          share
        </TerminalButton>
      </div>
    </div>
  );
}
