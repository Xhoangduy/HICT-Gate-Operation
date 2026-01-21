import React, { useState } from 'react';
import { Download, Search, Calendar, Filter, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, RefreshCw, BarChart2, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { LaneStatus } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mock Data for Summary Report
const SUMMARY_DATA = [
    { id: 'total', label: 'TỔNG CỘNG', type: 'total', total: 158393, success: 154027, successRate: 97.24, failed: 4366, failedRate: 2.76 },
    { id: 'inbound_total', label: 'Tổng cổng vào', type: 'subtotal_in', total: 89020, success: 86623, successRate: 97.31, failed: 2397, failedRate: 2.69 },
    { id: 'outbound_total', label: 'Tổng cổng ra', type: 'subtotal_out', total: 69373, success: 67404, successRate: 97.16, failed: 1969, failedRate: 2.84 },
    { id: 'L04', label: 'Cổng ra 1', type: 'lane', total: 34833, success: 33821, successRate: 97.09, failed: 1012, failedRate: 2.91 },
    { id: 'L05', label: 'Cổng ra 2', type: 'lane', total: 34540, success: 33583, successRate: 97.23, failed: 957, failedRate: 2.77 },
    { id: 'L06', label: 'Cổng vào 6', type: 'lane', total: 28125, success: 27352, successRate: 97.25, failed: 773, failedRate: 2.75 },
    { id: 'L07', label: 'Cổng vào 7', type: 'lane', total: 33693, success: 32783, successRate: 97.30, failed: 910, failedRate: 2.70 },
    { id: 'L08', label: 'Cổng vào 8', type: 'lane', total: 27202, success: 26488, successRate: 97.38, failed: 714, failedRate: 2.62 },
];

// Mock Data for Detail Report - Updated to all Failed
const DETAIL_DATA = [
    { id: 1, date: '04/11/2025', time: '21:20:05', lane: 'Cổng vào 6', order: '07ZFGG', container: 'TRHU4505495', truck: '50H29155', trailer: '51R17161', status: 'Failed', reason: 'Sai thông tin đăng ký' },
    { id: 2, date: '04/11/2025', time: '22:25:54', lane: 'Cổng vào 8', order: 'XBC627', container: 'WHSU2386497', truck: '15C18543', trailer: '15R07419', status: 'Failed', reason: 'Container hư hỏng' },
    { id: 3, date: '04/11/2025', time: '22:58:02', lane: 'Cổng ra 2', order: '42A7B4', container: 'OOCU6974298', truck: '15C28992', trailer: '15R12906', status: 'Failed', reason: 'Sai trọng lượng VGM' },
    { id: 4, date: '04/11/2025', time: '07:03:17', lane: 'Cổng vào 6', order: 'BDGJDV', container: 'WHLU0379404', truck: '15H15017', trailer: '15RM05362', status: 'Failed', reason: 'Không tìm thấy lệnh' },
    { id: 5, date: '04/11/2025', time: '07:06:40', lane: 'Cổng vào 8', order: '1HQ7DI', container: 'CAIU3138438', truck: '19H00126', trailer: '19R01050', status: 'Failed', reason: 'Sai biển số xe' },
    { id: 6, date: '04/11/2025', time: '20:25:02', lane: 'Cổng vào 6', order: '12DS91', container: 'TCLU3827182', truck: '15C15254', trailer: '15R15046', status: 'Failed', reason: 'Chưa thanh toán' },
    { id: 7, date: '04/11/2025', time: '20:58:07', lane: 'Cổng ra 2', order: 'T2DS91', container: 'TCLU3827182', truck: '15C15254', trailer: '15R15046', status: 'Failed', reason: 'Lỗi hệ thống' },
    { id: 8, date: '04/11/2025', time: '21:23:36', lane: 'Cổng vào 6', order: 'GCZ3HV', container: 'TCLU4654672', truck: '15C21783', trailer: '16R4438', status: 'Failed', reason: 'Sai số seal' },
    { id: 9, date: '04/11/2025', time: '21:35:56', lane: 'Cổng ra 1', order: 'GCZ3HV', container: 'TCLU4654672', truck: '15C21783', trailer: '16R4438', status: 'Failed', reason: 'Quá khổ giới hạn' },
];

const MOCK_CHART_DATA = [
  { name: '00:00', total: 400, success: 380 },
  { name: '04:00', total: 300, success: 290 },
  { name: '08:00', total: 850, success: 820 },
  { name: '12:00', total: 900, success: 870 },
  { name: '16:00', total: 750, success: 720 },
  { name: '20:00', total: 500, success: 485 },
];

const DETAIL_CHART_DATA = [
  { time: '07:00', traffic: 120, issues: 5 },
  { time: '09:00', traffic: 350, issues: 12 },
  { time: '11:00', traffic: 450, issues: 8 },
  { time: '13:00', traffic: 320, issues: 15 },
  { time: '15:00', traffic: 480, issues: 10 },
  { time: '17:00', traffic: 550, issues: 20 },
  { time: '19:00', traffic: 300, issues: 8 },
  { time: '21:00', traffic: 180, issues: 4 },
];

const PIE_DATA = [
  { name: 'Thành công', value: 154027 },
  { name: 'Thất bại', value: 4366 },
];

const PIE_COLORS = ['#10b981', '#f43f5e'];

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');
  const [fromDate, setFromDate] = useState('2025-08-04T12:00');
  const [toDate, setToDate] = useState('2025-11-04T11:59');

  // Helper for Summary Rows Styling
  const getSummaryRowStyle = (type: string) => {
    switch (type) {
        case 'total': return 'font-bold bg-slate-50 text-slate-900 border-b-2 border-slate-200';
        case 'subtotal_in': return 'font-bold text-slate-800 bg-emerald-50/30';
        case 'subtotal_out': return 'font-bold text-slate-800 bg-rose-50/30';
        default: return 'text-slate-600 hover:bg-slate-50';
    }
  };

  const getLabelIcon = (type: string) => {
    switch (type) {
        case 'total': return <div className="w-3 h-3 rounded-full bg-[#2796FF] mr-2"></div>;
        case 'subtotal_in': return <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>;
        case 'subtotal_out': return <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>;
        default: return null; // No icon for normal lanes, or maybe a small dot
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
        {/* Top Tab Navigation */}
        <div className="bg-white border-b border-slate-200 px-6 pt-4 flex-shrink-0">
            <div className="flex gap-6">
                <button 
                    onClick={() => setActiveTab('summary')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'summary' ? 'border-[#2796FF] text-[#2796FF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Báo cáo Tổng hợp
                </button>
                <button 
                    onClick={() => setActiveTab('detail')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'detail' ? 'border-[#2796FF] text-[#2796FF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Báo cáo Chi tiết
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[600px]">
                
                {/* ---------------- SUMMARY TAB ---------------- */}
                {activeTab === 'summary' && (
                    <div className="p-6 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800">Báo cáo Tổng hợp Dữ liệu</h2>
                            <div className="text-sm text-slate-500 italic">Dữ liệu cập nhật: 15 phút trước</div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-wrap items-end gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Từ ngày</label>
                                <div className="relative">
                                    <input 
                                        type="datetime-local" 
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="pl-3 pr-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] outline-none w-48 bg-white text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Đến ngày</label>
                                <div className="relative">
                                    <input 
                                        type="datetime-local" 
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="pl-3 pr-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] outline-none w-48 bg-white text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Loại làn</label>
                                <select className="pl-3 pr-8 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] outline-none w-32 bg-white text-slate-700">
                                    <option>Tất cả</option>
                                    <option>Cổng vào</option>
                                    <option>Cổng ra</option>
                                </select>
                            </div>
                            <button className="px-4 py-2 bg-[#2796FF] hover:bg-[#2080db] text-white font-bold rounded text-sm shadow-sm transition-colors mb-[1px]">
                                Xem báo cáo
                            </button>
                            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-sm shadow-sm transition-colors flex items-center gap-2 mb-[1px]">
                                <Download size={16} /> Xuất CSV
                            </button>
                        </div>
                        
                        {/* CHARTS SECTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Line Chart */}
                            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                     <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                         <BarChart2 size={18} className="text-[#2796FF]" />
                                         Lưu lượng xe theo thời gian
                                     </h3>
                                </div>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2796FF" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#2796FF" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Legend iconType="circle" />
                                            <Area type="monotone" dataKey="total" stroke="#2796FF" fillOpacity={1} fill="url(#colorTotal)" name="Tổng lượt" />
                                            <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={1} fill="url(#colorSuccess)" name="Thành công" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart */}
                             <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                     <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                         <PieChartIcon size={18} className="text-[#2796FF]" />
                                         Tỉ lệ Thành công / Thất bại
                                     </h3>
                                </div>
                                <div className="flex-1 flex items-center justify-center h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={PIE_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {PIE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="overflow-hidden border border-slate-200 rounded-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Làn</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Lượt</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Thành công</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Tỉ lệ (%)</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Thất bại</th>
                                        <th className="py-3 px-4 text-xs font-bold text-slate-600 uppercase">Tỉ lệ (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SUMMARY_DATA.map((row) => (
                                        <tr key={row.id} className={`border-b border-slate-100 last:border-0 ${getSummaryRowStyle(row.type)}`}>
                                            <td className="py-3 px-4 text-sm flex items-center">
                                                {getLabelIcon(row.type)}
                                                <span className={row.type.includes('lane') ? 'ml-5 underline decoration-slate-300 underline-offset-2 text-[#2796FF] cursor-pointer' : ''}>
                                                    {row.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium">{row.total.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm font-medium">{row.success.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm font-medium">{row.successRate}%</td>
                                            <td className="py-3 px-4 text-sm font-medium">{row.failed.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm font-medium">{row.failedRate}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ---------------- DETAIL TAB ---------------- */}
                {activeTab === 'detail' && (
                    <div className="p-6">
                        <div className="flex justify-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Báo cáo Chi tiết</h2>
                        </div>

                        {/* Top Date Filter */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-600">Từ ngày</label>
                                <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 bg-white"/>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-600">Đến ngày</label>
                                <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 bg-white"/>
                            </div>
                        </div>

                        {/* NEW DETAIL CHART */}
                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-6">
                            <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                        <Activity size={18} className="text-[#2796FF]" />
                                        Biến động giao dịch trong ngày
                                    </h3>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DETAIL_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2796FF" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#2796FF" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend iconType="circle" />
                                        <Area type="monotone" dataKey="traffic" stroke="#2796FF" fillOpacity={1} fill="url(#colorTraffic)" name="Giao dịch" />
                                        <Area type="monotone" dataKey="issues" stroke="#f43f5e" fillOpacity={1} fill="url(#colorIssues)" name="Lỗi/Cảnh báo" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Detailed Filter Grid */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
                                <Filter size={16} /> Bộ lọc:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Làn</label>
                                    <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2796FF] bg-white text-slate-900">
                                        <option>Tất cả</option>
                                        <option>Cổng vào 6</option>
                                        <option>Cổng ra 2</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Số lệnh</label>
                                    <input type="text" placeholder="VD: L123" className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2796FF] bg-white text-slate-900"/>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Số container</label>
                                    <input type="text" placeholder="VD: CONU123..." className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2796FF] bg-white text-slate-900"/>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Số xe</label>
                                    <input type="text" placeholder="VD: 51F-12345" className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2796FF] bg-white text-slate-900"/>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Số mooc</label>
                                    <input type="text" placeholder="VD: M789" className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2796FF] bg-white text-slate-900"/>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Trạng thái</label>
                                    <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2796FF] bg-white text-slate-900">
                                        <option>Tất cả</option>
                                        <option>Thành công</option>
                                        <option>Thất bại</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded text-sm shadow-sm transition-colors flex items-center gap-2">
                                    <Search size={16} /> Lọc dữ liệu
                                </button>
                                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-sm shadow-sm transition-colors flex items-center gap-2">
                                    <Download size={16} /> Xuất CSV
                                </button>
                            </div>
                        </div>

                        {/* Detailed Table */}
                         <div className="overflow-x-auto border border-slate-200 rounded-lg">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase w-12">STT</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Ngày</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Giờ</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Làn</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Số lệnh</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Số Container</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Số xe</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Số mooc</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase">Trạng thái</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase w-64">Nguyên nhân</th>
                                        <th className="py-3 px-3 text-xs font-bold text-slate-700 uppercase text-center">Hình ảnh</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {DETAIL_DATA.map((row, idx) => (
                                        <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-3 text-slate-500">{idx + 1}</td>
                                            <td className="py-3 px-3 text-slate-700">{row.date}</td>
                                            <td className="py-3 px-3 text-slate-700">{row.time}</td>
                                            <td className="py-3 px-3 text-slate-700">{row.lane}</td>
                                            <td className="py-3 px-3 text-slate-700 font-mono">{row.order}</td>
                                            <td className="py-3 px-3 text-slate-700 font-mono">{row.container}</td>
                                            <td className="py-3 px-3 text-slate-700 font-mono">{row.truck}</td>
                                            <td className="py-3 px-3 text-slate-700 font-mono">{row.trailer}</td>
                                            <td className={`py-3 px-3 font-medium ${row.status === 'Success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {row.status === 'Success' ? 'Thành công' : 'Thất bại'}
                                            </td>
                                            <td className="py-3 px-3 text-slate-500 text-xs italic truncate max-w-xs" title={row.reason}>
                                                {row.reason}
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <button className="p-1 text-[#2796FF] hover:bg-blue-50 rounded transition-colors">
                                                    <ImageIcon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};