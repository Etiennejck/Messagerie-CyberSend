import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed, readJson } from "./_lib/responses";
import { memoryStorage } from "./_lib/storage";
import { isPasswordLike, isSafeHandle } from "./_lib/validation";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  try {
    const body = await readJson<{ handle: unknown; password: unknown }>(req);
    if (!isSafeHandle(body.handle) || !isPasswordLike(body.password)) {
      return jsonError("Invalid login payload", 422);
    }
    // TODO(security): verify against durable password hash when real persistence is enabled.
    const user = (await memoryStorage.findUserByHandle(body.handle)) ?? (await memoryStorage.createUser({ handle: body.handle, password: body.password }));
    return jsonOk({ user: { id: user.id, handle: user.handle, publicKey: user.publicKey } });
  } catch {
    return jsonError("Login failed", 400);
  }
};

export const config: Config = {};
