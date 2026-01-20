import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { LaneStatus } from '../types';

export const History: React.FC = () => {
  const dummyHistory = [
    { id: 1, time: '2025-11-20 10:30', lane: 'Gate In 02', container: 'TGBU3719401', truck: '51L-88941', status: LaneStatus.Waiting },
    { id: 2, time: '2025-11-20 10:28', lane: 'Gate Out 02', container: 'PONU987654', truck: '30C-57145', status: LaneStatus.Success },
    { id: 3, time: '2025-11-20 10:15', lane: 'Gate Out 01', container: 'MSKU123456', truck: '30C-42421', status: LaneStatus.Failed },
    { id: 4, time: '2025-11-20 09:55', lane: 'Gate In 01', container: 'MAEU223344', truck: '29C-11223', status: LaneStatus.Success },
    { id: 5, time: '2025-11-20 09:40', lane: 'Gate In 03', container: 'OOLU887766', truck: '51D-99881', status: LaneStatus.Success },
  ];

  const getStatusColor = (status: LaneStatus) => {
    switch (status) {
        case LaneStatus.Success: return 'bg-emerald-100 text-emerald-700';
        case LaneStatus.Failed: return 'bg-rose-100 text-rose-700';
        case LaneStatus.Waiting: return 'bg-amber-100 text-amber-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-2xl font-bold text-slate-900">Transaction History</h2>
            <p className="text-slate-500">Search and review past gate transactions</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Container No, Truck Plate, or Session ID" 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2c92d5] focus:outline-none bg-white text-slate-900"
                    />
                </div>
            </div>
            <div className="w-full md:w-48 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Date Range</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="date" 
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2c92d5] focus:outline-none text-sm bg-white text-slate-900"
                    />
                </div>
            </div>
             <div className="w-full md:w-40 space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                 <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select className="w-full pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2c92d5] focus:outline-none appearance-none text-sm bg-white text-slate-900">
                        <option>All Status</option>
                        <option>Success</option>
                        <option>Failed</option>
                        <option>Waiting</option>
                    </select>
                </div>
            </div>
            <button className="px-6 py-2.5 bg-[#2c92d5] hover:bg-[#237ab3] text-white font-bold rounded-lg transition-colors shadow-sm">
                Load Data
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Time</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Lane</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Container No.</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Truck Plate</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {dummyHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 text-sm text-slate-600">{item.time}</td>
                            <td className="py-4 px-6 text-sm font-medium text-slate-800">{item.lane}</td>
                            <td className="py-4 px-6 text-sm font-mono font-semibold text-[#2c92d5]">{item.container}</td>
                            <td className="py-4 px-6 text-sm font-mono text-slate-800">{item.truck}</td>
                            <td className="py-4 px-6">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <button className="text-[#2c92d5] hover:text-[#237ab3] text-sm font-semibold">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};