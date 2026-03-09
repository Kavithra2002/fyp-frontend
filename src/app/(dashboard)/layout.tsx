import { AppSidebar } from "@/components/Common/AppSidebar";
import { AppHeader } from "@/components/Common/AppHeader";
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
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
