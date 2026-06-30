import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => set({ user: userData, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateProfile: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'vaporex-admin-auth' }
  )
);

export default useAdminAuthStore;
