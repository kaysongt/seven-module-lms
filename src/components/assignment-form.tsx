"use client";

import { useActionState } from "react";
import { submitAssignment } from "@/app/dashboard/modules/[moduleSlug]/lessons/[lessonSlug]/actions";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

export function AssignmentForm({ lessonId }: { lessonId: string }) {
  const [state, action] = useActionState(submitAssignment, INITIAL_ACTION_STATE);
  return <form action={action} className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--sage-light)]/35 p-5 md:p-7"><input type="hidden" name="lessonId" value={lessonId} /><div className="field"><label htmlFor="response">Your response</label><textarea id="response" name="response" required minLength={40} placeholder="Write your considered response here." /></div>{state.message && <p className={state.status === "success" ? "form-success mt-4" : "form-error mt-4"}>{state.message}</p>}<div className="mt-5"><FormButton pendingLabel="Submitting…">Submit response</FormButton></div></form>;
}
