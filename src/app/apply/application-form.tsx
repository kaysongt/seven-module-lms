"use client";

import { useActionState } from "react";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { submitApplication } from "@/app/apply/actions";

function ErrorText({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="text-xs font-semibold text-[#8b3d28]" role="alert">{errors[0]}</span>;
}

export function ApplicationForm() {
  const [state, action] = useActionState(submitApplication, INITIAL_ACTION_STATE);

  if (state.status === "success") {
    return <div className="form-success text-base leading-7" role="status">{state.message}</div>;
  }

  return (
    <form action={action} className="grid gap-5">
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" autoComplete="name" required /><ErrorText errors={state.fieldErrors?.fullName} /></div>
        <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /><ErrorText errors={state.fieldErrors?.email} /></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field"><label htmlFor="phone">Phone <span className="font-normal opacity-60">(optional)</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="field"><label htmlFor="country">Country</label><input id="country" name="country" autoComplete="country-name" required /><ErrorText errors={state.fieldErrors?.country} /></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="field"><label htmlFor="churchOrOrganization">Church or organization <span className="font-normal opacity-60">(optional)</span></label><input id="churchOrOrganization" name="churchOrOrganization" /></div>
        <div className="field"><label htmlFor="ministryRole">Current role <span className="font-normal opacity-60">(optional)</span></label><input id="ministryRole" name="ministryRole" /></div>
      </div>
      <div className="field"><label htmlFor="reason">Why do you want to take this program?</label><textarea id="reason" name="reason" required placeholder="Share what you hope to learn and how you plan to use it." /><ErrorText errors={state.fieldErrors?.reason} /></div>
      {state.status === "error" && <p className="form-error" role="alert">{state.message}</p>}
      <div className="flex items-center justify-between gap-5 border-t border-[var(--line)] pt-5">
        <p className="max-w-sm text-xs leading-5 text-[var(--ink-soft)]/70">Submitting does not create an account. Approved applicants receive a private activation link.</p>
        <FormButton pendingLabel="Submitting…">Submit application</FormButton>
      </div>
    </form>
  );
}
