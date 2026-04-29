import React from 'react';
import { Coins } from 'lucide-react';
import { Order } from '../types';

interface Props {
  navigate: (view: string) => void;
}

export const AccountPage: React.FC<Props> = ({ navigate }) => {
  const dummyOrders: Order[] = [
    { id: '#ORD-E-2026', productName: 'Home Jersey 2026', status: 'Shipped', imageUrl: '' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 pt-10 px-4">
      
      {/* Profile Card */}
      <div className="bg-red-600 rounded-3xl p-5 mb-6 shadow-lg flex items-center space-x-4">
        <div className="w-20 h-20 bg-fuchsia-400 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-center leading-tight border-2 border-white">
          Profile<br/>Picture
        </div>
        <div className="flex flex-col flex-grow space-y-2">
          <div className="text-white font-bold text-lg">Muhammad Fairuz Dzaki</div>
          <div className="bg-fuchsia-600 rounded-full py-1 px-3 flex items-center space-x-2 w-max">
             <Coins className="text-yellow-400" size={16} />
             <span className="text-xs font-bold text-white">Points Value</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => navigate('cart')} className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-3xl py-4 font-bold shadow-md transition">
          My Cart
        </button>
        <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-3xl py-4 font-bold shadow-md transition">
          My Predictions
        </button>
      </div>

      {/* Orders List */}
      <div>
        <div className="bg-red-600 text-white rounded-full px-4 py-1.5 text-xs font-bold inline-block mb-4 shadow-sm">
          My Orders
        </div>
        
        <div className="space-y-4">
          {dummyOrders.map(order => (
            <div key={order.id} className="bg-red-600 rounded-3xl p-3 flex space-x-3 items-center shadow-md">
              <div className="bg-white rounded-2xl w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <span className="text-slate-400 text-xs font-bold">Picture</span>
              </div>
              <div className="flex-grow flex flex-col justify-center space-y-2">
                <div className="bg-white text-slate-900 rounded-full py-1.5 px-3 text-center text-xs font-bold w-full">
                  Description / {order.productName}
                </div>
                <div className="bg-white text-slate-900 rounded-full py-1.5 px-3 text-center text-xs font-bold w-2/3 self-end">
                  {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};