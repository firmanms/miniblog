import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export async function Navbar() {
  let categories: { name: string; slug: string }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("name, slug");
    if (data) {
      categories = data;
    }
  } catch (error) {
    console.error("Failed to fetch categories for Navbar:", error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Catatan
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
