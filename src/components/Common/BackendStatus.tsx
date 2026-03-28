"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type BackendConnectionStatus = "checking" | "online" | "offline";

interface BackendStatusProps {
  className?: string;
  variant?: "card" | "inline";
  onStatusChange?: (status: BackendConnectionStatus) => void;
}

export function BackendStatus({
  className,
  variant = "card",
  onStatusChange,
}: BackendStatusProps) {
  const [status, setStatus] = useState<BackendConnectionStatus>("checking");

  const checkBackend = async (showCheckingState: boolean) => {
    if (showCheckingState) setStatus("checking");
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      });
      if (response.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch {
      setStatus("offline");
    }
  };

  useEffect(() => {
    const initial = setTimeout(() => {
      void checkBackend(true);
    }, 0);
    // Check every 5 seconds
    const interval = setInterval(() => {
      void checkBackend(false);
    }, 5000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  const StatusRow = (
    <div className="flex items-center gap-2">
      {status === "checking" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Checking...</span>
        </>
      )}
      {status === "online" && (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">Online</span>
        </>
      )}
      {status === "offline" && (
        <>
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">Offline</span>
        </>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div className={cn("rounded-md border border-border bg-background/70 p-3", className)}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Server className="h-4 w-4" />
              Backend
            </div>
            {StatusRow}
          </div>
        </div>
        {status === "offline" ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Needed before Sign in/Register. Start backend in terminal with{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-xs">npm run dev:all</code>.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Server className="h-4 w-4" />
          Backend Status
        </CardTitle>
        <CardDescription>Connection to API server</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {StatusRow}
        {status === "offline" ? (
          <p className="text-xs text-muted-foreground">
            Start backend from terminal using <code className="px-1 py-0.5 bg-muted rounded text-xs">npm run dev:all</code>.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
