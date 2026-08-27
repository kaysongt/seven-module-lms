"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { login } from "@/app/login/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(login, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required autoFocus /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {state.status === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <FormButton pendingLabel="Signing in…">Sign in</FormButton>
      <p className="text-center text-xs leading-5 text-[var(--ink-soft)]/70">Need an account? <Link href="/signup" className="font-extrabold text-[var(--forest)] underline underline-offset-4">Create one free</Link>.</p>
    </form>
  );
}
