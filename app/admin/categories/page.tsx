import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, deleteCategory } from "./actions";
import { Trash2 } from "lucide-react";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage the categories for your blog posts.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Category */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="e.g. Technology" />
              </div>
              <Button type="submit">Save Category</Button>
            </form>
          </CardContent>
        </Card>

        {/* List Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {(!categories || categories.length === 0) ? (
              <p className="text-sm text-muted-foreground">No categories found.</p>
            ) : (
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">/{category.slug}</p>
                    </div>
                    <form action={async () => {
                      "use server";
                      await deleteCategory(category.id);
                    }}>
                      <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
