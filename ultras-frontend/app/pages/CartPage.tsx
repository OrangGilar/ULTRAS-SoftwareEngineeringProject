import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  navigate: (view: string) => void;
}

export const CartPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-safe pt-8 px-4 flex flex-col">
      {/* Back Button */}
      <button onClick={() => navigate('product')} className="bg-white text-slate-900 px-4 py-1.5 rounded-full font-bold text-sm self-start mb-6 flex items-center space-x-1">
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Cart Items List */}
      <div className="flex-grow space-y-4 overflow-y-auto pb-32">
        {[1, 2].map((item) => (
          <div key={item} className="bg-red-600 rounded-3xl p-3 flex space-x-3 items-center">
            <div className="bg-white rounded-2xl w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <span className="text-slate-400 text-xs font-bold">Picture</span>
            </div>
            <div className="flex-grow flex flex-col h-24 justify-between py-1">
              <div className="bg-white text-slate-900 rounded-full py-1.5 px-3 text-center text-xs font-bold w-full">
                Description
              </div>
              <div className="bg-white text-slate-900 rounded-full py-1.5 px-3 text-center text-xs font-bold w-2/3 self-end">
                Price
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Section (Fixed above BottomNav) */}
      <div className="fixed bottom-20 left-0 w-full max-w-md px-4">
        <div className="bg-red-600 rounded-3xl p-3 flex space-x-3 items-center shadow-lg shadow-red-900/50">
           <div className="bg-white text-slate-900 rounded-2xl w-1/3 py-3 text-center text-sm font-bold">
             Total Price
           </div>
           <button className="bg-white text-slate-900 rounded-2xl w-2/3 py-3 text-center text-sm font-black uppercase hover:bg-slate-200 transition">
             Proceed To Checkout
           </button>
        </div>
      </div>
    </div>
  );
};