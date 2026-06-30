import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAgeGateStore = create(
  persist(
    (set) => ({
      isVerified: false,
      verify: () => set({ isVerified: true }),
      reset: () => set({ isVerified: false }),
    }),
    { name: 'vaporex-age-gate' }
  )
);

export default useAgeGateStore;
