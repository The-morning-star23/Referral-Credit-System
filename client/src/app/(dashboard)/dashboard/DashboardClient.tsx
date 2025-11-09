"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

// Type for our dashboard data
interface DashboardData {
  totalReferredUsers: number;
  convertedUsers: number;
  totalCreditsEarned: number;
  referralLink: string;
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Get the 'updateCredits' action from our auth store
  const { updateCredits } = useAuthStore();

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get("/user/dashboard"); // <-- FIX 1: Removed underscore
      setData(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle the "Simulate Purchase" button click
  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const { data } = await api.post("/user/purchase"); // <-- FIX 2: Removed underscore
      toast.success(data.message);

      // After purchase, re-fetch dashboard data to show new credit total
      await fetchDashboardData();
      
      // Also update the credits in our global auth store (for the Navbar)
      if (data.newCredits) {
        updateCredits(data.newCredits);
      } else {
        // A bit of a workaround: just grab the new credits from the re-fetch
        const { data: newData } = await api.get("/user/dashboard");
        updateCredits(newData.totalCreditsEarned);
      }

    } catch (error) {
      console.error(error);
      toast.error("Purchase simulation failed.");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Handle the "Copy Link" button click
  const handleCopyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      toast.success("Referral link copied!");
    }
  };

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (!data) {
    return <p>Could not load dashboard data.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Referred Users" value={data.totalReferredUsers} />
        <StatCard title="Converted Users" value={data.convertedUsers} />
        <StatCard title="Total Credits Earned" value={data.totalCreditsEarned} />
      </div>

      {/* Section 2: Referral Link */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Referral Link</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            readOnly
            value={data.referralLink}
            className="w-full flex-1 rounded-md border-gray-600 bg-gray-700 p-2.5 text-gray-300"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Copy Link
          </motion.button>
        </div>
      </div>

      {/* Section 3: Simulate Purchase */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold">Simulate Purchase</h2>
        <p className="mb-4 text-gray-400">
          Click this button to simulate your first purchase. If you were referred,
          you and your referrer will both earn 2 credits.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePurchase}
          disabled={isPurchasing}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isPurchasing ? "Processing..." : "Buy Product ($10)"}
        </motion.button>
      </div>
    </div>
  );
}

// A simple component for the stat cards
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-gray-700 bg-gray-800 p-6"
    >
      <h3 className="mb-2 text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-4xl font-bold text-white">{value}</p>
    </motion.div>
  );
}