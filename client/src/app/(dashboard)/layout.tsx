import React from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This AuthGuard will protect all child routes
    <AuthGuard>
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </AuthGuard>
  );
}