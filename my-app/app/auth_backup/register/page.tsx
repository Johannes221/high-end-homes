"use client";

// Registrierungsseite

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [passwortWdh, setPasswortWdh] = useState("");
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFehler("");

    if (passwort !== passwortWdh) {
      setFehler("Passwörter stimmen nicht überein");
      return;
    }

    if (passwort.length < 8) {
      setFehler("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    setLaedt(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: passwort }),
      });

      const data = await res.json() as { fehler?: string };

      if (!res.ok) {
        setFehler(data.fehler || "Registrierung fehlgeschlagen");
        return;
      }

      // Automatisch einloggen nach Registrierung
      await signIn("credentials", {
        email,
        password: passwort,
        redirect: false,
      });

      router.push("/dashboard");
    } catch {
      setFehler("Registrierung fehlgeschlagen. Bitte versuche es erneut.");
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
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Konto erstellen</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                placeholder="Mindestens 8 Zeichen"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort wiederholen</label>
              <input
                type="password"
                value={passwortWdh}
                onChange={(e) => setPasswortWdh(e.target.value)}
                required
                placeholder="Passwort bestätigen"
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
              {laedt ? "Wird registriert..." : "Konto erstellen"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Bereits registriert?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
