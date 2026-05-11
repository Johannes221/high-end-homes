// Dashboard Layout mit Navbar
// Auth wird bereits durch middleware.ts geprüft - keine server-side auth() Prüfung hier nötig

import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session mit Timeout laden für Navbar, um Hänger zu vermeiden
  let session: any = null;
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("auth timeout")), 2000)
    );
    session = await Promise.race([auth(), timeoutPromise]);
  } catch (error) {
    console.error("Auth timeout oder Fehler im Layout:", error);
    session = null;
  }

  // Wenn keine Session, nichts anzeigen (middleware sollte bereits weitergeleitet haben)
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Session wird geladen...</p>
          <p className="text-sm text-gray-400">Wenn das Problem besteht, bitte Seite neu laden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={session.user.name || ""}
        userEmail={session.user.email || ""}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
