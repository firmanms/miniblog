"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = generateSlug(name);

  const { error } = await supabase.from("categories").insert({ name, slug });
  
  if (error) {
    console.error("Supabase Error [createCategory]:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from("categories").delete().eq("id", id);
  
  if (error) {
    console.error("Supabase Error [deleteCategory]:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
