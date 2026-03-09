"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { setAuthToken } from "@/services/api";
import { ThemeToggle } from "@/components/Common/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border bg-muted/30 px-4">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--border) 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex items-center gap-2">
      <ThemeToggle size="icon" variant="ghost" className="shrink-0" />
      <Link
        href="/login"
        onClick={() => setAuthToken(null)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "text-muted-foreground hover:text-foreground"
        )}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Link>
      </div>
    </header>
  );
}
