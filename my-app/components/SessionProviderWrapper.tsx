"use client";

// Wrapper für NextAuth SessionProvider (Client Component)
// Temporär ohne next-auth - einfacher Pass-Through

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
