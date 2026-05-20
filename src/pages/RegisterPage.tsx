import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalLine } from "../components/TerminalLine";
import { TerminalWindow } from "../components/TerminalWindow";
import { registerUser } from "../lib/api";
import { exportPublicKey, generateClientKeyPair } from "../lib/crypto";

export function RegisterPage() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[a-zA-Z0-9_.@-]{3,32}$/.test(handle)) {
      setError("handle must be 3-32 safe terminal chars");
      return;
    }
    if (password.length < 8) {
      setError("password must be at least 8 chars");
      return;
    }
    const keyPair = await generateClientKeyPair();
    const publicKey = await exportPublicKey(keyPair.publicKey);
    await registerUser({ handle, password, publicKey });
    navigate("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-8">
      <TerminalWindow title="auth.register" className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TerminalLine tone="muted">TODO: persist users with server-side password hashing</TerminalLine>
          <label className="block text-sm text-cyanwire" htmlFor="handle">handle</label>
          <input id="handle" value={handle} onChange={(event) => setHandle(event.target.value)} className="w-full border border-terminal/35 bg-black/60 px-3 py-3 text-terminal outline-none focus:border-cyanwire" />
          <label className="block text-sm text-cyanwire" htmlFor="password">password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-terminal/35 bg-black/60 px-3 py-3 text-terminal outline-none focus:border-cyanwire" />
          {error ? <TerminalLine tone="danger">{error}</TerminalLine> : null}
          <TerminalButton type="submit" className="w-full">create account</TerminalButton>
          <Link className="block text-center text-sm text-cyanwire" to="/login">login instead</Link>
        </form>
      </TerminalWindow>
    </main>
  );
}
