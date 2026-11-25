import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { authService } from '../services/authService';
import type { User } from '../services/types';

type State = { status: 'loading' | 'signedOut' | 'signedIn'; user: User | null };

type Action = { type: 'signIn'; user: User } | { type: 'signOut' } | { type: 'update'; user: User };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'signIn':
    case 'update':
      return { status: 'signedIn', user: action.user };
    case 'signOut':
      return { status: 'signedOut', user: null };
  }
}

type AuthContextValue = State & {
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: 'loading', user: null });

  useEffect(() => {
    let active = true;
    void authService.restoreSession().then((user) => {
      if (active) dispatch(user ? { type: 'signIn', user } : { type: 'signOut' });
    });
    const unsubscribe = authService.onSignedOut(() => dispatch({ type: 'signOut' }));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn: async (email, password, remember) => {
        const user = await authService.login(email, password, remember);
        dispatch({ type: 'signIn', user });
      },
      signOut: async () => {
        await authService.logout();
        dispatch({ type: 'signOut' });
      },
      updateUser: (user) => dispatch({ type: 'update', user }),
    }),
    [state],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
