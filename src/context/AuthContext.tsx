import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getTokens } from '../auth/tokenStorage';
import { login as loginApi, getProfile, logout as logoutApi, User } from '../auth/authApi';
import { setSessionExpiredHandler } from '../api/client';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Piece 7 wiring: register what happens when the API client detects
    // refresh has genuinely failed, anywhere in the app.
    setSessionExpiredHandler(() => {
      setUser(null);
    });

    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const tokens = await getTokens();

      if (!tokens) {
        setIsLoading(false);
        return;
      }

      // Access token might be expired — apiRequest inside getProfile()
      // will transparently refresh if it gets a 401.
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginApi(email, password);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};