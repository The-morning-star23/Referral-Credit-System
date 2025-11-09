"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function PageClient() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // We check the user state from our Zustand store
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  // Show a simple loading state while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}