"use client";
import { useActionState } from "react";
import { reviewMinister } from "./actions";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { CLEARANCE_LEVELS } from "@/lib/ministry-policy";
import { FormButton } from "@/components/form-button";

export function MinisterReviewForm({
  profile,
}: {
  profile: {
    userId: string;
    version: number;
    status: string;
    clearance: number;
    adminNotes: string | null;
  };
}) {
  const [state, action] = useActionState(reviewMinister, INITIAL_ACTION_STATE);
  const prefix = profile.userId;
  return (
    <form
      key={profile.version}
      action={action}
      className="mt-6 grid gap-4 border-t border-black/10 pt-5"
    >
      <input type="hidden" name="userId" value={profile.userId} />
      <input type="hidden" name="version" value={profile.version} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor={`status-${prefix}`}>Decision / access status</label>
          <select
            id={`status-${prefix}`}
            name="status"
            defaultValue={profile.status === "PENDING" ? "" : profile.status}
            required
          >
            <option value="" disabled>
              Choose a decision
            </option>
            <option value="APPROVED">Approved</option>
            <option value="DECLINED">Declined</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`clearance-${prefix}`}>Clearance when approved</label>
          <select
            id={`clearance-${prefix}`}
            name="clearance"
            defaultValue={profile.clearance || 1}
          >
            {CLEARANCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-sm leading-6 text-[#42566d]">
        Higher clearance includes lower levels. Declined and suspended accounts
        cannot download files. Verify the applicant’s identity and ministry role
        before approving.
      </p>
      <div className="field">
        <label htmlFor={`notes-${prefix}`}>Administrator notes (private)</label>
        <textarea
          id={`notes-${prefix}`}
          name="adminNotes"
          maxLength={2000}
          rows={2}
          defaultValue={profile.adminNotes ?? ""}
        />
      </div>
      {state.status !== "idle" && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "form-error" : "form-success"}
        >
          {state.message}
        </p>
      )}
      <div>
        <FormButton pendingLabel="Updating access…">
          Save access decision
        </FormButton>
      </div>
    </form>
  );
}
