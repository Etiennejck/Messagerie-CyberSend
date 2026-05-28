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
  relationshipId: string;
  sessionId: string;
  ownerId: string;
  peerId: string;
  handle: string;
  status: "pending" | "connected";
  createdAt: string;
};

export type EphemeralMessage = {
  id: string;
  sequence: number;
  sessionId: string;
  relationshipId: string;
  fromUserId: string;
  fromHandle: string;
  text: string;
  createdAt: string;
  expiresAt: number;
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
  findUserById(userId: string): Promise<StoredUser | undefined>;
  createInvite(input: { ownerId: string; inviteKey: string; publicKey?: JsonWebKey }): Promise<StoredInvite>;
  acceptInvite(input: { inviteKey: string; userId: string; handle: string; publicKey?: JsonWebKey }): Promise<StoredContact>;
  listContacts(ownerId: string): Promise<StoredContact[]>;
  pushMessage(input: Omit<EphemeralMessage, "id" | "sequence" | "createdAt" | "expiresAt">): Promise<EphemeralMessage>;
  pullMessages(input: { sessionId: string; afterSequence: number }): Promise<EphemeralMessage[]>;
  pushSignal(input: Omit<StoredSignal, "id" | "createdAt">): Promise<StoredSignal>;
  pullSignals(sessionId: string): Promise<StoredSignal[]>;
};

const users = new Map<string, StoredUser>();
const usersById = new Map<string, StoredUser>();
const invites = new Map<string, StoredInvite>();
const contacts = new Map<string, StoredContact>();
const signals = new Map<string, StoredSignal[]>();
const messages = new Map<string, EphemeralMessage[]>();
const messageSequences = new Map<string, number>();
const messageTtlMs = 2 * 60 * 1000;

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
    usersById.set(user.id, user);
    return user;
  },

  async findUserByHandle(handle) {
    return users.get(handle.toLowerCase());
  },

  async findUserById(userId) {
    return usersById.get(userId);
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
    if (!invite) {
      throw new Error("Invite not found");
    }
    const owner = usersById.get(invite.ownerId);
    if (!owner) {
      throw new Error("Invite owner not found");
    }
    const accepter = usersById.get(input.userId) ?? {
      id: input.userId,
      handle: input.handle,
      passwordHashPlaceholder: "volatile-auth-context",
      publicKey: input.publicKey,
      createdAt: new Date().toISOString()
    };
    usersById.set(accepter.id, accepter);
    users.set(accepter.handle.toLowerCase(), accepter);
    const relationshipId = randomUUID();
    const sessionId = hashInviteKey(`${invite.id}:${owner.id}:${accepter.id}`);
    const createdAt = new Date().toISOString();
    const contact: StoredContact = {
      id: randomUUID(),
      relationshipId,
      sessionId,
      ownerId: owner.id,
      peerId: accepter.id,
      handle: accepter.handle,
      status: "connected",
      createdAt
    };
    const reciprocalContact: StoredContact = {
      id: randomUUID(),
      relationshipId,
      sessionId,
      ownerId: accepter.id,
      peerId: owner.id,
      handle: owner.handle,
      status: "connected",
      createdAt
    };
    invite.acceptedBy = accepter.id;
    contacts.set(contact.id, contact);
    contacts.set(reciprocalContact.id, reciprocalContact);
    return contact;
  },

  async listContacts(ownerId) {
    return Array.from(contacts.values()).filter((contact) => contact.ownerId === ownerId);
  },

  async pushMessage(input) {
    const now = Date.now();
    const current = (messages.get(input.sessionId) ?? []).filter((message) => message.expiresAt > now);
    const sequence = (messageSequences.get(input.sessionId) ?? 0) + 1;
    messageSequences.set(input.sessionId, sequence);
    const message: EphemeralMessage = {
      id: randomUUID(),
      sequence,
      ...input,
      createdAt: new Date(now).toISOString(),
      expiresAt: now + messageTtlMs
    };
    messages.set(input.sessionId, [...current, message].slice(-100));
    return message;
  },

  async pullMessages(input) {
    const now = Date.now();
    const current = (messages.get(input.sessionId) ?? []).filter((message) => message.expiresAt > now);
    messages.set(input.sessionId, current);
    return current.filter((message) => message.sequence > input.afterSequence);
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
