import { AppSidebar } from "@/components/Common/AppSidebar";
import { AuthGuard } from "@/components/Common/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </AuthGuard>
  );
}
