"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <form
        action={formAction}
        className="card p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="font-heading text-2xl text-text-primary text-center">
          Administrare
        </h1>
        {state.error && (
          <p className="text-error text-sm text-center" role="alert">
            {state.error}
          </p>
        )}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="bg-bg-surface border border-gold-400/20 rounded-sm px-3 py-2 text-text-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">Parolă</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="bg-bg-surface border border-gold-400/20 rounded-sm px-3 py-2 text-text-primary"
          />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Se verifică…" : "Autentificare"}
        </button>
      </form>
    </div>
  );
}
