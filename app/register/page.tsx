import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Înregistrare" };

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 pt-28">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-heading text-2xl text-text-primary">Creează un cont</h1>
          <p className="text-text-muted text-sm mt-1">Înregistrează-te ca să comanzi mai rapid</p>
        </div>
        <RegisterForm />
      </Card>
    </div>
  );
}
