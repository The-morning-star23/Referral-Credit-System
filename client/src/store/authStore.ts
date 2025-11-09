import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the shape of our user info
interface UserInfo {
  _id: string;
  email: string;
  referralCode: string;
  credits: number;
}

// Define the shape of our store's state
interface AuthState {
  user: UserInfo | null;
  token: string | null;
}

// Define the actions (functions) our store can perform
interface AuthActions {
  login: (user: UserInfo, token: string) => void;
  logout: () => void;
  updateCredits: (newCredits: number) => void;
}

// Create the store
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,

      // --- ACTIONS ---

      // Login action
      login: (user, token) =>
        set({
          user: user,
          token: token,
        }),

      // Logout action
      logout: () =>
        set({
          user: null,
          token: null,
        }),

      // Action to update credits locally after a purchase
      updateCredits: (newCredits) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits: newCredits } : null,
        })),
    }),
    {
      // Configuration for persisting the state
      name: 'auth-storage', // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);