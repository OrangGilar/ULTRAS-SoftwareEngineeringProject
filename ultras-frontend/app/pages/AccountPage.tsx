"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, LogOut, MapPin, Sparkles } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { RequireAuth } from "../components/RequireAuth";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import type { ApiError } from "../types";

const TIER_COLORS: Record<string, string> = {
  ROOKIE: "bg-slate-600",
  FAN: "bg-blue-600",
  ULTRAS: "bg-fuchsia-600",
  LEGEND: "bg-yellow-500 text-yellow-900",
};

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountPageInner />
    </RequireAuth>
  );
}

function AccountPageInner() {
  const { user, logout, refreshProfile } = useAuth();
  const router = useRouter();
  const [editingCity, setEditingCity] = useState(false);
  const [city, setCity] = useState(user?.city ?? "");
  const [savingCity, setSavingCity] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  if (!user) return null;

  async function saveCity() {
    setSavingCity(true);
    setCityError(null);
    try {
      await apiFetch(`/api/users/me/city?city=${encodeURIComponent(city)}`, {
        method: "PATCH",
      });
      await refreshProfile();
      setEditingCity(false);
    } catch (err) {
      setCityError((err as ApiError)?.message ?? "Couldn't save city");
    } finally {
      setSavingCity(false);
    }
  }

  function onLogout() {
    logout();
    router.replace("/login");
  }

  const tierClass = TIER_COLORS[user.tier] ?? "bg-slate-600";
  const initial = user.username[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageHeader />

      <div className="px-4 pt-6 pb-24 space-y-6">
        {/* Profile card */}
        <div className="bg-red-600 rounded-3xl p-5 shadow-lg flex items-center space-x-4">
          <div className="w-20 h-20 bg-fuchsia-400 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-3xl border-2 border-white">
            {initial}
          </div>
          <div className="flex flex-col flex-grow space-y-2 min-w-0">
            <div className="text-white font-bold text-lg truncate">{user.username}</div>
            <div className={`${tierClass} rounded-full py-1 px-3 flex items-center space-x-2 w-max`}>
              <Coins className="text-yellow-300" size={16} />
              <span className="text-xs font-bold text-white">
                {user.tier} · {user.xpTotal.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* City */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-bold">
              <MapPin size={14} />
              <span>City</span>
            </div>
            {!editingCity && (
              <button
                onClick={() => {
                  setCity(user.city ?? "");
                  setEditingCity(true);
                }}
                className="text-fuchsia-400 hover:text-fuchsia-300 text-xs font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          {editingCity ? (
            <div className="space-y-2">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jakarta"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {cityError && <p className="text-xs text-red-400">{cityError}</p>}
              <div className="flex space-x-2">
                <button
                  onClick={saveCity}
                  disabled={savingCity}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  {savingCity ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setEditingCity(false)}
                  className="bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white">{user.city || <span className="text-slate-500 italic">Not set</span>}</p>
          )}
        </div>

        {/* Equipped cosmetics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Sparkles size={14} />
            <span>Equipped cosmetics</span>
          </div>
          {user.equippedCosmetics.length === 0 ? (
            <p className="text-slate-500 text-sm italic">
              Nothing equipped yet — visit the cosmetics shop.
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-300">
              {user.equippedCosmetics.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span className="truncate">{c.cosmeticId}</span>
                  <span className="text-fuchsia-400 text-xs">EQUIPPED</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-red-400 rounded-2xl py-3 font-bold flex items-center justify-center space-x-2"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}