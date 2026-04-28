"use client";

// Login-Seite

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFehler("");
    setLaedt(true);

    try {
      const ergebnis = await signIn("credentials", {
        email,
        password: passwort,
        redirect: false,
      });

      if (ergebnis?.error) {
        setFehler("Ungültige E-Mail oder Passwort");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setFehler("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">🏗️ BauPreis</Link>
          <p className="text-gray-500 text-sm mt-1">Preisvergleich im Rhein-Neckar-Kreis</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Anmelden</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@beispiel.de"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <input
                type="password"
                value={passwort}
                onChange={(e) => setPasswort(e.target.value)}
                required
                placeholder="Dein Passwort"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {fehler && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-600">
                {fehler}
              </div>
            )}

            <button
              type="submit"
              disabled={laedt}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {laedt ? "Wird angemeldet..." : "Anmelden"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Noch kein Konto?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
