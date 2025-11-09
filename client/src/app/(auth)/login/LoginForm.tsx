"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please enter email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      // Use the login action from our Zustand store
      login(data, data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: unknown) {
      let message = "Login failed. Please try again.";
      
      // Safe error handling
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

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:opacity-50"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </motion.button>

      <p className="text-center text-sm text-gray-400">
        Don&#39;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-500 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}