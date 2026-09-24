import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh items-center px-4 py-12">
      <AuthForm mode="register" />
    </main>
  );
}
