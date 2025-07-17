import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { useCountries } from "../../hooks/useCountries";
import { useAuthStore } from "../../store/authStore";
import { LoadingSkeleton } from "../ui/LoadingSkeleton";

const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z.string().min(6, "Phone number must be at least 6 digits"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export const AuthForm: React.FC = () => {
  const { countries, loading: countriesLoading } = useCountries();
  const { login, verifyOtp, isLoading, isOtpSent } = useAuthStore();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: "",
      phone: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await login(data.phone, data.countryCode);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onVerifyOtp = async (data: OtpFormData) => {
    try {
      await verifyOtp(data.otp);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const countryOptions = countries.map((country) => ({
    value: country.idd.root + (country.idd.suffixes?.[0] || ""),
    label: `${country.name.common} (${country.idd.root}${
      country.idd.suffixes?.[0] || ""
    })`,
    flag: country.flag,
  }));

  if (countriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <LoadingSkeleton className="h-8 w-32 mx-auto mb-2" />
            <LoadingSkeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="space-y-4">
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isOtpSent ? "Verify OTP" : "Welcome to Gemini"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isOtpSent
              ? "Enter the OTP sent to your phone"
              : "Sign in with your phone number"}
          </p>
        </div>

        {!isOtpSent ? (
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4"
          >
            <Select
              label="Country"
              options={countryOptions}
              {...loginForm.register("countryCode")}
              error={loginForm.formState.errors.countryCode?.message}
              onChange={(e) => {
                loginForm.setValue("countryCode", e.target.value);
                loginForm.trigger("countryCode");
              }}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              {...loginForm.register("phone")}
              error={loginForm.formState.errors.phone?.message}
              onChange={(e) => {
                loginForm.setValue("phone", e.target.value);
                loginForm.trigger("phone"); // Trigger validation
              }}
            />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={!loginForm.formState.isValid || isLoading}
            >
              Send OTP
            </Button>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Use OTP: 123456 for demo purposes
            </p>
          </form>
        ) : (
          <form
            onSubmit={otpForm.handleSubmit(onVerifyOtp)}
            className="space-y-4"
          >
            <Input
              label="OTP Code"
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              {...otpForm.register("otp")}
              error={otpForm.formState.errors.otp?.message}
              onChange={(e) => {
                otpForm.setValue("otp", e.target.value);
                otpForm.trigger("otp");
              }}
            />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={!otpForm.formState.isValid || isLoading}
            >
              Verify OTP
            </Button>

            <button
              type="button"
              onClick={() => useAuthStore.setState({ isOtpSent: false })}
              className="w-full text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Back to phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
