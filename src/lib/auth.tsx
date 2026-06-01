import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  handle: string;
  publicKey?: JsonWebKey;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const authStorageKey = "cybersend.auth.user";

function readStoredUser(): AuthUser | null {
  try {
    const stored = window.localStorage.getItem(authStorageKey);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => readStoredUser());

  function setUser(user: AuthUser) {
    window.localStorage.setItem(authStorageKey, JSON.stringify(user));
    setUserState(user);
  }

  function logout() {
    window.localStorage.removeItem(authStorageKey);
    setUserState(null);
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    setUser,
    logout
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
