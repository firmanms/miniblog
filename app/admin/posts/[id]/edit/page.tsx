import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { updatePost } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PostForm } from "../../_components/post-form";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase.from("posts").select("*").eq("id", resolvedParams.id).single();
  const { data: categories } = await supabase.from("categories").select("id, name");

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/posts" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Artikel</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <PostForm 
            categories={categories || []} 
            initialPost={post} 
            action={updatePost} 
            submitLabel="Perbarui Artikel" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
