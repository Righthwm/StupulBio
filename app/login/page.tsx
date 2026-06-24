import { Suspense } from "react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Autentificare" };

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 pt-28">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-heading text-2xl text-text-primary">Bine ai revenit</h1>
          <p className="text-text-muted text-sm mt-1">Autentifică-te în contul tău</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
