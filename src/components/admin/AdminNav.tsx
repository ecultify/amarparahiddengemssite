"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Inbox, LayoutDashboard, Menu, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { collectionIcon } from "@/components/admin/collectionIcons";
import { logout } from "@/app/actions/auth";

export type NavCollection = { key: string; label: string };

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-white/12 font-semibold text-white"
          : "font-medium text-white/65 hover:bg-white/6 hover:text-white"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
      {badge ? (
        <span className="ml-auto rounded-full bg-pink px-2 py-0.5 text-[11px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function NavBody({
  collections,
  newCount,
  onNavigate,
}: {
  collections: NavCollection[];
  newCount: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-2 pt-1">
        <span className="flex size-8 items-center justify-center rounded-md bg-red text-[13px] font-black text-white">
          AP
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-white">Amar Para 2.0</span>
          <span className="text-[11px] font-medium text-white/50">Content desk</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        <NavLink
          href="/admin"
          label="Overview"
          icon={LayoutDashboard}
          active={pathname === "/admin"}
          onNavigate={onNavigate}
        />
        <NavLink
          href="/admin/submissions"
          label="Submissions"
          icon={Inbox}
          active={pathname.startsWith("/admin/submissions")}
          badge={newCount}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Site content
        </p>
        {collections.map((collection) => (
          <NavLink
            key={collection.key}
            href={`/admin/content/${collection.key}`}
            label={collection.label}
            icon={collectionIcon(collection.key)}
            active={pathname.startsWith(`/admin/content/${collection.key}`)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <NavLink
          href="/admin/settings"
          label="Settings"
          icon={Settings}
          active={pathname === "/admin/settings"}
          onNavigate={onNavigate}
        />
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start px-3 text-sm font-medium text-white/65 hover:bg-white/6 hover:text-white"
          >
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar(props: { collections: NavCollection[]; newCount: number }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 bg-navy lg:block">
      <NavBody {...props} />
    </aside>
  );
}

export function AdminMobileBar(props: { collections: NavCollection[]; newCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 flex items-center gap-3 border-b bg-background px-4 py-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-0 bg-navy p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <NavBody {...props} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <span className="text-sm font-semibold">Amar Para content desk</span>
    </div>
  );
}
