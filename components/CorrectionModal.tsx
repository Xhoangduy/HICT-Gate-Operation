import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Check } from 'lucide-react';
import { TransactionData } from '../types';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TransactionData;
  onSave: (newData: any) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({ isOpen, onClose, data, onSave }) => {
  // Parse initial data
  const initialBic = data.ocrData.containerNo ? data.ocrData.containerNo.substring(0, 4) : '';
  const initialContNum = data.ocrData.containerNo ? data.ocrData.containerNo.substring(4) : '';

  const [formState, setFormState] = useState({
    bic: initialBic,
    contNumber: initialContNum,
    trailer: data.ocrData.trailerPlate || '',
    truck: data.ocrData.truckPlate || '',
    iso: data.ocrData.isoCode || '',
    isoSystem: data.systemData.isoCode || '', 
    vgm: data.systemData.vgm || '',
    isStandardCont: true, // "Xác nhận Cont thường"
    hasStickers: false,   // "Xác nhận Cont dán đủ tem"
    isPassgate: false     // "Xác nhận Passgate"
  });

  const [initialState, setInitialState] = useState({ ...formState });
  const [successType, setSuccessType] = useState<'none' | 'update' | 'passgate'>('none');

  // Reset state when modal opens with new data
  useEffect(() => {
    if (isOpen) {
       const bic = data.ocrData.containerNo ? data.ocrData.containerNo.substring(0, 4) : '';
       const contNum = data.ocrData.containerNo ? data.ocrData.containerNo.substring(4) : '';
       
       const newState = {
        bic: bic,
        contNumber: contNum,
        trailer: data.ocrData.trailerPlate || '',
        truck: data.ocrData.truckPlate || '',
        iso: data.ocrData.isoCode || '',
        isoSystem: data.systemData.isoCode || '',
        vgm: data.systemData.vgm || '',
        isStandardCont: true,
        hasStickers: false,
        isPassgate: false
       };
       setFormState(newState);
       setInitialState(newState);
       setSuccessType('none');
    }
  }, [isOpen, data]);

  // Calculate changes
  const getChangeCount = () => {
    let count = 0;
    if (formState.bic !== initialState.bic) count++;
    if (formState.contNumber !== initialState.contNumber) count++;
    if (formState.trailer !== initialState.trailer) count++;
    if (formState.truck !== initialState.truck) count++;
    if (formState.iso !== initialState.iso) count++;
    if (formState.isStandardCont !== initialState.isStandardCont) count++;
    if (formState.hasStickers !== initialState.hasStickers) count++;
    if (formState.isPassgate !== initialState.isPassgate) count++;
    return count;
  };

  const changes = getChangeCount();

  const handleReset = () => {
    setFormState({ ...initialState });
  };

  const handleUpdateClick = () => {
    // If Passgate was toggled to TRUE, show Passgate success message
    // Otherwise show generic data update success message
    if (formState.isPassgate && !initialState.isPassgate) {
        setSuccessType('passgate');
    } else {
        setSuccessType('update');
    }
  };

  const handleFinalConfirm = () => {
    // Construct final object
    const fullContainerNo = `${formState.bic}${formState.contNumber}`;
    onSave({
        ...data,
        ocrData: {
            ...data.ocrData,
            containerNo: fullContainerNo,
            trailerPlate: formState.trailer,
            truckPlate: formState.truck,
            isoCode: formState.iso,
        },
        // Add flags or logic here based on formState if needed for backend
        notes: formState.isPassgate ? 'Đã xác nhận Passgate thành công' : 'Đã cập nhật thủ công'
    });
    onClose();
  };

  if (!isOpen) return null;

  // ---------------------------------------------------------------------------
  // SUCCESS POPUP VIEW
  // ---------------------------------------------------------------------------
  if (successType !== 'none') {
      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center p-8 text-center animate-in zoom-in-95 duration-200 scale-100">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100 flex items-center justify-center mb-4">
                    <Check size={40} className="text-emerald-500" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">Thành công</h3>
                <p className="text-slate-500 mb-8 font-medium">
                    {successType === 'passgate' 
                        ? 'Đã yêu cầu cho Passgate thành công'
                        : 'Đã cập nhật dữ liệu thành công'
                    }
                </p>
                <button 
                    onClick={handleFinalConfirm}
                    className="bg-[#2796FF] hover:bg-[#2080db] text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-[#2796FF]/20 transition-all w-32"
                >
                    OK
                </button>
            </div>
        </div>
      );
  }

  // ---------------------------------------------------------------------------
  // MAIN FORM VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800 uppercase">Điều chỉnh thông tin</h3>
                {changes > 0 && (
                    <span className="bg-[#2796FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {changes} thay đổi
                    </span>
                )}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded p-1">
                <X size={20} />
            </button>
        </div>

        {/* Body - Compact Grid Layout */}
        <div className="p-5 space-y-4">
            
            {/* Row 1: Container Info */}
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số BIC</label>
                    <input 
                        type="text" 
                        value={formState.bic}
                        onChange={(e) => setFormState({...formState, bic: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] focus:border-[#2796FF] font-mono font-bold text-slate-800 uppercase bg-white h-9"
                    />
                </div>
                <div className="col-span-5 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số Container</label>
                    <input 
                        type="text" 
                        value={formState.contNumber}
                        onChange={(e) => setFormState({...formState, contNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] focus:border-[#2796FF] font-mono font-bold text-slate-800 bg-white h-9"
                    />
                </div>
                 <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">ISO (OCR)</label>
                    <input 
                        type="text" 
                        value={formState.iso}
                        onChange={(e) => setFormState({...formState, iso: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] focus:border-[#2796FF] font-mono font-bold text-slate-800 uppercase bg-white h-9"
                    />
                </div>
                <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">ISO Lệnh</label>
                    <input 
                        type="text" 
                        readOnly
                        value={formState.isoSystem}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-500 font-mono h-9 cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Row 2: Transport & Weight */}
            <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số Xe</label>
                    <input 
                        type="text" 
                        value={formState.truck}
                        onChange={(e) => setFormState({...formState, truck: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] focus:border-[#2796FF] font-mono font-bold text-slate-800 uppercase bg-white h-9"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Số Mooc</label>
                    <input 
                        type="text" 
                        value={formState.trailer}
                        onChange={(e) => setFormState({...formState, trailer: e.target.value.toUpperCase()})}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] focus:border-[#2796FF] font-mono font-bold text-slate-800 uppercase bg-white h-9"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">VGM (Kg)</label>
                    <input 
                        type="text" 
                        value={formState.vgm}
                        onChange={(e) => setFormState({...formState, vgm: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#2796FF] focus:border-[#2796FF] font-mono font-bold text-slate-800 bg-white h-9"
                    />
                </div>
            </div>

            {/* Row 3: Toggles - Compact Grid */}
            <div className="pt-4 mt-2 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-4">
                    {/* Standard Cont Toggle */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-700">Cont thường?</span>
                        <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                            <button 
                                onClick={() => setFormState({...formState, isStandardCont: false})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${!formState.isStandardCont ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Không
                            </button>
                            <button 
                                onClick={() => setFormState({...formState, isStandardCont: true})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${formState.isStandardCont ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Có
                            </button>
                        </div>
                    </div>

                    {/* Stickers Toggle */}
                     <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-700">Dán đủ tem?</span>
                        <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                            <button 
                                onClick={() => setFormState({...formState, hasStickers: false})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${!formState.hasStickers ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Không
                            </button>
                            <button 
                                onClick={() => setFormState({...formState, hasStickers: true})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${formState.hasStickers ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Có
                            </button>
                        </div>
                    </div>

                    {/* Passgate Toggle */}
                     <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-700">Passgate?</span>
                        <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                            <button 
                                onClick={() => setFormState({...formState, isPassgate: false})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${!formState.isPassgate ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Không
                            </button>
                            <button 
                                onClick={() => setFormState({...formState, isPassgate: true})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${formState.isPassgate ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Có
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-t border-slate-200">
            <button 
                onClick={onClose} 
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded shadow-sm transition-colors"
            >
                Đóng
            </button>
            
            <div className="flex gap-2">
                <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-1"
                >
                    <RotateCcw size={16} /> Reset
                </button>
                <button 
                    onClick={handleUpdateClick} 
                    className="px-5 py-2 bg-[#2796FF] hover:bg-[#2080db] text-white text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-2"
                >
                    <Save size={16} />
                    Lưu Thay Đổi
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};