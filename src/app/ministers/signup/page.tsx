import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MinisterSignupForm } from "./signup-form";

export const metadata = { title: "Request minister access" };

export default async function MinisterSignupPage() {
  const user = await getCurrentUser();
  if (
    user &&
    (user.role === "ADMIN" ||
      (await db.ministerProfile.findUnique({
        where: { userId: user.id },
        select: { userId: true },
      })))
  )
    redirect("/ministers");
  return (
    <div className="kw-shell ministry-auth" style={{ alignItems: "start" }}>
      <section className="ministry-intro">
        <p className="kw-kicker">JOIN THE MINISTERS PORTAL</p>
        <h1>
          Request
          <br />
          <em>your access.</em>
        </h1>
        <p>
          Tell us where you serve. Our administrators will review your request
          before you can open ministry files.
        </p>
        <div className="ministry-note">
          <p>
            {user
              ? `You are signed in as ${user.email}. This request will be linked to your existing account.`
              : "Already have a KingsWord account? Sign in first to request access using that account."}
          </p>
        </div>
        <Link href="/ministers/login" className="kw-text-link">
          Ministers Login
        </Link>
      </section>
      <section className="ministry-panel">
        <h2>{user ? "Your ministry details" : "Create your account"}</h2>
        <p>All fields are required unless marked optional.</p>
        <MinisterSignupForm existingAccount={!!user} />
      </section>
    </div>
  );
}
