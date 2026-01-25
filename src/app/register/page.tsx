"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, UserPlus, AlertCircle } from "lucide-react";
import { authApi, setAuthToken } from "@/services/api";
import { BackendStatus, type BackendConnectionStatus } from "@/components/Common/BackendStatus";

const ERROR_DURATION_MS = 3000;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendConnectionStatus>("checking");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backendOnline = backendStatus === "online";

  useEffect(() => {
    if (!error) return;
    timerRef.current = setTimeout(() => setError(null), ERROR_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [error]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!backendOnline) {
      setError("Backend is offline. Start it first, then register.");
      return;
    }
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim();

    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { token } = await authApi.register({ email, password, name: name || undefined });
      setAuthToken(token);
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />
      <Card className="relative w-full max-w-sm border-border/50 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BarChart3 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Register to use the Forecast & XAI dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <BackendStatus variant="inline" onStatusChange={setBackendStatus} />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className="h-10"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                className="h-10"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••• (min 6 characters)"
                autoComplete="new-password"
                className="h-10"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full h-10" size="lg" disabled={loading || !backendOnline}>
              <UserPlus className="mr-2 h-4 w-4" />
              {!backendOnline ? "Start backend to register" : loading ? "Creating account…" : "Register"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            {backendOnline ? (
              <Link href="/login" className="underline hover:text-foreground">
                Sign in
              </Link>
            ) : (
              <span className="opacity-60">Sign in</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
