// Dashboard Layout mit Navbar
// Auth wird bereits durch middleware.ts geprüft - hier laden wir die Session für UI-Zwecke

import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={session?.user?.name ?? null} userEmail={session?.user?.email ?? null} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
