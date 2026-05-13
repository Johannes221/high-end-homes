"use client";

// Navbar mit Logo, Navigation und User-Dropdown

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LogOut, Settings } from "lucide-react";

interface NavbarProps {
  userName: string | null | undefined;
  userEmail: string | null | undefined;
}

const NAV_LINKS = [
  { href: "/intern", label: "Dashboard" },
  { href: "/intern/quotes", label: "Anfragen" },
  { href: "/intern/settings", label: "Einstellungen" },
];

function UserInitialen(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }
  return (email?.[0] || "U").toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-cyan-600",
  "bg-orange-600",
  "bg-teal-600",
];

function avatarColor(seed: string | null | undefined): string {
  if (!seed) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOffen, setMobileOffen] = useState(false);
  const [dropdownOffen, setDropdownOffen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/intern/login" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/intern" className="flex items-center">
            <Image
              src="/logo-intern.png"
              alt="High-End Homes"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Dropdown (Desktop) */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setDropdownOffen(!dropdownOffen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full ${avatarColor(userEmail)} text-white text-sm font-medium flex items-center justify-center`}>
                {UserInitialen(userName, userEmail)}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {dropdownOffen && (
              <>
                <div className="fixed inset-0" onClick={() => setDropdownOffen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{userName || "Benutzer"}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <Link
                    href="/intern/settings"
                    onClick={() => setDropdownOffen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Einstellungen
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Abmelden
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOffen(!mobileOffen)}
          >
            {mobileOffen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menü */}
      {mobileOffen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
            <div className={`w-9 h-9 rounded-full ${avatarColor(userEmail)} text-white text-sm font-medium flex items-center justify-center`}>
              {UserInitialen(userName, userEmail)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userName || "Benutzer"}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOffen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium mb-1 transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 mt-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Abmelden
          </button>
        </div>
      )}
    </nav>
  );
}
