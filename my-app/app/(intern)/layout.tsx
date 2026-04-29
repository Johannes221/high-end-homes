// Dashboard Layout mit Navbar

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/intern/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={session.user.name}
        userEmail={session.user.email}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
