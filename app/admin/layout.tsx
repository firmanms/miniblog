import Link from "next/link";
import { LayoutDashboard, FileText, Tags, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r bg-muted/30 p-6 flex flex-col gap-6">
        <div className="font-bold text-lg mb-4">Admin Dashboard</div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors text-sm font-medium"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/admin/posts"
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            Posts
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors text-sm font-medium"
          >
            <Tags className="h-4 w-4" />
            Categories
          </Link>
        </nav>
        <div className="mt-auto">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-medium w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
