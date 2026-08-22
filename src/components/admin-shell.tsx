import Link from "next/link";
import { BookCopy, ClipboardCheck, FileText, Gauge, GraduationCap, LogOut, Megaphone, MessageSquareText, UsersRound } from "lucide-react";
import type { User } from "@prisma/client";
import { logout } from "@/app/logout/actions";
import { Brand } from "@/components/brand";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/students", label: "Students", icon: UsersRound },
  { href: "/admin/curriculum", label: "Curriculum", icon: BookCopy },
  { href: "/admin/submissions", label: "Submissions", icon: ClipboardCheck },
  { href: "/admin/community", label: "Community", icon: MessageSquareText },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export function AdminShell({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f0e9] xl:grid xl:grid-cols-[270px_1fr]">
      <aside className="hidden border-r border-black/10 bg-[var(--forest-deep)] p-6 text-white xl:flex xl:flex-col">
        <div className="rounded-2xl bg-[var(--paper-light)] p-3"><Brand /></div>
        <p className="mt-7 text-[0.62rem] font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">Administration</p>
        <nav className="mt-4 grid gap-1" aria-label="Administration">
          {adminLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-white/66 transition hover:bg-white/8 hover:text-white"><Icon size={17} /> {label}</Link>)}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5"><p className="truncate text-sm font-extrabold">{user.fullName}</p><p className="mt-1 text-xs text-white/45">{user.role.toLowerCase()}</p><div className="mt-4 flex gap-4"><Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--sun-soft)]"><GraduationCap size={15} /> Student view</Link><form action={logout}><button className="inline-flex items-center gap-2 text-xs font-extrabold text-white/55"><LogOut size={14} /> Sign out</button></form></div></div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-black/10 bg-[rgba(243,240,233,.9)] px-4 backdrop-blur-xl xl:hidden"><Brand compact /><details className="relative"><summary className="cursor-pointer list-none rounded-full bg-[var(--forest-deep)] px-4 py-2 text-xs font-extrabold text-white">Admin menu</summary><nav className="absolute right-0 mt-2 grid min-w-60 gap-1 rounded-2xl border border-black/10 bg-[var(--paper-light)] p-2 shadow-2xl">{adminLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold hover:bg-[var(--sage-light)]"><Icon size={16} />{label}</Link>)}<Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold"><GraduationCap size={16} />Student view</Link></nav></details></header>
        <main>{children}</main>
      </div>
    </div>
  );
}
