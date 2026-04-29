"use client";

// Internes Login – nur für Mitarbeiter

import { useState, FormEvent, useEffect } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function InternLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // CSRF-Token laden
  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFehler("");
    setLaedt(true);

    try {
      console.log("Versuche Login mit:", email);
      const ergebnis = await signIn("credentials", {
        email,
        password: passwort,
        csrfToken,
        redirect: false,
      });

      console.log("Login Ergebnis:", ergebnis);

      if (ergebnis?.error) {
        console.error("Login Fehler:", ergebnis.error);
        setFehler("Ungültige E-Mail oder Passwort");
      } else {
        console.log("Login erfolgreich, leite weiter");
        router.push("/intern");
        router.refresh();
      }
    } catch (error) {
      console.error("Login Exception:", error);
      setFehler("Anmeldung fehlgeschlagen.");
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-amber-600 uppercase tracking-widest font-semibold mb-2">Intern</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">High-End Homes</h1>
            <p className="text-sm text-gray-500">Internes Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="deine@email.de"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passwort</label>
              <input
                type="password"
                value={passwort}
                onChange={(e) => setPasswort(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {fehler && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{fehler}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={laedt}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {laedt ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Anmelden...
                </span>
              ) : (
                "Anmelden"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Nur für autorisierte Mitarbeiter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
