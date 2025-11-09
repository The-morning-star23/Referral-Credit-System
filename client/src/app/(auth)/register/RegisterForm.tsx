"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

// A small component to wrap the form, allowing it to use useSearchParams
function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const refCodeFromUrl = searchParams.get("r");
  const [referralCode, setReferralCode] = useState(refCodeFromUrl || "");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refCodeFromUrl) {
      toast.success(`Referral code ${refCodeFromUrl} applied!`);
    }
  }, [refCodeFromUrl]); // This effect now runs only once when the code changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
        referralCode: referralCode || undefined, // Send 'undefined' if empty
      });

      // Log the user in immediately
      login(data, data.token);
      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (error: unknown) {
      let message = "Registration failed. Please try again.";
      
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        message = axiosError.response?.data?.message || message;
      }
      
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="name@company.com"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />
      </div>
      <div>
        <label
          htmlFor="referral"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Referral Code (Optional)
        </label>
        <input
          type="text"
          id="referral"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full rounded-md border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="LINA123"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </motion.button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-500 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}