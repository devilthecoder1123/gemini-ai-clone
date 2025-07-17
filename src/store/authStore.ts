import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "../types";
import toast from "react-hot-toast";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isOtpSent: false,

      login: async () => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        set({ isOtpSent: true, isLoading: false });
        toast.success("OTP sent successfully!");
      },

      verifyOtp: async (otp: string) => {
        set({ isLoading: true });

        // Simulate OTP verification
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (otp === "123456") {
          const user: User = {
            id: crypto.randomUUID(),
            phone: "1234567890",
            countryCode: "+1",
            isAuthenticated: true,
          };

          set({ user, isLoading: false, isOtpSent: false });
          toast.success("Login successful!");
        } else {
          set({ isLoading: false });
          toast.error("Invalid OTP. Please try again.");
          throw new Error("Invalid OTP");
        }
      },

      logout: () => {
        set({ user: null, isOtpSent: false });
        toast.success("Logged out successfully!");
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
