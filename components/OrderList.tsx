
import React from 'react';
import type { Order } from '../types';
import { CubeIcon, LocationMarkerIcon } from './icons';

interface OrderListProps {
  orders: Order[];
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
    <div className="p-4 bg-slate-800 border-b border-slate-700">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-cyan-400">رقم الطلب: {order.id}</h3>
        <p className="text-sm text-slate-400">{order.customerName}</p>
      </div>
    </div>
    <div className="p-4">
      <h4 className="text-md font-semibold text-slate-300 mb-3">الأصناف:</h4>
      <ul className="space-y-3">
        {order.items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <CubeIcon className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-medium text-slate-200">{item.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <LocationMarkerIcon className="w-4 h-4" />
                    <span>{item.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
                <span className="text-lg font-bold text-white bg-cyan-600/20 border border-cyan-500/30 rounded-full px-3 py-1">
                    {item.quantity}
                </span>
                <p className="text-xs text-slate-500 mt-1">الكمية</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-100">الطلبات المعلقة</h2>
      <p className="text-center text-slate-400 mb-8">قائمة بجميع الطلبات التي تنتظر التحضير.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
