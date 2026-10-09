import React, { useState } from 'react';
import { X, Download, Check, ShieldCheck, Printer, Share2 } from 'lucide-react';
import { MealItem } from '../types';

interface ReportModalProps {
  onClose: () => void;
  meals: MealItem[];
  waterIntake: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  onClose,
  meals,
  waterIntake,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const totalCalories = meals.reduce((sum, m) => sum + (m.logged ? m.calories : 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.logged ? m.protein : 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.logged ? m.carbs : 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.logged ? m.fat : 0), 0);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#E2E6EA] shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E6EA]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#111315] flex items-center justify-center text-white text-[10px] font-bold font-telemetry">
              K
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-tight text-[#111315]">
                Kaliber Nordic Horology
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">
                TELEMETRY LEDGER CERTIFICATE
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F3F5] text-[#8395A7] hover:text-[#111315] flex items-center justify-center"
          >
            <X size={15} />
          </button>
        </div>

        {/* Certificate Card */}
        <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-4 space-y-3 font-telemetry text-xs">
          <div className="flex justify-between items-baseline border-b border-[#E2E6EA] pb-2">
            <span className="text-[#8395A7] uppercase tracking-wider text-[10px]">Folio No.</span>
            <span className="font-bold text-[#111315]">42-OCT-2026-W43</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-[#E2E6EA] pb-2">
            <span className="text-[#8395A7] uppercase tracking-wider text-[10px]">Client Reference</span>
            <span className="font-bold text-[#111315]">Nordic Health • REF. 04</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-[#E2E6EA] pb-2">
            <span className="text-[#8395A7] uppercase tracking-wider text-[10px]">Mean Daily Burn</span>
            <span className="font-bold text-[#111315]">2,022 kcal / day (-8.4%)</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-[#E2E6EA] pb-2">
            <span className="text-[#8395A7] uppercase tracking-wider text-[10px]">Today's Recorded Ingest</span>
            <span className="font-bold text-[#2563eb]">{totalCalories.toLocaleString()} kcal (78%)</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-[#E2E6EA] pb-2">
            <span className="text-[#8395A7] uppercase tracking-wider text-[10px]">Hydration Integrity</span>
            <span className="font-bold text-[#111315]">{waterIntake.toLocaleString()} ml / 2,500 ml</span>
          </div>

          <div className="pt-1">
            <span className="text-[#8395A7] uppercase tracking-wider text-[10px] block mb-1">
              Macro Distribution
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded border border-[#E2E6EA]">
                <div className="text-[9px] text-[#8395A7]">PROTEIN</div>
                <div className="text-xs font-bold text-[#111315]">{totalProtein}g (30%)</div>
              </div>
              <div className="bg-white p-2 rounded border border-[#E2E6EA]">
                <div className="text-[9px] text-[#8395A7]">CARBOHYDRATES</div>
                <div className="text-xs font-bold text-[#111315]">{totalCarbs}g (45%)</div>
              </div>
              <div className="bg-white p-2 rounded border border-[#E2E6EA]">
                <div className="text-[9px] text-[#8395A7]">LIPIDS</div>
                <div className="text-xs font-bold text-[#111315]">{totalFat}g (25%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification stamp */}
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px]">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span>Cryptographically validated by Kaliber Horological Kernel</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E2E6EA] text-xs font-semibold text-[#46607f] hover:bg-[#F8F9FA] transition-colors"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-[#111315] text-white text-xs font-bold font-telemetry flex items-center justify-center gap-2 hover:bg-[#2C3036] transition-colors shadow-md"
          >
            {downloaded ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span>Ledger Report Downloaded</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download PDF Ledger</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
