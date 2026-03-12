"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  /** Show label next to icon (e.g. in sidebar). */
  showLabel?: boolean;
};

export function ThemeToggle({
  variant = "ghost",
  size = "icon",
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // `resolvedTheme` is client-derived (localStorage). Avoid SSR/client mismatches by
  // rendering a stable first pass until after mount.
  const effectiveTheme = mounted ? resolvedTheme : "light";
  const Icon = effectiveTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(showLabel && "w-full justify-start gap-3", className)}
          aria-label="Toggle theme"
          suppressHydrationWarning
        >
          <Icon className="h-4 w-4 shrink-0" />
          {showLabel && (
            <span className="font-medium">
              {effectiveTheme === "dark" ? "Dark" : "Light"}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={showLabel ? "start" : "end"} side={showLabel ? "right" : "bottom"}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
