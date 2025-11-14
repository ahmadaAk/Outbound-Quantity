
import React from 'react';
import type { PickingItem } from '../types.ts';
import { ArrowRightIcon, PrinterIcon } from './icons.tsx';

interface PickingListProps {
  pickingList: PickingItem[];
  onBack: () => void;
}

const PickingList: React.FC<PickingListProps> = ({ pickingList, onBack }) => {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 print:hidden">
          <div>
            <h2 className="text-3xl font-bold text-slate-100">قائمة الانتقاء</h2>
            <p className="text-slate-400 mt-1">مرتبة حسب الكمية الأقل أولاً لتسريع العملية.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <PrinterIcon />
              <span>طباعة</span>
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <span>العودة للطلبات</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-slate-300">
              <thead className="text-xs text-cyan-400 uppercase bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3">المنتج</th>
                  <th scope="col" className="px-6 py-3 text-center">الكمية</th>
                  <th scope="col" className="px-6 py-3">الموقع</th>
                  <th scope="col" className="px-6 py-3">رقم الطلب</th>
                </tr>
              </thead>
              <tbody>
                {pickingList.map((item, index) => (
                  <tr key={`${item.id}-${item.orderId}-${index}`} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      {item.name}
                    </th>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-cyan-300">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4">{item.location}</td>
                    <td className="px-6 py-4 text-slate-400">{item.orderId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickingList;