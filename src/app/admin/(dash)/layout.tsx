import { AdminSidebar } from "@/components/admin/AdminNav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { COLLECTIONS } from "@/lib/schema";
import { listSubmissions } from "@/lib/submissions";

export const metadata = { title: "Amar Para Content Desk" };

// Editors must always see current data, never a prerendered snapshot.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const submissions = await listSubmissions();
  const newCount = submissions.filter((entry) => entry.status === "new").length;
  const collections = COLLECTIONS.map(({ key, label }) => ({ key, label }));

  return (
    <TooltipProvider>
    <SidebarProvider>
      <AdminSidebar collections={collections} newCount={newCount} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-semibold">Amar Para content desk</span>
        </header>
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">{children}</div>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
    </TooltipProvider>
  );
}
