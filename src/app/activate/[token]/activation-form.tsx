"use client";

import { useActionState } from "react";
import { activateAccount } from "@/app/activate/[token]/actions";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

export function ActivationForm({ token }: { token: string }) {
  const [state, action] = useActionState(activateAccount, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="token" value={token} />
      <div className="field"><label htmlFor="password">Create password</label><input id="password" name="password" type="password" minLength={12} autoComplete="new-password" required /><span className="text-xs text-[var(--ink-soft)]/65">Use at least 12 characters and do not reuse another password.</span></div>
      <div className="field"><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required /></div>
      {state.status === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <FormButton pendingLabel="Activating…">Activate account</FormButton>
    </form>
  );
}
