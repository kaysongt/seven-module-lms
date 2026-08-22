"use client";

import { useActionState } from "react";
import { createPost } from "@/app/dashboard/community/actions";
import { FormButton } from "@/components/form-button";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

export function CommunityForm({ modules, selectedModuleId, parentId }: { modules: Array<{ id: string; title: string }>; selectedModuleId?: string; parentId?: string }) {
  const [state, action] = useActionState(createPost, INITIAL_ACTION_STATE);
  return <form action={action} className="grid gap-4"><input type="hidden" name="parentId" value={parentId ?? ""} />{parentId ? <input type="hidden" name="moduleId" value={selectedModuleId} /> : <div className="field"><label htmlFor="moduleId">Module conversation</label><select id="moduleId" name="moduleId" defaultValue={selectedModuleId} required>{modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select></div>}<div className="field"><label htmlFor={parentId ? `body-${parentId}` : "body"}>{parentId ? "Reply" : "What would you like to contribute?"}</label><textarea id={parentId ? `body-${parentId}` : "body"} name="body" minLength={10} required placeholder={parentId ? "Write a thoughtful reply." : "Ask a question, share an insight, or name a point you are still considering."} /></div>{state.message && <p className={state.status === "success" ? "form-success" : "form-error"}>{state.message}</p>}<div><FormButton pendingLabel="Posting…" className={parentId ? "button-secondary" : "button-primary"}>{parentId ? "Post reply" : "Post to community"}</FormButton></div></form>;
}
