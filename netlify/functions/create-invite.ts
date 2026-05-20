import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed, readJson } from "./_lib/responses";
import { hashInviteKey, memoryStorage } from "./_lib/storage";
import { isInviteKey, isString } from "./_lib/validation";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  try {
    const body = await readJson<{ ownerId: unknown; inviteKey: unknown; publicKey?: JsonWebKey }>(req);
    if (!isString(body.ownerId) || !isInviteKey(body.inviteKey)) {
      return jsonError("Invalid invite payload", 422);
    }
    // Security: store only a hash of invite keys in a future durable adapter.
    await memoryStorage.createInvite({
      ownerId: body.ownerId,
      inviteKey: body.inviteKey,
      publicKey: body.publicKey
    });
    const inviteHash = hashInviteKey(body.inviteKey);
    return jsonOk({
      inviteKey: body.inviteKey,
      inviteHashPreview: `${inviteHash.slice(0, 12)}...`,
      inviteLink: `/invite/${body.inviteKey}`
    }, 201);
  } catch {
    return jsonError("Invite creation failed", 400);
  }
};

export const config: Config = {};
