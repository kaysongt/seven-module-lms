import Link from "next/link";
import { BookOpenText, Gauge, LogOut, MessageCircle, Settings2, ShieldCheck } from "lucide-react";
import type { User } from "@prisma/client";
import { Brand } from "@/components/brand";
import { logout } from "@/app/logout/actions";

const studentLinks = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/dashboard#modules", label: "Modules", icon: BookOpenText },
  { href: "/dashboard/community", label: "Community", icon: MessageCircle },
];

export function PortalShell({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper-light)] print:block lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-[var(--line)] bg-[var(--paper)] p-6 print:hidden lg:flex lg:flex-col">
        <Brand />
        <nav className="mt-12 grid gap-2" aria-label="Student portal">
          {studentLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[var(--ink-soft)] transition hover:bg-white/70 hover:text-[var(--forest)]"><Icon size={18} />{label}</Link>)}
          {user.role !== "STUDENT" && <Link href="/admin" className="mt-3 flex items-center gap-3 rounded-xl bg-[var(--forest-deep)] px-3 py-3 text-sm font-bold text-white"><ShieldCheck size={18} />Administration</Link>}
        </nav>
        <div className="mt-auto border-t border-[var(--line)] pt-5">
          <p className="truncate text-sm font-extrabold">{user.fullName}</p>
          <p className="mt-1 truncate text-xs text-[var(--ink-soft)]/65">{user.email}</p>
          <form action={logout} className="mt-4"><button className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--ink-soft)] hover:text-[var(--clay)]"><LogOut size={15} /> Sign out</button></form>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[rgba(251,248,241,0.9)] px-4 backdrop-blur-lg print:hidden lg:hidden">
          <Brand compact />
          <nav className="flex items-center gap-1" aria-label="Mobile student portal">
            <Link href="/dashboard" className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--sage-light)]" aria-label="Dashboard"><Gauge size={18} /></Link>
            <Link href="/dashboard/community" className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--sage-light)]" aria-label="Community"><MessageCircle size={18} /></Link>
            {user.role !== "STUDENT" && <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--sage-light)]" aria-label="Administration"><Settings2 size={18} /></Link>}
            <form action={logout}><button className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--sage-light)]" aria-label="Sign out"><LogOut size={18} /></button></form>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
