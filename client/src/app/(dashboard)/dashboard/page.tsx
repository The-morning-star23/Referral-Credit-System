import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Your Dashboard</h1>
      <DashboardClient />
    </div>
  );
}