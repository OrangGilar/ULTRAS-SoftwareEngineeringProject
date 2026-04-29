import React from 'react';
import { Coins, ChevronRight } from 'lucide-react';

interface Props {
  navigate: (view: string) => void;
}

export const MainPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white pb-24">
      {/* Red Header */}
      <div className="bg-red-600 pt-12 pb-4 px-6 rounded-b-3xl shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-widest">ULTRAS</h1>
        <button onClick={() => navigate('account')} className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white overflow-hidden text-slate-800 flex items-center justify-center font-bold text-xs">
          Pic
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Points Banner (Purple) */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 p-2 rounded-full">
              <Coins className="text-yellow-900" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-100">Your Points</p>
              <p className="text-xl font-bold">1,250 Pts</p>
            </div>
          </div>
          <ChevronRight className="text-purple-200" />
        </div>

        {/* Live Match Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mt-2">
            <div className="text-center w-1/3">
              <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-2 border border-slate-700 flex items-center justify-center font-bold text-slate-900 text-xs">CLUB</div>
            </div>
            <div className="text-center w-1/3">
              <p className="text-3xl font-black text-fuchsia-500">2 - 1</p>
            </div>
            <div className="text-center w-1/3">
              <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-2 border border-slate-700 flex items-center justify-center font-bold text-slate-900 text-xs">CLUB</div>
            </div>
          </div>
          <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-blue-400 py-3 rounded-xl font-semibold text-sm transition border border-slate-700">
            Make Your Predictions
          </button>
        </div>

        {/* Verified Merchandise */}
        <div>
          <h2 className="text-sm font-bold mb-3 px-1 text-slate-400 uppercase tracking-wider">Verified Merchandise</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 px-1">
            {[1, 2, 3].map((item) => (
              <div key={item} onClick={() => navigate('shop')} className="min-w-[120px] bg-red-600 rounded-t-2xl rounded-b-lg p-2 h-32 flex flex-col justify-end shadow-md cursor-pointer">
                <div className="w-full h-16 bg-white/20 rounded-lg mb-2"></div>
                <p className="font-bold text-xs text-white text-center">Merch {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};