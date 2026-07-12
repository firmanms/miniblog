"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  const isSupabaseConfigError = 
    error.message?.includes("supabaseUrl is required") || 
    error.message?.includes("supabaseKey is required") ||
    error.message?.includes("Supabase URL and Anon Key must be configured");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Terjadi Kesalahan</h2>
        
        {isSupabaseConfigError ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Aplikasi gagal terhubung ke Supabase. Kemungkinan besar **Environment Variables** belum dikonfigurasi di dashboard Vercel Anda.
            </p>
            <div className="p-4 bg-muted rounded-lg text-left text-xs font-mono overflow-x-auto space-y-2">
              <p className="font-semibold text-foreground">Pastikan variabel ini terdaftar di Vercel:</p>
              <p>• NEXT_PUBLIC_SUPABASE_URL</p>
              <p>• NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            Terjadi kesalahan pada server saat memuat halaman ini. Silakan coba muat ulang halaman.
          </p>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} variant="default">
            Coba Lagi
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
