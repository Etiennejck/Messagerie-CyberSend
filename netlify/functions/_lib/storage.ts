import { createHash, randomUUID } from "node:crypto";

export type StoredUser = {
  id: string;
  handle: string;
  passwordHashPlaceholder: string;
  publicKey?: JsonWebKey;
  createdAt: string;
};

export type StoredInvite = {
  id: string;
  inviteHash: string;
  ownerId: string;
  publicKey?: JsonWebKey;
  createdAt: string;
  acceptedBy?: string;
};

export type StoredContact = {
  id: string;
  ownerId: string;
  handle: string;
  status: "pending" | "connected";
  createdAt: string;
};

export type StoredSignal = {
  id: string;
  sessionId: string;
  fromPeerId: string;
  toPeerId: string;
  type: string;
  payload: unknown;
  createdAt: string;
};

export type StorageAdapter = {
  createUser(input: { handle: string; password: string; publicKey?: JsonWebKey }): Promise<StoredUser>;
  findUserByHandle(handle: string): Promise<StoredUser | undefined>;
  createInvite(input: { ownerId: string; inviteKey: string; publicKey?: JsonWebKey }): Promise<StoredInvite>;
  acceptInvite(input: { inviteKey: string; handle: string; publicKey?: JsonWebKey }): Promise<StoredContact>;
  listContacts(ownerId: string): Promise<StoredContact[]>;
  pushSignal(input: Omit<StoredSignal, "id" | "createdAt">): Promise<StoredSignal>;
  pullSignals(sessionId: string): Promise<StoredSignal[]>;
};

const users = new Map<string, StoredUser>();
const invites = new Map<string, StoredInvite>();
const contacts = new Map<string, StoredContact>();
const signals = new Map<string, StoredSignal[]>();

export function hashInviteKey(inviteKey: string): string {
  return createHash("sha256").update(inviteKey).digest("hex");
}

function placeholderPasswordHash(password: string): string {
  // TODO(security): replace with a slow password hash in durable storage.
  return createHash("sha256").update(`MVP_ONLY:${password}`).digest("hex");
}

export const memoryStorage: StorageAdapter = {
  async createUser(input) {
    const existing = users.get(input.handle.toLowerCase());
    if (existing) {
      return existing;
    }
    const user: StoredUser = {
      id: randomUUID(),
      handle: input.handle,
      passwordHashPlaceholder: placeholderPasswordHash(input.password),
      publicKey: input.publicKey,
      createdAt: new Date().toISOString()
    };
    users.set(user.handle.toLowerCase(), user);
    return user;
  },

  async findUserByHandle(handle) {
    return users.get(handle.toLowerCase());
  },

  async createInvite(input) {
    const inviteHash = hashInviteKey(input.inviteKey);
    const invite: StoredInvite = {
      id: randomUUID(),
      inviteHash,
      ownerId: input.ownerId,
      publicKey: input.publicKey,
      createdAt: new Date().toISOString()
    };
    invites.set(inviteHash, invite);
    return invite;
  },

  async acceptInvite(input) {
    const inviteHash = hashInviteKey(input.inviteKey);
    const invite = invites.get(inviteHash);
    const contact: StoredContact = {
      id: randomUUID(),
      ownerId: invite?.ownerId ?? "mock-owner",
      handle: input.handle,
      status: "connected",
      createdAt: new Date().toISOString()
    };
    if (invite) {
      invite.acceptedBy = contact.id;
    }
    contacts.set(contact.id, contact);
    return contact;
  },

  async listContacts(ownerId) {
    return Array.from(contacts.values()).filter((contact) => contact.ownerId === ownerId);
  },

  async pushSignal(input) {
    const signal: StoredSignal = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString()
    };
    const bucket = signals.get(signal.sessionId) ?? [];
    bucket.push(signal);
    signals.set(signal.sessionId, bucket.slice(-50));
    return signal;
  },

  async pullSignals(sessionId) {
    return signals.get(sessionId) ?? [];
  }
};
