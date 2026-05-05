"use client";

import { Users } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PageHeader />
      <div className="px-4 pt-10 pb-24 flex flex-col items-center text-center">
        <div className="bg-fuchsia-600/20 rounded-full p-5 mb-4">
          <Users className="text-fuchsia-400" size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Community</h2>
        <p className="text-slate-400 text-sm max-w-xs">
          The community feed is coming soon. Earn 10 XP per post once it ships.
        </p>
      </div>
    </div>
  );
}
