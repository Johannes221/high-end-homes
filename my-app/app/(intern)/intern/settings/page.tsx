"use client";

// Einstellungen-Seite

import { useEffect, useState, FormEvent } from "react";
import { signOut } from "next-auth/react";
import { Bell, Lock, Trash2, User } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface UserDaten {
  id: string;
  name: string | null;
  email: string;
  emailAlerts: boolean;
}

interface AktivAlarm {
  id: string;
  targetPreis: number;
  favorite: { productName: string; baumarkt: string };
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserDaten | null>(null);
  const [alarme, setAlarme] = useState<AktivAlarm[]>([]);
  const [laedt, setLaedt] = useState(true);

  // Profilfelder
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilMeldung, setProfilMeldung] = useState("");

  // Passwort
  const [altesPasswort, setAltesPasswort] = useState("");
  const [neuesPasswort, setNeuesPasswort] = useState("");
  const [passwortMeldung, setPasswortMeldung] = useState("");

  // Konto löschen
  const [zeigLoeschDialog, setZeigLoeschDialog] = useState(false);

  const laden = async () => {
    try {
      const [userRes, alarmeRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/alerts"),
      ]);

      const userData = await userRes.json() as { user?: UserDaten };
      const alarmeData = await alarmeRes.json() as { alarme?: AktivAlarm[] };

      if (userData.user) {
        setUser(userData.user);
        setName(userData.user.name || "");
        setEmail(userData.user.email);
      }
      setAlarme(alarmeData.alarme || []);
    } catch {
      // Fehler still ignorieren
    } finally {
      setLaedt(false);
    }
  };

  useEffect(() => {
    laden();
  }, []);

  const handleProfilSpeichern = async (e: FormEvent) => {
    e.preventDefault();
    setProfilMeldung("");

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json() as { user?: UserDaten; fehler?: string };

      if (!res.ok) {
        setProfilMeldung(`Fehler: ${data.fehler}`);
      } else {
        setUser(data.user || null);
        setProfilMeldung("✓ Profil gespeichert");
        setTimeout(() => setProfilMeldung(""), 3000);
      }
    } catch {
      setProfilMeldung("Fehler beim Speichern");
    }
  };

  const handleEmailAlerts = async (aktiv: boolean) => {
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAlerts: aktiv }),
      });

      setUser((prev) => prev ? { ...prev, emailAlerts: aktiv } : null);
    } catch {
      alert("Fehler beim Speichern");
    }
  };

  const handlePasswortAendern = async (e: FormEvent) => {
    e.preventDefault();
    setPasswortMeldung("");

    if (neuesPasswort.length < 8) {
      setPasswortMeldung("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altesPasswort, neuesPasswort }),
      });

      const data = await res.json() as { fehler?: string };

      if (!res.ok) {
        setPasswortMeldung(`Fehler: ${data.fehler}`);
      } else {
        setAltesPasswort("");
        setNeuesPasswort("");
        setPasswortMeldung("✓ Passwort geändert");
        setTimeout(() => setPasswortMeldung(""), 3000);
      }
    } catch {
      setPasswortMeldung("Fehler beim Ändern");
    }
  };

  const handleAlarmDeaktivieren = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}`, { method: "DELETE" });
      setAlarme((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Fehler beim Deaktivieren");
    }
  };

  const handleKontoLoeschen = async () => {
    try {
      await fetch("/api/user", { method: "DELETE" });
      await signOut({ callbackUrl: "/" });
    } catch {
      alert("Fehler beim Löschen des Kontos");
    }
  };

  if (laedt) return <LoadingSpinner text="Einstellungen werden geladen..." />;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Einstellungen</h1>
        <p className="text-gray-500 text-sm">Profil, Benachrichtigungen und Konto verwalten</p>
      </div>

      <div className="space-y-6">
        {/* Profil */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Profil</h2>
          </div>

          <form onSubmit={handleProfilSpeichern} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Speichern
              </button>
              {profilMeldung && (
                <span className={`text-sm ${profilMeldung.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                  {profilMeldung}
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Benachrichtigungen */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Benachrichtigungen</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">E-Mail-Alerts aktivieren</p>
              <p className="text-xs text-gray-500 mt-0.5">Erhalte E-Mails wenn Preisalarme ausgelöst werden</p>
            </div>
            <button
              role="switch"
              aria-checked={user?.emailAlerts}
              onClick={() => handleEmailAlerts(!user?.emailAlerts)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user?.emailAlerts ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user?.emailAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Aktive Alarme */}
          {alarme.length > 0 && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-3">Aktive Preisalarme</p>
              <div className="space-y-2">
                {alarme.map((alarm) => (
                  <div key={alarm.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                    <div>
                      <p className="text-sm text-gray-800 truncate max-w-xs">{alarm.favorite.productName}</p>
                      <p className="text-xs text-gray-500">{alarm.favorite.baumarkt} · Ziel: {alarm.targetPreis.toFixed(2)} €</p>
                    </div>
                    <button
                      onClick={() => handleAlarmDeaktivieren(alarm.id)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                    >
                      Deaktivieren
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Passwort ändern */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Passwort ändern</h2>
          </div>

          <form onSubmit={handlePasswortAendern} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aktuelles Passwort</label>
              <input
                type="password"
                value={altesPasswort}
                onChange={(e) => setAltesPasswort(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Neues Passwort</label>
              <input
                type="password"
                value={neuesPasswort}
                onChange={(e) => setNeuesPasswort(e.target.value)}
                required
                placeholder="Mindestens 8 Zeichen"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                Passwort ändern
              </button>
              {passwortMeldung && (
                <span className={`text-sm ${passwortMeldung.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
                  {passwortMeldung}
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Konto löschen */}
        <section className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold text-red-700">Konto löschen</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Diese Aktion löscht dauerhaft dein Konto, alle Favoriten, Suchverlauf und Preisalarme.
          </p>
          <button
            onClick={() => setZeigLoeschDialog(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Konto löschen
          </button>
        </section>
      </div>

      {/* Bestätigungs-Dialog */}
      {zeigLoeschDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Konto wirklich löschen?</h2>
            <p className="text-sm text-gray-500 mb-5">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden unwiderruflich gelöscht.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setZeigLoeschDialog(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleKontoLoeschen}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Ja, löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
