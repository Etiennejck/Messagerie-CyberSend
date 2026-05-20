export type MockUser = {
  id: string;
  handle: string;
  publicKeyLabel: string;
};

export const mockUser: MockUser = {
  id: "usr_terminal_001",
  handle: "operator@cybersend",
  publicKeyLabel: "ECDH-P256-MOCK"
};

export type SessionEvent = {
  id: string;
  kind: "system" | "sent" | "received" | "command";
  text: string;
  timestamp: string;
};

export function createSessionEvent(kind: SessionEvent["kind"], text: string): SessionEvent {
  return {
    id: crypto.randomUUID(),
    kind,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  };
}
