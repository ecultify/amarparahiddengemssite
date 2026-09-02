import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthed } from "@/lib/auth";

export const metadata = { title: "Sign in to the Amar Para Content Desk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  if (await isAuthed()) redirect("/admin");
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Amar Para content desk</CardTitle>
          <CardDescription>
            Editors only. Everything you publish here goes live on amarpara-hidden-gems.vercel.app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm from={from ?? "/admin"} />
        </CardContent>
      </Card>
    </div>
  );
}
