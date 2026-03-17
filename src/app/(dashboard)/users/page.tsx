"use client";

import { useEffect, useMemo, useState } from "react";
import { authApi, type AppUser } from "@/services/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as ConfirmDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FormState = {
  id?: string;
  email: string;
  name: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  password: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    role: "user",
    status: "active",
    password: "",
  });

  const isEdit = !!form.id;

  const isFormValid = useMemo(() => {
    const hasBasic =
      form.email.trim().length > 0 &&
      form.name.trim().length > 0 &&
      (form.role === "admin" || form.role === "user") &&
      (form.status === "active" || form.status === "inactive");
    if (!hasBasic) return false;
    // Password always required and must be at least 6 characters
    return form.password.trim().length >= 6;
  }, [form]);

  const emailError = submitAttempted && !form.email.trim();
  const nameError = submitAttempted && !form.name.trim();
  const passwordError = submitAttempted && form.password.trim().length < 6;

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.listUsers();
      setUsers(res.users ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load users";
      if (msg.includes("403") || msg.toLowerCase().includes("forbidden")) {
        setForbidden(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const { adminCount, normalUserCount } = useMemo(() => {
    let admins = 0;
    let normals = 0;
    for (const u of users) {
      if ((u.role ?? "user") === "admin") admins += 1;
      else normals += 1;
    }
    return { adminCount: admins, normalUserCount: normals };
  }, [users]);

  function openCreate() {
    setForm({
      email: "",
      name: "",
      role: "user",
      status: "active",
      password: "",
    });
    setDialogOpen(true);
  }

  function openEdit(user: AppUser) {
    setForm({
      id: user.id,
      email: user.email,
      name: user.name ?? "",
      role: (user.role as "admin" | "user") ?? "user",
      status: (user.status as "active" | "inactive") ?? "active",
      password: "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!isFormValid) return;
    setSaving(true);
    setError(null);
    try {
      if (isEdit && form.id) {
        const body: Partial<FormState> = {
          email: form.email,
          name: form.name,
          role: form.role,
          status: form.status,
        };
        if (form.password.trim()) {
          body.password = form.password.trim();
        }
        await authApi.updateUser(form.id, body);
      } else {
        await authApi.createUser({
          email: form.email,
          name: form.name,
          role: form.role,
          status: form.status,
          password: form.password.trim(),
        });
      }
      setDialogOpen(false);
      await loadUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  }

  if (forbidden) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="max-w-xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Admins only</AlertTitle>
          <AlertDescription>
            You are signed in as a normal user. Only admin accounts can view and manage the user list.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-muted-foreground">
            View existing users and create or edit admin and normal user accounts.
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add user
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Current users</CardTitle>
            <CardDescription>
              {loading
                ? "Loading users…"
                : `${normalUserCount} User${normalUserCount === 1 ? "" : "s"} – ${adminCount} Admin${adminCount === 1 ? "" : "s"}`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Problem</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => {
                    const isInactive = u.status === "inactive";
                    return (
                      <TableRow
                        key={u.id}
                        className={cn(isInactive && "bg-red-950/30 dark:bg-red-900/20")}
                      >
                        <TableCell className="font-mono text-xs md:text-sm">
                          {u.email}
                        </TableCell>
                        <TableCell className={cn(isInactive && "text-red-500")}>
                          {u.name || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.role === "admin" ? "default" : "outline"}
                            className={cn(isInactive && "border-red-500 text-red-500")}
                          >
                            {u.role === "admin" ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isInactive ? "outline" : "secondary"}
                            className={cn(
                              isInactive
                                ? "border-red-500 text-red-500"
                                : "border-none"
                            )}
                          >
                            {isInactive ? "Inactive" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => openEdit(u)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
            <DialogDescription>
              Password is required and must be at least 6 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                disabled={saving}
                className={cn(emailError && "border-destructive focus-visible:ring-destructive")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                disabled={saving}
                className={cn(nameError && "border-destructive focus-visible:ring-destructive")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, role: v as "admin" | "user" }))
                  }
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as "active" | "inactive" }))
                  }
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                disabled={saving}
                className={cn(
                  passwordError && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            {isFormValid ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    disabled={saving}
                    onClick={() => setSubmitAttempted(true)}
                  >
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isEdit ? "Confirm update" : "Confirm new user"}
                    </AlertDialogTitle>
                    <ConfirmDescription>
                      {isEdit
                        ? "Do you want to update this user with the entered details?"
                        : "Do you want to create this new user with the entered details?"}
                    </ConfirmDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(event) => {
                        event.preventDefault();
                        void handleSave();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                type="button"
                onClick={() => setSubmitAttempted(true)}
                disabled={saving}
              >
                Save
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

