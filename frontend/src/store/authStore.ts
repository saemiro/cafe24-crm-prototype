import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  mallId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  login: (mallId: string, accessToken: string, refreshToken: string, expiresIn: number) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      mallId: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

      login: (mallId, accessToken, refreshToken, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({
          isAuthenticated: true,
          mallId,
          accessToken,
          refreshToken,
          expiresAt,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          mallId: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        });
      },

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        return Date.now() > expiresAt - 60000; // 1 minute buffer
      },
    }),
    {
      name: 'cafe24-crm-auth',
    }
  )
);
