import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed, readJson } from "./_lib/responses";
import { memoryStorage } from "./_lib/storage";
import { isString } from "./_lib/validation";

type MessageBody = {
  sessionId: unknown;
  relationshipId: unknown;
  fromUserId: unknown;
  fromHandle: unknown;
  text: unknown;
};

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");
    const after = Number(url.searchParams.get("after") ?? "0");
    if (!sessionId || Number.isNaN(after)) {
      return jsonError("Invalid message pull payload", 422);
    }
    const messages = await memoryStorage.pullMessages({ sessionId, afterSequence: after });
    return jsonOk({ messages: messages.map(({ expiresAt: _expiresAt, ...message }) => message) });
  }

  if (req.method === "POST") {
    try {
      const body = await readJson<MessageBody>(req);
      if (!isString(body.sessionId) || !isString(body.relationshipId) || !isString(body.fromUserId) || !isString(body.fromHandle) || !isString(body.text)) {
        return jsonError("Invalid message payload", 422);
      }
      const text = body.text.trim();
      if (!text || text.length > 2000) {
        return jsonError("Message must be 1-2000 characters", 422);
      }
      // Security: messages are kept only in function memory with a short TTL and are never written to durable storage.
      const message = await memoryStorage.pushMessage({
        sessionId: body.sessionId,
        relationshipId: body.relationshipId,
        fromUserId: body.fromUserId,
        fromHandle: body.fromHandle,
        text
      });
      const { expiresAt: _expiresAt, ...publicMessage } = message;
      return jsonOk({ message: publicMessage }, 201);
    } catch {
      return jsonError("Message send failed", 400);
    }
  }

  return methodNotAllowed(["GET", "POST"]);
};

export const config: Config = {};
