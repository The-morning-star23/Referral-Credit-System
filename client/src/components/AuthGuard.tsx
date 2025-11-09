"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Effect to run on the client and set hydration status
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // We only run the redirect logic *after* the client has hydrated
    // and we've confirmed there is no user.
    if (isHydrated && (!user || !token)) {
      router.push("/login");
    }
  }, [isHydrated, user, token, router]);

  // While hydrating, or if no user, show loading.
  // This prevents the "flash" of the dashboard page.
  if (!isHydrated || !user || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If hydrated and user exists, render the dashboard
  return <>{children}</>;
}