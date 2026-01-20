import React, { useState, useRef } from 'react';
import { Filter, Truck, Search, AlertCircle, ZoomIn, ZoomOut, Download, Layers, Video, Image as ImageIcon, Edit3, CheckCircle, AlertTriangle, XCircle, X, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { MOCK_LANES, MOCK_TRANSACTION } from '../constants';
import { Lane, LaneStatus } from '../types';
import { CorrectionModal } from '../components/CorrectionModal';

// Helper to get color based on status
const getStatusClasses = (status: LaneStatus) => {
  switch (status) {
    case LaneStatus.Success: 
        return { 
            border: 'border-l-emerald-500', 
            bg: 'bg-emerald-50', 
            text: 'text-emerald-700',
            icon: <CheckCircle size={14} className="text-emerald-600" /> 
        };
    case LaneStatus.Failed: 
        return { 
            border: 'border-l-rose-500', 
            bg: 'bg-rose-50', 
            text: 'text-rose-700',
            icon: <XCircle size={14} className="text-rose-600" />
        };
    case LaneStatus.Waiting: 
        return { 
            border: 'border-l-amber-500', 
            bg: 'bg-amber-50', 
            text: 'text-amber-700',
            icon: <AlertTriangle size={14} className="text-amber-600" />
        };
    case LaneStatus.Processing: 
        return { 
            border: 'border-l-[#2c92d5]', 
            bg: 'bg-[#2c92d5]/10', 
            text: 'text-[#2c92d5]',
            icon: <Layers size={14} className="animate-pulse text-[#2c92d5]" />
        };
    default: 
        return { 
            border: 'border-l-slate-300', 
            bg: 'bg-white', 
            text: 'text-slate-500',
            icon: null
        };
  }
};

const getStatusLabel = (status: LaneStatus) => {
    switch (status) {
        case LaneStatus.Waiting: return 'Chờ giám định';
        case LaneStatus.Success: return 'Hoàn thành';
        case LaneStatus.Failed: return 'Sai lệch / Lỗi';
        case LaneStatus.Processing: return 'Đang xử lý';
        default: return '---';
    }
};

// --- LIGHTBOX COMPONENT ---
interface LightboxProps {
    isOpen: boolean;
    imageSrc: string;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ isOpen, imageSrc, onClose }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    if (!isOpen) return null;

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
    const handleReset = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            isDragging.current = true;
            startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current) {
            setPosition({
                x: e.clientX - startPos.current.x,
                y: e.clientY - startPos.current.y
            });
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-in fade-in duration-200 backdrop-blur-sm">
            {/* Toolbar */}
            <div className="flex justify-between items-center p-4 z-50 pointer-events-none">
                <div className="pointer-events-auto flex gap-2 bg-slate-800/80 rounded-lg p-2 backdrop-blur-md">
                    <button onClick={handleZoomIn} className="p-2 text-white hover:bg-white/20 rounded tooltip" title="Zoom In"><ZoomIn size={20}/></button>
                    <button onClick={handleZoomOut} className="p-2 text-white hover:bg-white/20 rounded tooltip" title="Zoom Out"><ZoomOut size={20}/></button>
                    <button onClick={handleReset} className="p-2 text-white hover:bg-white/20 rounded tooltip" title="Reset"><RotateCcw size={20}/></button>
                </div>
                <button onClick={onClose} className="pointer-events-auto p-3 text-white hover:bg-red-600/80 bg-slate-800/80 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Image Container */}
            <div 
                className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-4"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img 
                    src={imageSrc} 
                    alt="Zoom Detail" 
                    style={{ 
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transition: isDragging.current ? 'none' : 'transform 0.2s ease-out'
                    }}
                    className="max-h-full max-w-full object-contain select-none shadow-2xl"
                    onContextMenu={(e) => e.preventDefault()}
                />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none">
                Kéo thả để di chuyển • Cuộn để phóng to
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const [selectedLaneId, setSelectedLaneId] = useState<string>('L02'); 
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'images' | 'video'>('images');
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  
  // Search State
  const [searchTruck, setSearchTruck] = useState('');
  const [searchCont, setSearchCont] = useState('');
  const [activeTransactionData, setActiveTransactionData] = useState(MOCK_TRANSACTION);
  const [isTosSyncing, setIsTosSyncing] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');

  // Filter lanes
  const filteredLanes = filter === 'All' ? MOCK_LANES : MOCK_LANES.filter(l => l.type === filter);
  const selectedLane = MOCK_LANES.find(l => l.id === selectedLaneId) || MOCK_LANES[0];
  const hasTransaction = selectedLane.status !== LaneStatus.Idle;

  // Handlers
  const handleSearch = () => {
      // Simulation: Reset data or "find" a specific transaction
      if (searchTruck || searchCont) {
          // Just a mock effect to show "loading" behavior
          const randomContainer = searchCont || activeTransactionData.ocrData.containerNo;
          const randomTruck = searchTruck || activeTransactionData.ocrData.truckPlate;
          
          setActiveTransactionData({
              ...activeTransactionData,
              ocrData: {
                  ...activeTransactionData.ocrData,
                  containerNo: randomContainer,
                  truckPlate: randomTruck
              },
              timestamp: new Date().toLocaleString('vi-VN') // Update time to now
          });
      }
  };

  const handleRightClickImage = (e: React.MouseEvent, src: string) => {
      e.preventDefault(); // Prevent browser context menu
      setLightboxImg(src);
      setLightboxOpen(true);
  };

  const handleDownloadAll = () => {
      // Simulate download
      alert(`Đang đóng gói và tải xuống tất cả hình ảnh cho lệnh: ${activeTransactionData.sessionId}`);
  };

  const handleCorrectionSave = (newData: any) => {
      setIsCorrectionOpen(false);
      setActiveTransactionData(newData);
      
      // Simulate API call to TOS
      setIsTosSyncing(true);
      setTimeout(() => {
          setIsTosSyncing(false);
          // Optional: Update lane status to success visually after sync
          // In a real app, this would refresh the lane list data from backend
      }, 2000);
  };

  return (
    <div className="flex h-full w-full bg-slate-100 relative">
      
      {/* TOS SYNC OVERLAY */}
      {isTosSyncing && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-100">
                  <Loader2 className="h-10 w-10 text-[#2c92d5] animate-spin mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">Đồng bộ TOS...</h3>
                  <p className="text-slate-500 text-sm">Đang gửi xác nhận xe qua cổng tới hệ thống cảng.</p>
              </div>
          </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox isOpen={lightboxOpen} imageSrc={lightboxImg} onClose={() => setLightboxOpen(false)} />

      {/* LEFT COLUMN: REAL-TIME MONITOR LIST */}
      <div className="w-[340px] flex flex-col border-r border-slate-200 bg-white h-full shrink-0 shadow-lg z-10">
        <div className="p-3 border-b border-slate-100 bg-slate-50">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers size={16} className="text-[#2c92d5]"/>
                Danh sách Cổng
            </h2>
            <div className="relative">
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#2c92d5] focus:outline-none appearance-none cursor-pointer"
                >
                    <option value="All">Tất cả cổng</option>
                    <option value="Inbound">Cổng Vào</option>
                    <option value="Outbound">Cổng Ra</option>
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredLanes.map(lane => {
                const style = getStatusClasses(lane.status);
                const isSelected = selectedLaneId === lane.id;
                return (
                    <div 
                        key={lane.id}
                        onClick={() => setSelectedLaneId(lane.id)}
                        className={`
                            relative p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 group
                            ${isSelected ? 'bg-[#2c92d5]/10 ring-1 ring-[#2c92d5]/30 shadow-sm' : 'hover:bg-slate-50 border-slate-100 hover:border-slate-300'}
                            ${isSelected ? 'border-l-[#2c92d5]' : style.border}
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white' : style.bg}`}>
                                    <Truck size={16} className={isSelected ? 'text-[#2c92d5]' : style.text} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm leading-tight ${isSelected ? 'text-[#2c92d5]' : 'text-slate-700'}`}>{lane.name}</h3>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-500">{lane.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                             <div className={`flex items-center gap-1.5 font-semibold ${isSelected ? 'text-[#2c92d5]' : style.text}`}>
                                 {style.icon}
                                 <span>{getStatusLabel(lane.status)}</span>
                             </div>
                             {lane.currentTruck && (
                                 <div className="text-right">
                                     <span className="text-[10px] text-slate-400 uppercase mr-1">Số xe:</span>
                                     <span className="font-mono font-bold text-slate-800">{lane.currentTruck}</span>
                                 </div>
                             )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL VIEW */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
        
        {/* Top: Image Visualization */}
        <div className="h-[55%] flex flex-col bg-white border-b border-slate-200 shadow-sm m-2 rounded-lg overflow-hidden">
             <div className="flex border-b border-slate-200 bg-slate-50 justify-between items-center pr-3">
                 <div className="flex">
                    <button 
                        onClick={() => setActiveTab('images')}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-r border-slate-200 transition-colors ${activeTab === 'images' ? 'bg-white text-[#2c92d5] border-t-2 border-t-[#2c92d5]' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <ImageIcon size={16} /> Hình ảnh
                    </button>
                    <button 
                        onClick={() => setActiveTab('video')}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-r border-slate-200 transition-colors ${activeTab === 'video' ? 'bg-white text-[#2c92d5] border-t-2 border-t-[#2c92d5]' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <Video size={16} /> Video
                    </button>
                 </div>
                 {hasTransaction && (
                     <button 
                        onClick={handleDownloadAll}
                        className="p-2 text-slate-500 hover:text-[#2c92d5] hover:bg-blue-50 rounded-md transition-colors tooltip"
                        title="Tải về toàn bộ ảnh"
                     >
                         <Download size={18} />
                     </button>
                 )}
             </div>

             <div className="flex-1 p-3 overflow-hidden flex flex-col gap-3">
                 {/* Panorama */}
                 <div 
                    className="flex-1 bg-slate-900 relative rounded-lg border border-slate-800 overflow-hidden group flex items-center justify-center cursor-zoom-in"
                    onContextMenu={(e) => hasTransaction && handleRightClickImage(e, activeTransactionData.images.panorama)}
                    onClick={() => {
                        if (hasTransaction) {
                            setLightboxImg(activeTransactionData.images.panorama);
                            setLightboxOpen(true);
                        }
                    }}
                 >
                    {hasTransaction ? (
                        <>
                            <img src={activeTransactionData.images.panorama} className="w-full h-full object-contain pointer-events-none" alt="Panorama Container" />
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                Chuột phải để phóng to
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-500 flex flex-col items-center">
                            <Layers size={48} className="opacity-20 mb-2" />
                            <span>Chờ xe vào cổng...</span>
                        </div>
                    )}
                 </div>

                 {/* Thumbnails */}
                 <div className="h-32 grid grid-cols-5 gap-2 shrink-0">
                     {hasTransaction ? (
                         <>
                             {/* Helper map for thumbnails */}
                             {[
                                 { key: 'front', label: 'Mặt trước' },
                                 { key: 'back', label: 'Mặt sau' },
                                 { key: 'top', label: 'Mặt nóc' },
                                 { key: 'left', label: 'Vách trái' },
                                 { key: 'right', label: 'Vách phải' }
                             ].map((item) => (
                                <div 
                                    key={item.key}
                                    className="col-span-1 relative rounded bg-slate-100 border border-slate-200 overflow-hidden group cursor-pointer hover:ring-2 hover:ring-[#2c92d5]"
                                    onContextMenu={(e) => handleRightClickImage(e, activeTransactionData.images[item.key as keyof typeof activeTransactionData.images])}
                                >
                                    <img src={activeTransactionData.images[item.key as keyof typeof activeTransactionData.images]} className="w-full h-full object-cover" alt={item.label} />
                                    <span className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-0.5 uppercase">{item.label}</span>
                                    <ZoomIn size={14} className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 drop-shadow-md"/>
                                </div>
                             ))}
                         </>
                     ) : (
                        [1,2,3,4,5].map(i => <div key={i} className="bg-slate-200 animate-pulse rounded"></div>)
                     )}
                 </div>
             </div>
        </div>

        {/* Bottom: Data & Operations */}
        <div className="flex-1 flex flex-col md:flex-row px-2 pb-2 gap-2 overflow-hidden min-h-0">
            
            {/* Left Panel: Search & Order Info */}
            <div className="w-full md:w-[35%] flex flex-col gap-2">
                 {/* Quick Search */}
                 <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex gap-2 items-end">
                     <div className="flex-1 space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Số Xe</label>
                         <input 
                            type="text" 
                            value={searchTruck}
                            onChange={(e) => setSearchTruck(e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-[#2c92d5] outline-none uppercase bg-white text-slate-900" 
                            placeholder="51C-..." 
                         />
                     </div>
                     <div className="flex-1 space-y-1">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Số Cont</label>
                         <input 
                            type="text" 
                            value={searchCont}
                            onChange={(e) => setSearchCont(e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-[#2c92d5] outline-none uppercase bg-white text-slate-900" 
                            placeholder="ABCD..." 
                         />
                     </div>
                     <button 
                        onClick={handleSearch}
                        className="px-3 py-1.5 bg-[#2c92d5] text-white rounded text-xs font-bold hover:bg-[#237ab3] transition-colors h-[30px] mb-[1px]"
                     >
                         Nạp
                     </button>
                 </div>

                 {/* Order Details Card */}
                 <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 p-3 overflow-y-auto">
                     <h3 className="text-xs font-bold text-slate-800 uppercase border-b pb-2 mb-2 flex justify-between">
                         Thông tin lệnh
                         <span className="text-[#2c92d5]">{hasTransaction ? activeTransactionData.timestamp : '--:--'}</span>
                     </h3>
                     {hasTransaction ? (
                         <div className="space-y-2 text-sm">
                             <div className="grid grid-cols-2 gap-x-2">
                                 <div><span className="text-slate-500 text-xs">Số Phiên:</span> <div className="font-mono font-medium text-slate-900">{activeTransactionData.sessionId}</div></div>
                                 <div><span className="text-slate-500 text-xs">Số Seal:</span> <div className="font-mono font-medium text-slate-900">{activeTransactionData.systemData.sealNo || '---'}</div></div>
                             </div>
                             <div className="grid grid-cols-2 gap-x-2">
                                 <div><span className="text-slate-500 text-xs">Số PIN:</span> <div className="font-mono font-medium text-slate-900">{activeTransactionData.systemData.bookingNo}</div></div>
                                 <div><span className="text-slate-500 text-xs">VGM:</span> <div className="font-mono font-medium text-amber-600">{activeTransactionData.systemData.vgm || '---'}</div></div>
                             </div>
                             
                             {/* GATE STATUS / NOTES SECTION */}
                             <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-md">
                                 <div className="flex items-center gap-1.5 mb-1">
                                    <AlertTriangle size={12} className="text-rose-600" />
                                    <span className="text-xs font-bold text-rose-700 uppercase">Ghi chú (Gate Status)</span>
                                 </div>
                                 <p className="text-sm font-semibold text-slate-800 leading-snug">
                                    {activeTransactionData.notes}
                                 </p>
                                 <p className="text-[10px] text-slate-500 italic mt-1">Trả rỗng</p>
                             </div>
                             
                             <button 
                                onClick={() => setIsCorrectionOpen(true)}
                                className="w-full mt-3 py-2 bg-[#2c92d5] text-white rounded-md text-sm font-bold hover:bg-[#237ab3] flex items-center justify-center gap-2 transition-colors shadow-sm"
                             >
                                 <Edit3 size={14}/> Điều chỉnh & Xác nhận
                             </button>
                         </div>
                     ) : (
                         <div className="text-center text-slate-400 text-sm mt-4">Chưa có thông tin</div>
                     )}
                 </div>
            </div>

            {/* Right Panel: Data Verification Table */}
            <div className="w-full md:w-[65%] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                 <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                     <h3 className="text-xs font-bold text-slate-700 uppercase">Thông tin đối chiếu</h3>
                     <span className="text-[10px] text-slate-500 bg-white border px-2 py-0.5 rounded">So sánh song song</span>
                 </div>
                 
                 <div className="flex-1 overflow-auto">
                     <table className="w-full text-left text-sm">
                         <thead className="bg-slate-100 text-slate-500 font-semibold text-[11px] uppercase sticky top-0 z-10">
                             <tr>
                                 <th className="px-3 py-2 border-b border-r w-1/4">Trường dữ liệu</th>
                                 <th className="px-3 py-2 border-b border-r w-[37.5%] text-[#2c92d5] bg-[#2c92d5]/10">Thông tin OCR</th>
                                 <th className="px-3 py-2 border-b w-[37.5%] text-slate-700">Thông tin Lệnh</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {hasTransaction ? (
                                <>
                                 <tr>
                                     <td className="px-3 py-2.5 font-medium text-slate-600 bg-slate-50/50 text-xs uppercase">Số Container</td>
                                     <td className={`px-3 py-2.5 font-mono font-bold ${activeTransactionData.ocrData.containerNo !== activeTransactionData.systemData.containerNo ? 'text-rose-600 bg-rose-50' : 'text-emerald-700'}`}>{activeTransactionData.ocrData.containerNo}</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.systemData.containerNo}</td>
                                 </tr>
                                 <tr>
                                     <td className="px-3 py-2.5 font-medium text-slate-600 bg-slate-50/50 text-xs uppercase">Kích cỡ (ISO)</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.ocrData.isoCode}</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.systemData.isoCode}</td>
                                 </tr>
                                 <tr>
                                     <td className="px-3 py-2.5 font-medium text-slate-600 bg-slate-50/50 text-xs uppercase">Số xe</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.ocrData.truckPlate}</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.systemData.truckPlate}</td>
                                 </tr>
                                 <tr>
                                     <td className="px-3 py-2.5 font-medium text-slate-600 bg-slate-50/50 text-xs uppercase">Số mooc</td>
                                     <td className={`px-3 py-2.5 font-mono ${activeTransactionData.ocrData.trailerPlate !== activeTransactionData.systemData.trailerPlate ? 'text-rose-600 font-bold bg-rose-50' : 'text-emerald-700'}`}>{activeTransactionData.ocrData.trailerPlate}</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.systemData.trailerPlate}</td>
                                 </tr>
                                 <tr>
                                     <td className="px-3 py-2.5 font-medium text-slate-600 bg-slate-50/50 text-xs uppercase">Số Seal</td>
                                     <td className={`px-3 py-2.5 font-mono ${!activeTransactionData.ocrData.sealNo ? 'text-amber-600 italic' : 'text-slate-800'}`}>{activeTransactionData.ocrData.sealNo || 'Không đọc được'}</td>
                                     <td className="px-3 py-2.5 font-mono text-slate-800">{activeTransactionData.systemData.sealNo}</td>
                                 </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-400">Chọn một cổng đang hoạt động để xem chi tiết</td>
                                </tr>
                            )}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>

      </div>

      {hasTransaction && (
          <CorrectionModal 
            isOpen={isCorrectionOpen}
            onClose={() => setIsCorrectionOpen(false)}
            data={activeTransactionData}
            onSave={handleCorrectionSave}
          />
      )}
    </div>
  );
};