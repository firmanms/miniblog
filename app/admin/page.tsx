import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Tags } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get total posts
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  // Get total categories
  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your blog dashboard. Here is what is happening.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
