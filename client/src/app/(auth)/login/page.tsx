import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">Welcome Back</h1>
      <p className="mb-6 text-center text-sm text-gray-400">
        Sign in to access your dashboard.
      </p>
      <LoginForm />
    </div>
  );
}