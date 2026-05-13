import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm, PasswordForm } from "@/components/settings-forms";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/intern/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  if (!user) redirect("/intern/login");

  const memberSince = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Einstellungen</h1>
        <p className="text-gray-500 text-sm">Konto seit {memberSince}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <ProfileForm initialName={user.name ?? ""} initialEmail={user.email} />
        <PasswordForm />
      </div>
    </div>
  );
}
