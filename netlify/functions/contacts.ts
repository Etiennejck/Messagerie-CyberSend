import type { Config, Context } from "@netlify/functions";
import { jsonError, jsonOk, methodNotAllowed } from "./_lib/responses";
import { memoryStorage } from "./_lib/storage";

export default async (req: Request, _context: Context) => {
  if (req.method !== "GET") {
    return methodNotAllowed(["GET"]);
  }

  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId");
    if (!ownerId) {
      return jsonError("Missing ownerId", 422);
    }
    const contacts = await memoryStorage.listContacts(ownerId);
    return jsonOk({ contacts });
  } catch {
    return jsonError("Contacts lookup failed", 400);
  }
};

export const config: Config = {};
