"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setAuthToken, authApi, type AppUser } from "@/services/api";
import { ThemeToggle } from "@/components/Common/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type UserInfo = AppUser;

export function AppHeader() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, []);

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground shrink-0"
              title="View user details"
              aria-label="View user details"
            >
              {userLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium leading-none">
                  {user ? user.name || "User" : "—"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email ?? "—"}
                </p>
                {user?.id && (
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    ID: {user.id}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
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
