import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed, readJson } from "./_lib/responses";
import { memoryStorage } from "./_lib/storage";
import { isInviteKey, isSafeHandle } from "./_lib/validation";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  try {
    const body = await readJson<{ inviteKey: unknown; handle: unknown; publicKey?: JsonWebKey }>(req);
    if (!isInviteKey(body.inviteKey) || !isSafeHandle(body.handle)) {
      return jsonError("Invalid accept invite payload", 422);
    }
    // Security: this creates relation metadata only, never message data.
    const contact = await memoryStorage.acceptInvite({
      inviteKey: body.inviteKey,
      handle: body.handle,
      publicKey: body.publicKey
    });
    return jsonOk({ contactId: contact.id, status: contact.status }, 201);
  } catch {
    return jsonError("Invite acceptance failed", 400);
  }
};

export const config: Config = {};
