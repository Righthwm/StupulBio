"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Parolele nu coincid.");
      return;
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data: { success: boolean; message?: string } = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.message ?? "Eroare la înregistrare.");
      return;
    }

    // Auto-login after successful registration.
    const login = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (login?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-error text-sm text-center" role="alert">
          {error}
        </p>
      )}
      <Input label="Nume" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <Input
        label="Parolă"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      <Input
        label="Confirmă parola"
        type="password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
      />
      <Button type="submit" loading={loading} className="w-full mt-1">
        Creează cont
      </Button>
      <p className="text-text-muted text-sm text-center">
        Ai deja cont?{" "}
        <Link href="/login" className="text-gold-300 hover:underline">
          Autentifică-te
        </Link>
      </p>
    </form>
  );
}
