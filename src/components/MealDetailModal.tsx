import React from 'react';
import { X, Trash2, Clock, Flame, PieChart, ShieldCheck } from 'lucide-react';
import { MealItem } from '../types';

interface MealDetailModalProps {
  meal: MealItem | null;
  onClose: () => void;
  onDeleteMeal: (id: string) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  onClose,
  onDeleteMeal,
}) => {
  if (!meal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-[#E2E6EA] shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E6EA]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#46607f] font-telemetry">
              {meal.slotName}
            </span>
            <span className="text-[11px] text-[#8395A7] font-telemetry">• {meal.time}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F3F5] text-[#8395A7] hover:text-[#111315] flex items-center justify-center"
          >
            <X size={15} />
          </button>
        </div>

        {/* Meal Info */}
        <div>
          <h3 className="text-[18px] font-bold text-[#111315] tracking-tight">{meal.name}</h3>
          <p className="text-[12px] text-[#8395A7] mt-1 leading-relaxed">{meal.description}</p>
        </div>

        {/* Energy Card */}
        <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#46607f]">
            <Flame size={18} />
            <span className="text-xs font-semibold">Total Caloric Intake</span>
          </div>
          <div className="text-[20px] font-bold text-[#111315] font-telemetry">
            {meal.calories} <span className="text-xs font-normal text-[#8395A7]">kcal</span>
          </div>
        </div>

        {/* Macronutrient Breakdown */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8395A7] font-telemetry">
            Calibrated Macronutrients
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F8F9FA] rounded-xl p-2.5 border border-[#E2E6EA] text-center">
              <span className="text-[9px] uppercase font-telemetry text-[#8395A7]">Protein</span>
              <div className="text-[15px] font-bold text-[#111315] font-telemetry">{meal.protein}g</div>
            </div>
            <div className="bg-[#F8F9FA] rounded-xl p-2.5 border border-[#E2E6EA] text-center">
              <span className="text-[9px] uppercase font-telemetry text-[#46607f]">Carbs</span>
              <div className="text-[15px] font-bold text-[#111315] font-telemetry">{meal.carbs}g</div>
            </div>
            <div className="bg-[#F8F9FA] rounded-xl p-2.5 border border-[#E2E6EA] text-center">
              <span className="text-[9px] uppercase font-telemetry text-[#8395A7]">Fat</span>
              <div className="text-[15px] font-bold text-[#111315] font-telemetry">{meal.fat}g</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              onDeleteMeal(meal.id);
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#111315] text-white text-xs font-bold font-telemetry hover:bg-[#2C3036] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
