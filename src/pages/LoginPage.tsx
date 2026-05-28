import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../lib/api";
import { useAuth } from "../lib/auth";
import { TerminalButton } from "../components/TerminalButton";
import { TerminalLine } from "../components/TerminalLine";
import { TerminalWindow } from "../components/TerminalWindow";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (handle.trim().length < 3 || password.length < 8) {
      setError("handle must be 3+ chars and password 8+ chars");
      return;
    }
    const result = await loginUser({ handle, password });
    if (!result.ok || !result.data?.user) {
      setError(result.error ?? "login failed");
      return;
    }
    setUser(result.data.user);
    navigate("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-8">
      <TerminalWindow title="auth.login" className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TerminalLine tone="muted">mock auth shell; server persistence and hashing are TODO</TerminalLine>
          <label className="block text-sm text-cyanwire" htmlFor="handle">
            handle
          </label>
          <input id="handle" value={handle} onChange={(event) => setHandle(event.target.value)} className="terminal-input" />
          <label className="block text-sm text-cyanwire" htmlFor="password">
            password
          </label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="terminal-input" />
          {error ? <TerminalLine tone="danger">{error}</TerminalLine> : null}
          <TerminalButton type="submit" className="w-full">login</TerminalButton>
          <Link className="block text-center text-sm text-cyanwire" to="/register">create account</Link>
        </form>
      </TerminalWindow>
    </main>
  );
}
