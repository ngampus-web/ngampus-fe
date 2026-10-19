/**
 * Auth state management with localStorage persistence
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, apiClient } from '@/lib/api';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        const response = await authApi.login({ email, password });

        if (response.success) {
          const { token, user } = response.data;
          apiClient.setAuthToken(token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        }

        set({ isLoading: false });
        return {
          success: false,
          error: response.error.message,
        };
      },

      register: async (name: string, email: string, password: string, phone?: string) => {
        set({ isLoading: true });

        const response = await authApi.register({ name, email, password, phone });

        if (response.success) {
          const { token, user } = response.data;
          apiClient.setAuthToken(token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        }

        set({ isLoading: false });
        return {
          success: false,
          error: response.error.message,
        };
      },

      logout: () => {
        apiClient.setAuthToken(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      initAuth: async () => {
        const { token } = get();
        if (!token) return;

        apiClient.setAuthToken(token);
        const response = await authApi.getMe();

        if (response.success) {
          set({ user: response.data, isAuthenticated: true });
        } else {
          // Token invalid, clear auth
          get().logout();
        }
      },
    }),
    {
      name: 'ngampus-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
