import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed, readJson } from "./_lib/responses";
import { memoryStorage } from "./_lib/storage";
import { isPasswordLike, isSafeHandle } from "./_lib/validation";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  try {
    const body = await readJson<{ handle: unknown; password: unknown; publicKey?: JsonWebKey }>(req);
    if (!isSafeHandle(body.handle) || !isPasswordLike(body.password)) {
      return jsonError("Invalid registration payload", 422);
    }
    // Security: MVP does not store message content. Password hashing here is a placeholder only.
    const user = await memoryStorage.createUser({
      handle: body.handle,
      password: body.password,
      publicKey: body.publicKey
    });
    return jsonOk({ user: { id: user.id, handle: user.handle, publicKey: user.publicKey } }, 201);
  } catch {
    return jsonError("Registration failed", 400);
  }
};

export const config: Config = {};
