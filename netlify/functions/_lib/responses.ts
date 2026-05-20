export type JsonPayload = Record<string, unknown> | Array<unknown>;

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

export function jsonOk<T extends JsonPayload>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ ok: true, data }), { status, headers });
}

export function jsonError(error: string, status = 400): Response {
  return new Response(JSON.stringify({ ok: false, error }), { status, headers });
}

export function methodNotAllowed(allowed: string[]): Response {
  return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
    status: 405,
    headers: {
      ...headers,
      Allow: allowed.join(", ")
    }
  });
}

export async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}
