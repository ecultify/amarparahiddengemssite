import { AdminMobileBar, AdminSidebar } from "@/components/admin/AdminNav";
import { Toaster } from "@/components/ui/sonner";
import { COLLECTIONS } from "@/lib/schema";
import { listSubmissions } from "@/lib/submissions";

export const metadata = { title: "Content desk — Amar Para 2.0" };

// Editors must always see current data, never a prerendered snapshot.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const submissions = await listSubmissions();
  const newCount = submissions.filter((entry) => entry.status === "new").length;
  const collections = COLLECTIONS.map(({ key, label }) => ({ key, label }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar collections={collections} newCount={newCount} />
      <AdminMobileBar collections={collections} newCount={newCount} />
      <div className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">{children}</div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
