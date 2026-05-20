import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed, readJson } from "./_lib/responses";
import { memoryStorage } from "./_lib/storage";
import { isString } from "./_lib/validation";

type SignalBody = {
  sessionId: unknown;
  fromPeerId: unknown;
  toPeerId: unknown;
  type: unknown;
  payload: unknown;
};

const allowedSignalTypes = new Set(["offer", "answer", "ice-candidate"]);

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");
    if (!sessionId) {
      return jsonError("Missing sessionId", 422);
    }
    const signals = await memoryStorage.pullSignals(sessionId);
    return jsonOk({ signals });
  }

  if (req.method === "POST") {
    try {
      const body = await readJson<SignalBody>(req);
      if (!isString(body.sessionId) || !isString(body.fromPeerId) || !isString(body.toPeerId) || !isString(body.type)) {
        return jsonError("Invalid signaling payload", 422);
      }
      if (!allowedSignalTypes.has(body.type)) {
        return jsonError("Unsupported signaling type", 422);
      }
      // Security: signaling must never contain chat messages; only SDP/ICE metadata.
      const signal = await memoryStorage.pushSignal({
        sessionId: body.sessionId,
        fromPeerId: body.fromPeerId,
        toPeerId: body.toPeerId,
        type: body.type,
        payload: body.payload
      });
      return jsonOk({ signal }, 201);
    } catch {
      return jsonError("Signaling failed", 400);
    }
  }

  return methodNotAllowed(["GET", "POST"]);
};

export const config: Config = {};
