"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  if (!slug) slug = generateSlug(title);
  
  const category_id = formData.get("category_id") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const is_published = formData.get("is_published") === "true";

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    category_id: category_id || null,
    excerpt,
    content,
    is_published,
  });

  if (error) {
    console.error("Supabase Error [createPost]:", error);
    return;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
  redirect("/admin/posts");
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_id = formData.get("category_id") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const is_published = formData.get("is_published") === "true";

  const { error } = await supabase.from("posts").update({
    title,
    slug,
    category_id: category_id || null,
    excerpt,
    content,
    is_published,
  }).eq("id", id);

  if (error) {
    console.error("Supabase Error [updatePost]:", error);
    return;
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true };
}
