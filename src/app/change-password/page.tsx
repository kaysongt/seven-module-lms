import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/logout/actions";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Change password" };

export default async function ChangePasswordPage() {
  const user = await getCurrentUser({ allowPasswordChange: true });
  if (!user) redirect("/login?next=/change-password");
  return <main className="min-h-screen bg-[var(--paper)] px-5 py-12"><div className="mx-auto max-w-lg rounded-3xl border border-[var(--line)] bg-[var(--paper-light)] p-7 md:p-10">
    <Brand />
    <span className="eyebrow mt-10">Account security</span>
    <h1 className="display mt-4 text-4xl font-semibold">{user.mustChangePassword ? "Choose your own password." : "Change your password."}</h1>
    <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{user.mustChangePassword ? "Before opening your account, replace the temporary password with one only you know." : "Update your password here. Other signed-in sessions will be signed out."}</p>
    <p className="mt-3 break-all text-sm font-bold">{user.email}</p>
    <div className="mt-8"><PasswordForm /></div>
    <form action={logout} className="mt-6"><button className="button-quiet">Sign out</button></form>
  </div></main>;
}
