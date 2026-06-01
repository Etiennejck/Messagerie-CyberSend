import { Flame, TerminalSquare } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CommandInput } from "../components/CommandInput";
import { SecurityBadge } from "../components/SecurityBadge";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalWindow } from "../components/TerminalWindow";
import { getContacts, type Contact } from "../lib/api";
import { useAuth } from "../lib/auth";
import { createSessionEvent, type SessionEvent } from "../lib/session";

const helpText = "commands: /help /status /whoami /clear /burn /connect <key> /msg <message>";
const channelPrefix = "cybersend.session.";

type BroadcastMessage = {
  type: "message" | "burn";
  sessionId: string;
  relationshipId: string;
  fromUserId: string;
  fromHandle: string;
  text?: string;
};

export function SessionPage() {
  const location = useLocation();
  const { user } = useAuth();
  const [events, setEvents] = useState<SessionEvent[]>([
    createSessionEvent("system", "secure session shell online"),
    createSessionEvent("system", "messages are volatile: React state + function memory TTL")
  ]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [transportStatus, setTransportStatus] = useState("standby");
  const channelRef = useRef<BroadcastChannel | null>(null);

  const renderedEvents = useMemo(() => events, [events]);

  useEffect(() => {
    if (!user) {
      return;
    }
    void getContacts(user.id).then((result) => {
      if (!result.ok) {
        setEvents((current) => [...current, createSessionEvent("system", result.error ?? "contact lookup failed")]);
        return;
      }
      const nextContacts = result.data?.contacts ?? [];
      setContacts(nextContacts);
      setActiveContact((current) => current ?? nextContacts[0] ?? null);
      if (nextContacts.length === 0) {
        setEvents((current) => [...current, createSessionEvent("system", "no relationship found; generate or accept an invitation first")]);
      }
    });
  }, [user]);

  useEffect(() => {
    if (!activeContact || !user) {
      return;
    }
    let cancelled = false;
    setTransportStatus("broadcastchannel:open");
    const channel = new BroadcastChannel(`${channelPrefix}${activeContact.sessionId}`);
    channelRef.current?.close();
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      if (cancelled || event.data.sessionId !== activeContact.sessionId || event.data.fromUserId === user.id) {
        return;
      }
      if (event.data.type === "burn") {
        channel.close();
        channelRef.current = null;
        setTransportStatus("closed");
        setEvents([createSessionEvent("system", "remote burn received; session memory wiped")]);
        return;
      }
      if (event.data.type === "message" && event.data.text) {
        setEvents((current) => [...current, createSessionEvent("received", `${event.data.fromHandle}: ${event.data.text}`)]);
      }
    };
    return () => {
      cancelled = true;
      channel.close();
      if (channelRef.current === channel) {
        channelRef.current = null;
        setTransportStatus("standby");
      }
    };
  }, [activeContact, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("burn") === "1") {
      wipeSession();
    }
  }, [location.search, activeContact, user]);

  function wipeSession() {
    if (activeContact && user) {
      channelRef.current?.postMessage({
        type: "burn",
        sessionId: activeContact.sessionId,
        relationshipId: activeContact.relationshipId,
        fromUserId: user.id,
        fromHandle: user.handle
      } satisfies BroadcastMessage);
    }
    channelRef.current?.close();
    channelRef.current = null;
    setTransportStatus("closed");
    setEvents([
      createSessionEvent("system", "session memory wiped"),
      createSessionEvent("system", "no logs persisted")
    ]);
  }

  async function handleCommand(command: string) {
    if (command === "/clear") {
      setEvents([]);
      return;
    }
    if (command === "/burn") {
      wipeSession();
      return;
    }

    const next = [createSessionEvent("command", command)];
    if (command === "/help") {
      next.push(createSessionEvent("system", helpText));
    } else if (command === "/status") {
      next.push(createSessionEvent("system", `SECURE MODE; transport=${activeContact ? transportStatus : "no-relationship"}; persistence=none`));
    } else if (command === "/whoami") {
      next.push(createSessionEvent("system", user?.handle ?? "anonymous"));
    } else if (command.startsWith("/connect ")) {
      const key = command.replace("/connect ", "").trim();
      const contact = contacts.find((item) => item.sessionId === key || item.relationshipId === key || item.handle === key);
      if (!contact) {
        next.push(createSessionEvent("system", `relationship not found for ${key}`));
      } else {
        setActiveContact(contact);
        next.push(createSessionEvent("system", `connected to ${contact.handle}; session ${contact.sessionId.slice(0, 12)}...`));
      }
    } else if (command.startsWith("/msg ")) {
      const text = command.replace("/msg ", "").trim();
      if (!user || !activeContact) {
        next.push(createSessionEvent("system", "no active relationship; accept an invite before messaging"));
      } else {
        channelRef.current?.postMessage({
          type: "message",
          sessionId: activeContact.sessionId,
          relationshipId: activeContact.relationshipId,
          fromUserId: user.id,
          fromHandle: user.handle,
          text
        } satisfies BroadcastMessage);
        next.push(createSessionEvent("sent", text));
        next.push(createSessionEvent("system", "message broadcast ephemerally; no durable persistence"));
      }
    } else {
      next.push(createSessionEvent("system", "unknown command; type /help"));
    }
    setEvents((current) => [...current, ...next]);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="terminal-glow-text text-xl font-black uppercase text-terminal sm:text-2xl">CyberSend session</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-100/60">operator: <span className="text-terminal">{user?.handle}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecurityBadge label="VOLATILE MEMORY" status="volatile" />
          <SecurityBadge label={activeContact ? "RELATIONSHIP LINKED" : "STANDBY"} status={activeContact ? "mock" : "secure"} />
        </div>
      </div>
      <TerminalWindow
        title={`zsh:${user?.handle ?? "anonymous"}`}
        className="flex min-h-[76vh] flex-1 flex-col"
        actions={
          <TerminalButton type="button" variant="danger" onClick={wipeSession} className="min-h-9 px-3 py-1 text-xs">
            <Flame size={14} />
            burn
          </TerminalButton>
        }
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-terminal/20 bg-black/45 px-3 py-2 text-xs uppercase tracking-[0.14em] text-emerald-100/65">
          <span className="inline-flex items-center gap-2 text-cyanwire"><TerminalSquare size={14} /> zsh shell</span>
          <span>cwd <span className="text-terminal">~/cybersend/session</span></span>
          <span>peer <span className="text-terminal">{activeContact?.handle ?? "none"}</span></span>
        </div>
        <div className="terminal-scrollbar h-[58vh] overflow-y-auto rounded-2xl border border-terminal/20 bg-black/72 p-3 shadow-[inset_0_0_24px_rgba(0,0,0,0.42)] sm:h-[60vh] sm:p-4">
          {renderedEvents.length === 0 ? (
            <p className="text-sm text-emerald-200/60">terminal cleared</p>
          ) : (
            renderedEvents.map((event) => (
              <p key={event.id} className="break-words text-sm leading-7">
                <span className="mr-2 text-emerald-200/45">[{event.timestamp}]</span>
                <span className={event.kind === "sent" ? "text-cyanwire" : event.kind === "command" ? "text-violet-300" : "text-terminal"}>
                  {event.kind === "command" ? `${user?.handle ?? "anonymous"} ~/cybersend/session % ` : event.kind === "sent" ? "outbound > " : event.kind === "received" ? "inbound < " : "system > "}
                  {event.text}
                </span>
              </p>
            ))
          )}
        </div>
        <CommandInput onSubmit={handleCommand} disabled={!activeContact || transportStatus === "closed"} placeholder={activeContact ? "/msg encrypted hello" : "accept an invite before messaging"} />
      </TerminalWindow>
    </main>
  );
}
