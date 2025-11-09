import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">Create Account</h1>
      <p className="mb-6 text-center text-sm text-gray-400">
        Sign up and get your own referral link.
      </p>
      <RegisterForm />
    </div>
  );
}