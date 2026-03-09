"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  GitCompare,
  Cpu,
  Database,
  FileDown,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explainability", href: "/explainability", icon: Lightbulb },
  { label: "Scenario Analysis", href: "/scenario-analysis", icon: GitCompare },
  { label: "Model Management", href: "/models", icon: Cpu },
  { label: "Data Management", href: "/data", icon: Database },
  { label: "Export", href: "/export", icon: FileDown },
];

const systemInfoNav = { label: "System Info", href: "/system-info", icon: BookOpen };

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-2">
        <Link href="/dashboard" className="truncate px-2 font-semibold">
          Forecast & XAI
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {mainNav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
        <div className="my-2 border-t border-sidebar-border" />
        <Link
          href={systemInfoNav.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === systemInfoNav.href
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          )}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          {systemInfoNav.label}
        </Link>
      </nav>
    </aside>
  );
}
