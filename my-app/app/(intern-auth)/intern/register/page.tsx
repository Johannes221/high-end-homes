"use client";

// Interner Account anlegen – nur für Mitarbeiter

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function InternRegisterPage() {
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

      await signIn("credentials", { email, password: passwort, redirect: false });
      router.push("/intern");
    } catch {
      setFehler("Registrierung fehlgeschlagen.");
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Intern</p>
          <h1 className="text-xl font-semibold text-gray-900">Account anlegen</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Passwort</label>
            <input
              type="password"
              value={passwort}
              onChange={(e) => setPasswort(e.target.value)}
              required
              placeholder="Mindestens 8 Zeichen"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Passwort wiederholen</label>
            <input
              type="password"
              value={passwortWdh}
              onChange={(e) => setPasswortWdh(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500"
            />
          </div>

          {fehler && <p className="text-sm text-red-600">{fehler}</p>}

          <button
            type="submit"
            disabled={laedt}
            className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {laedt ? "..." : "Account erstellen"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-5">
          <Link href="/intern/login" className="hover:text-gray-700 underline">
            Zurück zum Login
          </Link>
        </p>
      </div>
    </div>
  );
}
