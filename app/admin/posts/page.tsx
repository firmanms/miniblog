import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { deletePost } from "./actions";
import { Trash2, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, title, slug, is_published, created_at,
      categories (name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">Manage your blog articles.</p>
        </div>
        <Link href="/admin/posts/create" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {(!posts || posts.length === 0) ? (
            <p className="text-sm text-muted-foreground">No posts found.</p>
          ) : (
            <div className="divide-y">
              {posts.map((post: any) => (
                <div key={post.id} className="flex items-center justify-between py-4">
                  <div>
                    <Link href={`/posts/${post.slug}`} className="font-medium hover:underline block">
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {post.is_published ? (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">Published</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Draft</Badge>
                      )}
                      {post.categories && (
                         <span className="text-xs text-muted-foreground">• {post.categories.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">• {format(new Date(post.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                      <Edit className="h-4 w-4" />
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deletePost(post.id);
                    }}>
                      <button type="submit" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-destructive hover:text-destructive hover:bg-destructive/10" })}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
