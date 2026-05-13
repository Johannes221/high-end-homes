"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "saving" | "success" | "error";

type Props = {
  initialName: string;
  initialEmail: string;
};

export function ProfileForm({ initialName, initialEmail }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fehler || "Speichern fehlgeschlagen");
      setStatus("success");
      setMessage("Gespeichert.");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Fehler");
    }
  }

  const isClean = name === initialName && email === initialEmail;

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Profil</h2>
        <p className="text-sm text-gray-500">Ihre persönlichen Daten</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            placeholder="Ihr Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            placeholder="name@example.com"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p
          className={`text-sm ${
            status === "success"
              ? "text-green-600"
              : status === "error"
                ? "text-red-600"
                : "text-gray-400"
          }`}
        >
          {message}
        </p>
        <button
          type="submit"
          disabled={status === "saving" || isClean}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {status === "saving" ? "Speichere…" : "Speichern"}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [altesPasswort, setAltes] = useState("");
  const [neuesPasswort, setNeues] = useState("");
  const [bestaetigung, setBest] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (neuesPasswort.length < 8) {
      setStatus("error");
      setMessage("Neues Passwort muss mindestens 8 Zeichen haben.");
      return;
    }
    if (neuesPasswort !== bestaetigung) {
      setStatus("error");
      setMessage("Bestätigung stimmt nicht überein.");
      return;
    }

    setStatus("saving");
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altesPasswort, neuesPasswort }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.fehler || "Passwort ändern fehlgeschlagen");
      setStatus("success");
      setMessage("Passwort geändert.");
      setAltes("");
      setNeues("");
      setBest("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Fehler");
    }
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all";

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Passwort ändern</h2>
        <p className="text-sm text-gray-500">Mindestens 8 Zeichen</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Aktuelles Passwort</label>
          <input
            type="password"
            value={altesPasswort}
            onChange={(e) => setAltes(e.target.value)}
            required
            autoComplete="current-password"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Neues Passwort</label>
          <input
            type="password"
            value={neuesPasswort}
            onChange={(e) => setNeues(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Neues Passwort bestätigen</label>
          <input
            type="password"
            value={bestaetigung}
            onChange={(e) => setBest(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p
          className={`text-sm ${
            status === "success"
              ? "text-green-600"
              : status === "error"
                ? "text-red-600"
                : "text-gray-400"
          }`}
        >
          {message}
        </p>
        <button
          type="submit"
          disabled={status === "saving" || !altesPasswort || !neuesPasswort}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {status === "saving" ? "Ändere…" : "Passwort ändern"}
        </button>
      </div>
    </form>
  );
}
