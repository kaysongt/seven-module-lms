"use client";
import { useActionState } from "react";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { registerMinister, requestMinisterAccess } from "../actions";

export function MinisterSignupForm({
  existingAccount = false,
}: {
  existingAccount?: boolean;
}) {
  const [state, action] = useActionState(
    existingAccount ? requestMinisterAccess : registerMinister,
    INITIAL_ACTION_STATE,
  );
  const fields = [
    ...(!existingAccount
      ? [
          {
            name: "fullName",
            label: "Full name",
            type: "text",
            auto: "name",
            max: 120,
          },
          {
            name: "email",
            label: "Email address",
            type: "email",
            auto: "email",
            max: 254,
          },
        ]
      : []),
    { name: "phone", label: "Phone number", type: "tel", auto: "tel", max: 40 },
    {
      name: "church",
      label: "Church / congregation",
      type: "text",
      auto: "organization",
      max: 160,
    },
    {
      name: "ministryRole",
      label: "Ministry role",
      type: "text",
      auto: "organization-title",
      max: 120,
    },
    ...(!existingAccount
      ? [
          {
            name: "password",
            label: "Password (at least 12 characters)",
            type: "password",
            auto: "new-password",
            max: 128,
          },
          {
            name: "confirmPassword",
            label: "Confirm password",
            type: "password",
            auto: "new-password",
            max: 128,
          },
        ]
      : []),
  ];
  return (
    <form action={action} className="grid gap-5">
      {fields.map((field) => (
        <div className="field" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            autoComplete={field.auto}
            maxLength={field.max}
            minLength={field.type === "password" ? 12 : undefined}
            required
            aria-invalid={!!state.fieldErrors?.[field.name]}
            aria-describedby={
              state.fieldErrors?.[field.name]
                ? `${field.name}-error`
                : undefined
            }
          />
          {state.fieldErrors?.[field.name] && (
            <p id={`${field.name}-error`} className="form-error">
              {state.fieldErrors[field.name].join(" ")}
            </p>
          )}
        </div>
      ))}
      <div className="field">
        <label htmlFor="requestNote">
          Anything else for the administrator? (optional)
        </label>
        <textarea
          id="requestNote"
          name="requestNote"
          rows={3}
          maxLength={1500}
        />
      </div>
      {!existingAccount && (
        <div hidden aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" autoComplete="off" tabIndex={-1} />
        </div>
      )}
      <p className="text-sm leading-6 text-[#42566d]">
        An administrator will verify your ministry details and assign your
        access level. Creating an account does not unlock documents.
      </p>
      {state.status === "error" && (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      )}
      <FormButton pendingLabel="Submitting request…">
        Request minister access
      </FormButton>
    </form>
  );
}
