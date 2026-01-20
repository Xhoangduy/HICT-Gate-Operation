import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ZoomIn, ZoomOut, Download, AlertCircle, Edit3, Check } from 'lucide-react';
import { MOCK_TRANSACTION } from '../constants';
import { CorrectionModal } from '../components/CorrectionModal';

export const TransactionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = MOCK_TRANSACTION; // In real app, fetch based on ID

  const ComparisonRow = ({ label, ocr, system, highlight = false }: { label: string, ocr: string, system: string, highlight?: boolean }) => {
      const isMismatch = ocr !== system && system !== '';
      const isMissing = system === '';
      
      return (
        <tr className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${highlight && isMismatch ? 'bg-red-50/50' : ''}`}>
            <td className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{label}</td>
            <td className={`py-3 px-4 font-mono font-medium ${isMismatch ? 'text-red-600' : 'text-slate-800'}`}>
                {ocr}
            </td>
            <td className="py-3 px-4 font-mono text-slate-600 relative">
                {isMissing ? <span className="text-slate-400 italic text-sm">Not found</span> : system}
                {isMismatch && !isMissing && (
                    <AlertCircle size={16} className="text-red-500 absolute right-2 top-1/2 -translate-y-1/2" />
                )}
            </td>
        </tr>
      );
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                 <ChevronLeft size={24} />
             </button>
             <div>
                 <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">Transaction Details</h2>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded border border-amber-200">Waiting for Verification</span>
                 </div>
                 <p className="text-sm text-slate-500 font-mono mt-0.5">{id} • {data.timestamp}</p>
             </div>
         </div>
         <div className="flex gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
                <Edit3 size={16} />
                Correction
             </button>
             <button className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <Check size={16} />
                Confirm & Gate Pass
             </button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
          {/* Left Column: Image Viewer */}
          <div className="xl:col-span-7 flex flex-col gap-4 min-h-0 h-full">
              {/* Panorama / Main View */}
              <div className="flex-1 bg-black/90 rounded-xl overflow-hidden relative group shadow-md flex items-center justify-center">
                  <img src={data.images.panorama} alt="Panorama" className="w-full h-auto object-contain max-h-full" />
                  
                  {/* Floating Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/50 p-2 rounded-lg backdrop-blur-sm">
                      <button className="p-2 text-white hover:bg-white/20 rounded"><ZoomIn size={20}/></button>
                      <button className="p-2 text-white hover:bg-white/20 rounded"><ZoomOut size={20}/></button>
                      <button className="p-2 text-white hover:bg-white/20 rounded"><Download size={20}/></button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-mono">
                      CAM_PANORAMA_01
                  </div>
              </div>

              {/* Thumbnails */}
              <div className="h-32 grid grid-cols-5 gap-3 shrink-0">
                  {['front', 'back', 'left', 'right', 'top'].map((key) => (
                      <div key={key} className="bg-slate-200 rounded-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                          <img 
                            src={data.images[key as keyof typeof data.images]} 
                            alt={key} 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] uppercase text-center py-0.5">
                              {key}
                          </span>
                      </div>
                  ))}
              </div>
          </div>

          {/* Right Column: Data & Comparison */}
          <div className="xl:col-span-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
              
              {/* Session Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 border-b pb-2">Session Info</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                          <label className="text-xs text-slate-500">Session ID</label>
                          <p className="font-mono text-sm font-medium">{data.sessionId}</p>
                      </div>
                      <div>
                          <label className="text-xs text-slate-500">Gate/Lane</label>
                          <p className="font-mono text-sm font-medium">{data.laneId}</p>
                      </div>
                       <div>
                          <label className="text-xs text-slate-500">Booking No.</label>
                          <p className="font-mono text-sm font-medium">{data.systemData.bookingNo}</p>
                      </div>
                       <div>
                          <label className="text-xs text-slate-500">VGM (kg)</label>
                          <p className="font-mono text-sm font-medium">{data.systemData.vgm}</p>
                      </div>
                  </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Data Verification</h3>
                      <span className="text-xs text-slate-500">OCR vs. TOS System</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-2 px-4 text-xs font-semibold text-slate-400 w-1/4">Field</th>
                                <th className="py-2 px-4 text-xs font-semibold text-blue-600 w-1/3">OCR Result</th>
                                <th className="py-2 px-4 text-xs font-semibold text-slate-600 w-1/3">System Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow label="Container No" ocr={data.ocrData.containerNo} system={data.systemData.containerNo} highlight />
                            <ComparisonRow label="ISO Code" ocr={data.ocrData.isoCode} system={data.systemData.isoCode} highlight />
                            <ComparisonRow label="Truck Plate" ocr={data.ocrData.truckPlate} system={data.systemData.truckPlate} highlight />
                            <ComparisonRow label="Trailer Plate" ocr={data.ocrData.trailerPlate} system={data.systemData.trailerPlate} highlight />
                            <ComparisonRow label="Seal No" ocr={data.ocrData.sealNo} system={data.systemData.sealNo} highlight />
                        </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 mt-auto border-t border-slate-100 bg-yellow-50/50">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Operator Notes</label>
                      <p className="text-sm text-slate-700 italic">{data.notes}</p>
                  </div>
              </div>
          </div>
      </div>
      
      <CorrectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={data} 
        onSave={(d) => console.log('Saved', d)} 
      />
    </div>
  );
};