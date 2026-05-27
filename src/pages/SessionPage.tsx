import { Flame, TerminalSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { CommandInput } from "../components/CommandInput";
import { SecurityBadge } from "../components/SecurityBadge";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalWindow } from "../components/TerminalWindow";
import { createSessionEvent, mockUser, type SessionEvent } from "../lib/session";

const helpText = "commands: /help /status /whoami /clear /burn /connect <key> /msg <message>";

export function SessionPage() {
  const [events, setEvents] = useState<SessionEvent[]>([
    createSessionEvent("system", "secure session shell online"),
    createSessionEvent("system", "no logs persisted")
  ]);
  const [connectedKey, setConnectedKey] = useState("");

  const renderedEvents = useMemo(() => events, [events]);

  function wipeSession() {
    setConnectedKey("");
    setEvents([
      createSessionEvent("system", "session memory wiped"),
      createSessionEvent("system", "no logs persisted")
    ]);
  }

  function handleCommand(command: string) {
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
      next.push(createSessionEvent("system", `SECURE MODE; transport=${connectedKey ? "mock-connected" : "standby"}; persistence=none`));
    } else if (command === "/whoami") {
      next.push(createSessionEvent("system", mockUser.handle));
    } else if (command.startsWith("/connect ")) {
      const key = command.replace("/connect ", "").trim();
      setConnectedKey(key);
      next.push(createSessionEvent("system", `connected to invite ${key}; DataChannel pending`));
    } else if (command.startsWith("/msg ")) {
      next.push(createSessionEvent("sent", command.replace("/msg ", "")));
      next.push(createSessionEvent("system", "message held in React state only"));
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
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-emerald-100/60">operator: <span className="text-terminal">{mockUser.handle}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecurityBadge label="VOLATILE MEMORY" status="volatile" />
          <SecurityBadge label={connectedKey ? "LINK MOCKED" : "STANDBY"} status={connectedKey ? "mock" : "secure"} />
        </div>
      </div>
      <TerminalWindow
        title={`zsh:${mockUser.handle}`}
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
          <span>user <span className="text-terminal">{mockUser.handle}</span></span>
        </div>
        <div className="terminal-scrollbar h-[58vh] overflow-y-auto rounded-2xl border border-terminal/20 bg-black/72 p-3 shadow-[inset_0_0_24px_rgba(0,0,0,0.42)] sm:h-[60vh] sm:p-4">
          {renderedEvents.length === 0 ? (
            <p className="text-sm text-emerald-200/60">terminal cleared</p>
          ) : (
            renderedEvents.map((event) => (
              <p key={event.id} className="break-words text-sm leading-7">
                <span className="mr-2 text-emerald-200/45">[{event.timestamp}]</span>
                <span className={event.kind === "sent" ? "text-cyanwire" : event.kind === "command" ? "text-violet-300" : "text-terminal"}>
                  {event.kind === "command" ? `${mockUser.handle} ~/cybersend/session % ` : event.kind === "sent" ? "outbound > " : "system > "}
                  {event.text}
                </span>
              </p>
            ))
          )}
        </div>
        <CommandInput onSubmit={handleCommand} />
      </TerminalWindow>
    </main>
  );
}
