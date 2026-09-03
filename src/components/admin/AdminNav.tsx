"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Images, Inbox, LayoutDashboard, LogOut, Settings, UsersRound } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { collectionIcon } from "@/components/admin/collectionIcons";
import { logout } from "@/app/actions/auth";

export type NavCollection = { key: string; label: string };

/** The three gallery collections live together under one nav group. */
const GALLERY_KEYS = ["photoGems", "videoGems", "streetStories"];

/** The content desk's navigation rail, on the shadcn sidebar. Collapses to
 *  icons on desktop and becomes a drawer on mobile. */
export function AdminSidebar({
  collections,
  newCount,
}: {
  collections: NavCollection[];
  newCount: number;
}) {
  const pathname = usePathname();
  const galleries = collections.filter((c) => GALLERY_KEYS.includes(c.key));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Overview">
              <Link href="/admin">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red text-[13px] font-black text-white">
                  AP
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-bold">Amar Para 2.0</span>
                  <span className="text-[11px] font-medium opacity-60">Content desk</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"} tooltip="Overview">
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/admin/submissions")}
                  tooltip="Submissions"
                >
                  <Link href="/admin/submissions">
                    <Inbox />
                    <span>Submissions</span>
                  </Link>
                </SidebarMenuButton>
                {newCount > 0 ? (
                  <SidebarMenuBadge className="rounded-full bg-pink px-1.5 text-white">
                    {newCount}
                  </SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/admin/users")}
                  tooltip="Users"
                >
                  <Link href="/admin/users">
                    <UsersRound />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Site content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {collections
                .filter((c) => !GALLERY_KEYS.includes(c.key))
                .map((collection) => {
                  const Icon = collectionIcon(collection.key);
                  const href = `/admin/content/${collection.key}`;
                  return (
                    <SidebarMenuItem key={collection.key}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(href)}
                        tooltip={collection.label}
                      >
                        <Link href={href}>
                          <Icon />
                          <span>{collection.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

              {/* The 500 Gems galleries fold into one group, open whenever
                  the page you are on lives inside it. */}
              <Collapsible
                asChild
                defaultOpen={galleries.some((c) => pathname.startsWith(`/admin/content/${c.key}`))}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Galleries">
                      <Images />
                      <span>Galleries</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {galleries.map((collection) => {
                        const href = `/admin/content/${collection.key}`;
                        return (
                          <SidebarMenuSubItem key={collection.key}>
                            <SidebarMenuSubButton asChild isActive={pathname.startsWith(href)}>
                              <Link href={href}>
                                <span>{collection.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/admin/settings"}
              tooltip="Settings"
            >
              <Link href="/admin/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton type="submit" tooltip="Sign out">
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
