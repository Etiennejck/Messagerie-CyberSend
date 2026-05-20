type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`/.netlify/functions/${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
    const payload = (await response.json()) as ApiResult<T>;
    return payload;
  } catch {
    return {
      ok: false,
      error: "Netlify function unavailable in this dev mode"
    };
  }
}

export type AuthResponse = {
  user: {
    id: string;
    handle: string;
    publicKey?: JsonWebKey;
  };
};

export type InviteResponse = {
  inviteKey: string;
  inviteHashPreview: string;
  inviteLink: string;
};

export function registerUser(input: { handle: string; password: string; publicKey?: JsonWebKey }) {
  return request<AuthResponse>("register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function loginUser(input: { handle: string; password: string }) {
  return request<AuthResponse>("login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function createInvite(input: { ownerId: string; publicKey?: JsonWebKey; inviteKey: string }) {
  return request<InviteResponse>("create-invite", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function acceptInvite(input: { inviteKey: string; handle: string; publicKey?: JsonWebKey }) {
  return request<{ contactId: string; status: string }>("accept-invite", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getContacts(ownerId: string) {
  return request<{ contacts: Array<{ id: string; handle: string; status: string }> }>(`contacts?ownerId=${encodeURIComponent(ownerId)}`, {
    method: "GET"
  });
}
