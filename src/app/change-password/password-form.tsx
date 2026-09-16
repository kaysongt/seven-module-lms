"use client";

import { useActionState } from "react";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { changePassword } from "./actions";

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, INITIAL_ACTION_STATE);
  return <form action={action} className="grid gap-5">
    <div className="field"><label htmlFor="currentPassword">Current or temporary password</label><input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required maxLength={128} /></div>
    <div className="field"><label htmlFor="password">New password</label><input id="password" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} aria-describedby="password-help" /><p id="password-help" className="text-xs text-[var(--ink-soft)]">Use at least 12 characters.</p>{state.fieldErrors?.password && <p className="form-error">{state.fieldErrors.password.join(" ")}</p>}</div>
    <div className="field"><label htmlFor="confirmPassword">Confirm new password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />{state.fieldErrors?.confirmPassword && <p className="form-error">{state.fieldErrors.confirmPassword.join(" ")}</p>}</div>
    {state.message && <p className="form-error" role="alert">{state.message}</p>}
    <FormButton pendingLabel="Saving your password…">Save password and continue</FormButton>
  </form>;
}
