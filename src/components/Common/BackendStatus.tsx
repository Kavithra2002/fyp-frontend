"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, CheckCircle2, XCircle, Loader2, Play, Square } from "lucide-react";
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
  const [isStarting, setIsStarting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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
    } catch (error) {
      setStatus("offline");
    }
  };

  const handleStartBackend = async () => {
    setIsStarting(true);
    setActionError(null);
    try {
      const response = await fetch("/api/backend/start", {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));
      
      if (data.success) {
        // Wait a bit then check status
        setTimeout(() => {
          checkBackend(false);
          setIsStarting(false);
        }, 2000);
      } else {
        setActionError(
          data.message ||
            "Failed to start backend. If this keeps happening, run 'npm run dev:all' from the frontend folder."
        );
        setIsStarting(false);
      }
    } catch (error) {
      setActionError(
        "Failed to start backend from the UI. Try again, or run 'npm run dev:all' from the frontend folder."
      );
      setIsStarting(false);
    }
  };

  const handleStopBackend = async () => {
    setIsStarting(true);
    setActionError(null);
    try {
      const response = await fetch("/api/backend/stop", { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (data.success) {
        setTimeout(() => {
          checkBackend(false);
          setIsStarting(false);
        }, 800);
      } else {
        setActionError(data.message || "Failed to stop backend.");
        setIsStarting(false);
      }
    } catch {
      setActionError("Failed to stop backend.");
      setIsStarting(false);
    }
  };

  useEffect(() => {
    checkBackend(true);
    // Check every 5 seconds
    const interval = setInterval(() => checkBackend(false), 5000);
    return () => clearInterval(interval);
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

  const StartControls =
    status === "offline" ? (
      <div className="space-y-2">
        <Button
          onClick={handleStartBackend}
          disabled={isStarting}
          size="sm"
          className="w-full"
          variant="outline"
        >
          {isStarting ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-2" />
              Start backend
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Or run <code className="px-1 py-0.5 bg-muted rounded text-xs">npm run dev:all</code> in terminal
        </p>
      </div>
    ) : null;

  const StopControls =
    status === "online" ? (
      <div className="space-y-2">
        <Button
          onClick={handleStopBackend}
          disabled={isStarting}
          size="sm"
          className="w-full"
          variant="outline"
        >
          {isStarting ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Stopping...
            </>
          ) : (
            <>
              <Square className="h-3 w-3 mr-2" />
              Stop backend
            </>
          )}
        </Button>
      </div>
    ) : null;

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
          {status === "offline" ? (
            <Button
              onClick={handleStartBackend}
              disabled={isStarting}
              size="sm"
              variant="outline"
              className="shrink-0"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-2" />
                  Start
                </>
              )}
            </Button>
          ) : status === "online" ? (
            <Button
              onClick={handleStopBackend}
              disabled={isStarting}
              size="sm"
              variant="outline"
              className="shrink-0"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="h-3 w-3 mr-2" />
                  Stop
                </>
              )}
            </Button>
          ) : null}
        </div>
        {status === "offline" ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Needed before Sign in/Register. If the button fails, use{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-xs">npm run dev:all</code>.
          </p>
        ) : null}
        {status === "online" ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Backend started from this UI can be stopped here.
          </p>
        ) : null}
        {actionError ? (
          <p className="mt-2 text-xs text-destructive">{actionError}</p>
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
        {StartControls}
        {StopControls}
        {actionError ? <p className="text-xs text-destructive">{actionError}</p> : null}
      </CardContent>
    </Card>
  );
}
