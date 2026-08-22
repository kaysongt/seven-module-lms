"use client";

import { useActionState } from "react";
import { createAnnouncement } from "@/app/admin/announcements/actions";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

export function AnnouncementForm() { const [state, action] = useActionState(createAnnouncement, INITIAL_ACTION_STATE); return <form action={action} className="grid gap-4 rounded-2xl border border-black/10 bg-white/65 p-5 md:p-7"><div className="field"><label>Title</label><input name="title" required /></div><div className="field"><label>Message</label><textarea name="body" required /></div>{state.message && <p className={state.status === "success" ? "form-success" : "form-error"}>{state.message}</p>}<div><FormButton pendingLabel="Publishing…">Publish announcement</FormButton></div></form>; }
