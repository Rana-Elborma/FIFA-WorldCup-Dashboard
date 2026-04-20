import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, name?: string, role?: string, token?: string, id?: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from localStorage on page load
  useEffect(() => {
    const saved = localStorage.getItem('crowd_ai_user');
    const savedToken = localStorage.getItem('crowd_ai_token');
    if (saved && savedToken) {
      setUser(JSON.parse(saved));
      setToken(savedToken);
    }
  }, []);

  const signIn = (
    email: string,
    name = 'User',
    role = 'viewer',
    accessToken = '',
    id = '',
  ) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const u: User = { id, name, email, role, initials };
    setUser(u);
    setToken(accessToken);
    localStorage.setItem('crowd_ai_user', JSON.stringify(u));
    localStorage.setItem('crowd_ai_token', accessToken);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crowd_ai_user');
    localStorage.removeItem('crowd_ai_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
