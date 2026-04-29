import React, { useState } from 'react';
import { Product } from '../types';

interface Props {
  navigate: (view: string) => void;
}

export const ShopPage: React.FC<Props> = ({ navigate }) => {
  const [filter, setFilter] = useState<string>('All');
  
  const dummyProducts: Product[] = [
    { id: '1', name: 'Home Jersey 2026', price: 350000, category: 'Jerseys', imageUrl: '/api/placeholder/150/150' },
    { id: '2', name: 'Ultras Scarf', price: 85000, category: 'Accessories', imageUrl: '/api/placeholder/150/150' },
    { id: '3', name: 'Away Jersey 2026', price: 350000, category: 'Jerseys', imageUrl: '/api/placeholder/150/150' },
    { id: '4', name: 'Matchday Cap', price: 120000, category: 'Accessories', imageUrl: '/api/placeholder/150/150' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 pt-10 px-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search Bar" 
          className="w-full bg-white text-slate-900 rounded-full py-3 px-6 text-center font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
        {['All', 'Jerseys', 'Accessories'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === cat ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-600 border border-red-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-6">
        {dummyProducts
          .filter(p => filter === 'All' || p.category === filter)
          .map(product => (
          <div key={product.id} onClick={() => navigate('product')} className="bg-red-600 rounded-3xl p-4 flex flex-col items-center cursor-pointer hover:bg-red-500 transition shadow-lg shadow-red-900/20">
            <div className="bg-white rounded-2xl w-full aspect-square mb-4 flex items-center justify-center p-2">
               <span className="text-slate-400 font-bold">Catalog</span>
            </div>
            <h3 className="font-bold text-sm text-center text-white mb-1 truncate w-full">{product.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};