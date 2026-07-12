export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto bg-muted/10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:px-8 md:h-16 md:flex-row">
        <p className="text-center text-xs sm:text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Antigravity Blog. Dibuat dengan prinsip desain minimalis dan profesional.
        </p>
      </div>
    </footer>
  );
}
