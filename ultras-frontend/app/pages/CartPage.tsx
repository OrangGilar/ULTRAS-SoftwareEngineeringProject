"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CartPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-8 pb-32 px-4 flex flex-col">
      <button
        onClick={() => router.back()}
        className="bg-white text-slate-900 px-4 py-1.5 rounded-full font-bold text-sm self-start mb-6 flex items-center space-x-1"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="space-y-3 flex-grow">
        {[1, 2].map((i) => (
          <div key={i} className="bg-red-600 rounded-2xl p-3 flex space-x-3 items-center">
            <div className="bg-white rounded-xl w-20 h-20 flex-shrink-0 flex items-center justify-center text-slate-400 text-xs font-bold">
              Item
            </div>
            <div className="flex-grow space-y-2">
              <div className="bg-white text-slate-900 rounded-full py-1.5 px-3 text-xs font-bold text-center">
                Item {i}
              </div>
              <div className="bg-white text-slate-900 rounded-full py-1.5 px-3 text-xs font-bold text-center w-2/3 ml-auto">
                Rp 0
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <div className="bg-red-600 rounded-2xl p-3 flex space-x-3 items-center shadow-lg shadow-red-900/50">
          <div className="bg-white text-slate-900 rounded-xl w-1/3 py-3 text-center text-sm font-bold">
            Total
          </div>
          <button className="bg-white text-slate-900 rounded-xl w-2/3 py-3 text-sm font-black uppercase hover:bg-slate-200 transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}