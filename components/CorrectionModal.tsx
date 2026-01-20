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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-in fade-in duration-200">
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
                    className="bg-[#2c92d5] hover:bg-[#237ab3] text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-[#2c92d5]/20 transition-all w-32"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800">Thông số OCR:</h3>
                {changes > 0 && (
                    <span className="bg-[#2c92d5] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {changes} thay đổi
                    </span>
                )}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded p-1">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            
            {/* Container Number Split */}
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-slate-600 font-medium">Số Bic:</label>
                </div>
                <input 
                    type="text" 
                    value={formState.bic}
                    onChange={(e) => setFormState({...formState, bic: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#2c92d5] focus:border-[#2c92d5] font-mono text-slate-900 uppercase bg-white"
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm text-slate-600 font-medium">Số Container:</label>
                <input 
                    type="text" 
                    value={formState.contNumber}
                    onChange={(e) => setFormState({...formState, contNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#2c92d5] focus:border-[#2c92d5] font-mono text-slate-900 bg-white"
                />
            </div>

            {/* Other Fields */}
            <div className="space-y-1">
                <label className="text-sm text-slate-600 font-medium">Số Mooc:</label>
                <input 
                    type="text" 
                    value={formState.trailer}
                    onChange={(e) => setFormState({...formState, trailer: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#2c92d5] focus:border-[#2c92d5] font-mono text-slate-900 uppercase bg-white"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600 font-medium">Số Xe:</label>
                <input 
                    type="text" 
                    value={formState.truck}
                    onChange={(e) => setFormState({...formState, truck: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#2c92d5] focus:border-[#2c92d5] font-mono text-slate-900 uppercase bg-white"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600 font-medium">Loại Cont:</label>
                <input 
                    type="text" 
                    value={formState.iso}
                    onChange={(e) => setFormState({...formState, iso: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#2c92d5] focus:border-[#2c92d5] font-mono text-slate-900 uppercase bg-white"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm text-slate-600 font-medium">Loại Cont Lệnh:</label>
                <input 
                    type="text" 
                    readOnly
                    value={formState.isoSystem}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-mono cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 italic">Chỉ cho phép chỉnh sửa 2 ký tự số đầu tiên (theo nghiệp vụ)</p>
            </div>

             <div className="space-y-1">
                <label className="text-sm text-slate-600 font-medium">VGM:</label>
                <input 
                    type="text" 
                    value={formState.vgm}
                    onChange={(e) => setFormState({...formState, vgm: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#2c92d5] focus:border-[#2c92d5] font-mono text-slate-900 bg-white"
                />
            </div>

            {/* Toggles */}
            <div className="pt-2 space-y-3 border-t border-slate-100 mt-4">
                {/* Standard Cont Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">Xác nhận Cont thường:</span>
                        {formState.isStandardCont !== initialState.isStandardCont && (
                             <span className="text-[10px] bg-yellow-400 text-yellow-900 font-bold px-1.5 rounded">Changed</span>
                        )}
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button 
                            onClick={() => setFormState({...formState, isStandardCont: false})}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${!formState.isStandardCont ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400'}`}
                        >
                            Không
                        </button>
                        <button 
                            onClick={() => setFormState({...formState, isStandardCont: true})}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${formState.isStandardCont ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}
                        >
                            Có
                        </button>
                    </div>
                </div>

                {/* Stickers Toggle */}
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Xác nhận Cont dán đủ tem:</span>
                    <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button 
                            onClick={() => setFormState({...formState, hasStickers: false})}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${!formState.hasStickers ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400'}`}
                        >
                            Không
                        </button>
                        <button 
                            onClick={() => setFormState({...formState, hasStickers: true})}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${formState.hasStickers ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}
                        >
                            Có
                        </button>
                    </div>
                </div>

                {/* Passgate Toggle */}
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Xác nhận Passgate:</span>
                    <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                        <button 
                            onClick={() => setFormState({...formState, isPassgate: false})}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${!formState.isPassgate ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400'}`}
                        >
                            Không
                        </button>
                        <button 
                            onClick={() => setFormState({...formState, isPassgate: true})}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${formState.isPassgate ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}
                        >
                            Có
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-4 flex items-center justify-between border-t border-slate-200">
            <button 
                onClick={onClose} 
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-sm font-bold rounded shadow-sm transition-colors"
            >
                Đóng
            </button>
            
            <div className="flex gap-2">
                <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-900 text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-1"
                >
                    <RotateCcw size={16} /> Reset thay đổi
                </button>
                <button 
                    onClick={handleUpdateClick} 
                    className="px-4 py-2 bg-[#2c92d5] hover:bg-[#237ab3] text-white text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-2"
                >
                    <Save size={16} />
                    Cập Nhật
                    {changes > 0 && <span className="bg-white/20 px-1.5 rounded text-xs">{changes}</span>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};