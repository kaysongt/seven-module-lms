"use client";
import { useActionState, useState } from "react";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import {
  CLEARANCE_LEVELS,
  MAX_MINISTRY_FILE_BYTES,
} from "@/lib/ministry-policy";
import { uploadMinistryFile, updateMinistryFile } from "./actions";

type EditableFile = {
  id: string;
  version: number;
  title: string;
  description: string;
  clearance: number;
  status: string;
};
export function MinistryFileForm({ file }: { file?: EditableFile }) {
  const [state, action] = useActionState(
    file ? updateMinistryFile : uploadMinistryFile,
    INITIAL_ACTION_STATE,
  );
  const [sizeError, setSizeError] = useState("");
  const prefix = file?.id ?? "new-file";
  return (
    <form
      key={file?.version ?? "upload"}
      action={action}
      className="grid gap-4"
    >
      {file && (
        <>
          <input type="hidden" name="id" value={file.id} />
          <input type="hidden" name="version" value={file.version} />
        </>
      )}
      <div className="field">
        <label htmlFor={`${prefix}-title`}>Document title</label>
        <input
          id={`${prefix}-title`}
          name="title"
          defaultValue={file?.title}
          minLength={2}
          maxLength={160}
          required
        />
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-description`}>Description (optional)</label>
        <textarea
          id={`${prefix}-description`}
          name="description"
          defaultValue={file?.description}
          rows={2}
          maxLength={2000}
        />
      </div>
      {!file && (
        <div className="field">
          <label htmlFor="ministry-upload">Document file</label>
          <input
            id="ministry-upload"
            name="file"
            type="file"
            accept=".pdf,.docx,.xlsx,.pptx"
            required
            aria-describedby="upload-help"
            onChange={(event) => {
              const tooLarge =
                (event.target.files?.[0]?.size ?? 0) > MAX_MINISTRY_FILE_BYTES;
              event.target.setCustomValidity(
                tooLarge ? "Choose a document no larger than 3 MB." : "",
              );
              setSizeError(
                tooLarge
                  ? "This file is larger than 3 MB. Please use a smaller document."
                  : "",
              );
            }}
          />
          <p id="upload-help" className="text-sm leading-6 text-[#42566d]">
            PDF, Word (.docx), Excel (.xlsx), or PowerPoint (.pptx). Maximum 3
            MB. Files are stored privately.
          </p>
          {sizeError && (
            <p className="form-error" role="alert">
              {sizeError}
            </p>
          )}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${prefix}-clearance`}>Minimum clearance</label>
          <select
            id={`${prefix}-clearance`}
            name="clearance"
            defaultValue={file?.clearance ?? 1}
          >
            {CLEARANCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${prefix}-status`}>Publication status</label>
          <select
            id={`${prefix}-status`}
            name="status"
            defaultValue={file?.status ?? "DRAFT"}
          >
            <option value="DRAFT">Draft — administrators only</option>
            <option value="PUBLISHED">Published — approved ministers</option>
            <option value="ARCHIVED">Archived — administrators only</option>
          </select>
        </div>
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
        <FormButton pendingLabel={file ? "Saving…" : "Uploading…"}>
          {file ? "Save document settings" : "Upload document"}
        </FormButton>
      </div>
    </form>
  );
}
