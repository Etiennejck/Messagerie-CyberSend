export type ExportedPublicKey = JsonWebKey;

export function generateRandomInviteKey(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const token = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `CYBER-${token.slice(0, 4)}-${token.slice(4, 8)}-${token.slice(8, 12)}`;
}

export async function generateClientKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    true,
    ["deriveKey"]
  );
}

export async function exportPublicKey(publicKey: CryptoKey): Promise<ExportedPublicKey> {
  return crypto.subtle.exportKey("jwk", publicKey);
}

export async function importPublicKey(publicKey: ExportedPublicKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    publicKey,
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    true,
    []
  );
}

export async function encryptMessage(message: string): Promise<string> {
  // TODO(security): derive an AES-GCM key from ECDH peer keys and encrypt before WebRTC transfer.
  const encoded = new TextEncoder().encode(message);
  return btoa(String.fromCharCode(...encoded));
}

export async function decryptMessage(ciphertext: string): Promise<string> {
  // TODO(security): replace MVP placeholder with authenticated AES-GCM decrypt.
  const binary = atob(ciphertext);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
