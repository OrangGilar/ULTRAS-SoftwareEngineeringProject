import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  navigate: (view: string) => void;
}

export const ProductPage: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 pt-8 px-4 flex flex-col">
      {/* Back Button */}
      <button onClick={() => navigate('shop')} className="bg-white text-slate-900 px-4 py-1.5 rounded-full font-bold text-sm self-start mb-6 flex items-center space-x-1">
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Main Product Image Container */}
      <div className="bg-red-600 rounded-[2rem] p-4 mb-6 shadow-xl">
        <div className="bg-white rounded-[1.5rem] w-full aspect-[4/3] flex items-center justify-center">
           <span className="text-slate-800 font-bold text-xl">Product Picture</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4 flex-grow">
        <div className="bg-white text-slate-900 text-center py-3 rounded-full font-bold">
          Product Name
        </div>
        <div className="bg-white text-slate-900 text-center py-3 rounded-full font-bold w-1/2">
          Product Price
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-8">
        <button onClick={() => navigate('cart')} className="flex-1 bg-white text-slate-900 py-4 rounded-full font-black uppercase tracking-wider hover:bg-slate-200 transition">
          Buy Now
        </button>
        <button onClick={() => navigate('cart')} className="flex-1 bg-white text-slate-900 py-4 rounded-full font-black uppercase tracking-wider hover:bg-slate-200 transition">
          Add to cart
        </button>
      </div>
    </div>
  );
};