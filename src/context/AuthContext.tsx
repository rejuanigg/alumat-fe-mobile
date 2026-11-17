import { createContext, use, useMemo, useReducer, type ReactNode } from 'react';

import { authService } from '../services/authService';
import type { User } from '../services/types';

type State = { user: User | null };

type Action = { type: 'signIn'; user: User } | { type: 'signOut' } | { type: 'update'; user: User };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'signIn':
    case 'update':
      return { user: action.user };
    case 'signOut':
      return { user: null };
  }
}

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      signIn: async (email, password, remember) => {
        const user = await authService.login(email, password, remember);
        dispatch({ type: 'signIn', user });
      },
      signOut: () => dispatch({ type: 'signOut' }),
      updateUser: (user) => dispatch({ type: 'update', user }),
    }),
    [state.user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
