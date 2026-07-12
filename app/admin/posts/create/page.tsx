import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { createPost } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "../_components/post-form";

export default async function CreatePostPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/posts" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Buat Artikel Baru</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <PostForm 
            categories={categories || []} 
            action={createPost} 
            submitLabel="Buat Artikel" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
