"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full border-b border-gray-700 bg-gray-800">
      <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          FileSure
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">
            Welcome, {user?.email}
          </span>
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
            Credits: {user?.credits}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}