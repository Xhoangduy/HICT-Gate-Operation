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
            border: 'border-l-[#2796FF]', 
            bg: 'bg-[#2796FF]/10', 
            text: 'text-[#2796FF]',
            icon: <Layers size={14} className="animate-pulse text-[#2796FF]" />
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

  // Filter lanes logic
  const filteredLanes = filter === 'All' 
    ? MOCK_LANES 
    : ['Inbound', 'Outbound'].includes(filter) 
        ? MOCK_LANES.filter(l => l.type === filter)
        : MOCK_LANES.filter(l => l.id === filter);

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

  // Helper for row styling
  const getRowStyle = (ocrVal: string | undefined, sysVal: string | undefined) => {
    // If OCR equals System -> Green (#D1E7DD), else -> Red (#F8D7DA)
    if (ocrVal === sysVal) {
        return 'bg-[#D1E7DD]';
    }
    return 'bg-[#F8D7DA]';
  };

  return (
    <div className="flex h-full w-full bg-slate-100 relative">
      
      {/* TOS SYNC OVERLAY */}
      {isTosSyncing && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-100">
                  <Loader2 className="h-10 w-10 text-[#2796FF] animate-spin mb-3" />
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
                <Layers size={16} className="text-[#2796FF]"/>
                Danh sách Cổng
            </h2>
            <div className="relative">
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#2796FF] focus:outline-none appearance-none cursor-pointer"
                >
                    <option value="All">Tất cả cổng</option>
                    {MOCK_LANES.map(lane => (
                        <option key={lane.id} value={lane.id}>{lane.name}</option>
                    ))}
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredLanes.length > 0 ? filteredLanes.map(lane => {
                const style = getStatusClasses(lane.status);
                const isSelected = selectedLaneId === lane.id;
                return (
                    <div 
                        key={lane.id}
                        onClick={() => setSelectedLaneId(lane.id)}
                        className={`
                            relative p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 group
                            ${isSelected ? 'bg-[#2796FF]/10 ring-1 ring-[#2796FF]/30 shadow-sm' : 'hover:bg-slate-50 border-slate-100 hover:border-slate-300'}
                            ${isSelected ? 'border-l-[#2796FF]' : style.border}
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white' : style.bg}`}>
                                    <Truck size={16} className={isSelected ? 'text-[#2796FF]' : style.text} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm leading-tight ${isSelected ? 'text-[#2796FF]' : 'text-slate-700'}`}>{lane.name}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono font-bold text-slate-500 block">{lane.lastUpdated}</span>
                                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">21/10/2025</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                             <div className={`flex items-center gap-1.5 font-semibold ${isSelected ? 'text-[#2796FF]' : style.text}`}>
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
            }) : (
                <div className="text-center p-4 text-slate-400 text-sm italic">
                    Không tìm thấy cổng nào phù hợp.
                </div>
            )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL VIEW */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100">
        
        {/* Top: Image Visualization & Toolbar */}
        <div className="h-[55%] flex flex-col bg-white border-b border-slate-200 shadow-sm m-2 rounded-lg overflow-hidden">
             <div className="flex border-b border-slate-200 bg-slate-50 justify-between items-center pr-3 h-[50px] shrink-0">
                 {/* Left: Tabs */}
                 <div className="flex h-full">
                    <button 
                        onClick={() => setActiveTab('images')}
                        className={`flex items-center gap-2 px-6 h-full text-sm font-bold border-r border-slate-200 transition-colors ${activeTab === 'images' ? 'bg-white text-[#2796FF] border-t-2 border-t-[#2796FF]' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <ImageIcon size={16} /> Hình ảnh
                    </button>
                    <button 
                        onClick={() => setActiveTab('video')}
                        className={`flex items-center gap-2 px-6 h-full text-sm font-bold border-r border-slate-200 transition-colors ${activeTab === 'video' ? 'bg-white text-[#2796FF] border-t-2 border-t-[#2796FF]' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <Video size={16} /> Video
                    </button>
                 </div>

                 {/* Right: Search & Actions */}
                 <div className="flex items-center gap-3">
                     {/* Compact Search Bar */}
                     <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 p-0.5 shadow-sm h-8">
                        <div className="relative border-r border-slate-100 h-full flex items-center">
                            <span className="absolute left-2 text-[9px] font-bold text-slate-400 uppercase pointer-events-none">XE</span>
                            <input 
                                type="text" 
                                value={searchTruck}
                                onChange={(e) => setSearchTruck(e.target.value)}
                                className="pl-7 pr-2 py-1 w-24 text-xs font-mono font-bold text-slate-700 outline-none uppercase bg-transparent h-full placeholder-slate-300" 
                                placeholder="51C-..." 
                            />
                        </div>
                        <div className="relative h-full flex items-center">
                            <span className="absolute left-2 text-[9px] font-bold text-slate-400 uppercase pointer-events-none">CONT</span>
                            <input 
                                type="text" 
                                value={searchCont}
                                onChange={(e) => setSearchCont(e.target.value)}
                                className="pl-10 pr-2 py-1 w-32 text-xs font-mono font-bold text-slate-700 outline-none uppercase bg-transparent h-full placeholder-slate-300" 
                                placeholder="ABCD..." 
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="px-3 h-full bg-[#2796FF] text-white rounded-[4px] text-xs font-bold hover:bg-[#2080db] transition-colors ml-1"
                        >
                            Nạp
                        </button>
                     </div>

                     {/* Divider */}
                     <div className="h-5 w-[1px] bg-slate-300"></div>

                     {hasTransaction && (
                         <button 
                            onClick={handleDownloadAll}
                            className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-[#2796FF] hover:bg-blue-50 rounded-md transition-colors text-xs font-bold border border-transparent hover:border-blue-100"
                            title="Tải về toàn bộ ảnh"
                         >
                             <Download size={16} /> <span className="hidden xl:inline">Tải ảnh</span>
                         </button>
                     )}
                 </div>
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
                                    className="col-span-1 relative rounded bg-slate-100 border border-slate-200 overflow-hidden group cursor-pointer hover:ring-2 hover:ring-[#2796FF]"
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
            
            {/* Left Panel: Order Info ONLY (Search moved to top) */}
            <div className="w-full md:w-[35%] flex flex-col gap-2">
                 {/* Order Details Card - Now takes full height of this column */}
                 <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 p-0 overflow-hidden flex flex-col h-full">
                     <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                         <h3 className="text-xs font-bold text-slate-800 uppercase">Thông tin lệnh</h3>
                         <span className="text-[#2796FF] text-xs font-bold">{hasTransaction ? activeTransactionData.timestamp : '--:--'}</span>
                     </div>
                     
                     {hasTransaction ? (
                         <div className="p-2 flex flex-col gap-2 text-sm h-full overflow-hidden">
                             {/* Detailed 2-Column Table Layout */}
                             <div className="grid grid-cols-2 border border-slate-200 rounded-lg overflow-hidden shrink-0">
                                {/* Row 1: Session & Gate */}
                                <div className="p-1.5 border-r border-b border-slate-200">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Số phiên:</div>
                                    <div className="font-mono text-slate-900 font-bold text-xs truncate max-w-[150px]" title={activeTransactionData.sessionId}>{activeTransactionData.sessionId}</div>
                                </div>
                                <div className="p-1.5 border-b border-slate-200">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Tên cổng:</div>
                                    <div className="font-bold text-[#2796FF] text-xs truncate">{MOCK_LANES.find(l => l.id === activeTransactionData.laneId)?.name || activeTransactionData.laneId}</div>
                                </div>
                                
                                {/* Row 2: PIN & Seal */}
                                <div className="p-1.5 border-r border-b border-slate-200 bg-slate-50/30">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Số PIN:</div>
                                    <div className="font-mono text-slate-900 font-bold text-xs">{activeTransactionData.systemData.bookingNo}</div>
                                </div>
                                <div className="p-1.5 border-b border-slate-200 bg-slate-50/30">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Số seal:</div>
                                    <div className="font-mono text-slate-900 font-bold text-xs">{activeTransactionData.systemData.sealNo || '---'}</div>
                                </div>
                                
                                {/* Row 3: Operation & VGM */}
                                <div className="p-1.5 border-r border-slate-200">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Tác nghiệp:</div>
                                    <div className="font-bold text-slate-900 text-xs">Trả rỗng</div>
                                </div>
                                <div className="p-1.5">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">VGM:</div>
                                    <div className="font-mono text-red-600 font-bold text-xs">{activeTransactionData.systemData.vgm || '---'}</div>
                                </div>
                             </div>

                             {/* GATE STATUS / NOTES SECTION */}
                             <div className="mt-1 p-2 bg-rose-50 border border-rose-200 rounded-md shrink-0">
                                 <div className="flex items-center gap-1.5 mb-1">
                                    <AlertTriangle size={12} className="text-rose-600" />
                                    <span className="text-xs font-bold text-rose-700 uppercase">Ghi chú</span>
                                 </div>
                                 <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                                    {activeTransactionData.notes}
                                 </p>
                             </div>
                             
                         </div>
                     ) : (
                         <div className="p-8 text-center text-slate-400 text-sm">Chưa có thông tin</div>
                     )}
                 </div>
            </div>

            {/* Right Panel: Data Verification Table */}
            <div className="w-full md:w-[65%] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                 <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center relative min-h-[42px]">
                     {/* Center Title */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <h3 className="text-xs font-bold text-black uppercase">THÔNG TIN ĐỐI CHIẾU</h3>
                     </div>

                     {/* Left spacer to push content if needed */}
                     <div></div>
                     
                     {/* Right Action Button */}
                     {hasTransaction && (
                        <button 
                            onClick={() => setIsCorrectionOpen(true)}
                            className="relative z-10 px-3 py-1.5 bg-[#2796FF] text-white rounded text-xs font-bold hover:bg-[#2080db] flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Edit3 size={12}/> Điều chỉnh
                        </button>
                     )}
                 </div>
                 
                 <div className="flex-1 overflow-auto">
                     <table className="w-full text-left text-sm">
                         <thead className="bg-white text-black font-bold text-[11px] uppercase sticky top-0 z-10 border-b border-slate-200">
                             <tr>
                                 <th className="px-3 py-2 border-r w-1/4"></th>
                                 <th className="px-3 py-2 border-r w-[37.5%]">THÔNG TIN OCR</th>
                                 <th className="px-3 py-2 w-[37.5%]">THÔNG TIN LỆNH</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {hasTransaction ? (
                                <>
                                 <tr className={getRowStyle(activeTransactionData.ocrData.containerNo, activeTransactionData.systemData.containerNo)}>
                                     <td className="px-3 py-2.5 font-bold text-black text-xs uppercase">SỐ CONTAINER</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.ocrData.containerNo}</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.systemData.containerNo}</td>
                                 </tr>
                                 <tr className={getRowStyle(activeTransactionData.ocrData.isoCode, activeTransactionData.systemData.isoCode)}>
                                     <td className="px-3 py-2.5 font-bold text-black text-xs uppercase">KÍCH CỠ</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.ocrData.isoCode}</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.systemData.isoCode}</td>
                                 </tr>
                                 <tr className={getRowStyle(activeTransactionData.ocrData.truckPlate, activeTransactionData.systemData.truckPlate)}>
                                     <td className="px-3 py-2.5 font-bold text-black text-xs uppercase">SỐ XE</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.ocrData.truckPlate}</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.systemData.truckPlate}</td>
                                 </tr>
                                 <tr className={getRowStyle(activeTransactionData.ocrData.trailerPlate, activeTransactionData.systemData.trailerPlate)}>
                                     <td className="px-3 py-2.5 font-bold text-black text-xs uppercase">SỐ MOOC</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.ocrData.trailerPlate}</td>
                                     <td className="px-3 py-2.5 font-mono text-black">{activeTransactionData.systemData.trailerPlate}</td>
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