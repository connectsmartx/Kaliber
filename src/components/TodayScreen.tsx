import React, { useState } from 'react';
import { 
  Droplet, 
  CupSoda, 
  FlaskConical, 
  PieChart, 
  Clock, 
  Plus, 
  Check, 
  Sparkles,
  UtensilsCrossed,
  Soup,
  Egg,
  Coffee
} from 'lucide-react';
import { MealItem } from '../types';

interface TodayScreenProps {
  meals: MealItem[];
  onOpenLogMeal: (slot?: string) => void;
  onNavigateScan: () => void;
  waterIntake: number;
  onAddWater: (amount: number) => void;
  onMealClick: (meal: MealItem) => void;
  onOpenProfile: () => void;
  operatorAvatar?: string;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  meals,
  onOpenLogMeal,
  onNavigateScan,
  waterIntake,
  onAddWater,
  onMealClick,
  onOpenProfile,
  operatorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80",
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate totals from meals
  const targetCalories = 2200;
  const currentCalories = meals.reduce((sum, m) => sum + (m.logged ? m.calories : 0), 0);
  const caloriesLeft = Math.max(0, targetCalories - currentCalories);
  const caloriePercent = Math.min(100, Math.round((currentCalories / targetCalories) * 100));

  // Hydration
  const waterTarget = 2500;
  const waterPercent = Math.min(100, Math.round((waterIntake / waterTarget) * 100));

  // Macros
  const proteinTarget = 140;
  const carbsTarget = 230;
  const fatTarget = 65;

  const currentProtein = meals.reduce((sum, m) => sum + (m.logged ? m.protein : 0), 0);
  const currentCarbs = meals.reduce((sum, m) => sum + (m.logged ? m.carbs : 0), 0);
  const currentFat = meals.reduce((sum, m) => sum + (m.logged ? m.fat : 0), 0);

  const proteinPercent = Math.min(100, Math.round((currentProtein / proteinTarget) * 100));
  const carbsPercent = Math.min(100, Math.round((currentCarbs / carbsTarget) * 100));
  const fatPercent = Math.min(100, Math.round((currentFat / fatTarget) * 100));

  const recordedCount = meals.filter(m => m.logged).length;

  const handleWaterClick = (amount: number, label: string) => {
    onAddWater(amount);
    setToastMessage(`+${amount} ml recorded (${label})`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // SVG Circular Gauge calculation
  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  return (
    <div className="flex flex-col gap-5 pb-24 max-w-md mx-auto w-full px-4 pt-3">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#111315] text-white text-xs px-4 py-2 rounded-full shadow-lg font-telemetry tracking-wide flex items-center gap-2 animate-bounce">
          <Check size={14} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-telemetry text-[#8395A7] flex items-center gap-1.5 font-semibold">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#46607f]"></span>
            DAILY METRICS • REF. 04
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#111315] flex items-baseline gap-2 mt-0.5">
            Kaliber
            <span className="text-[13px] font-normal text-[#8395A7]">Thursday, 18 Oct</span>
          </h1>
        </div>

        {/* Profile Chip */}
        <button
          type="button"
          onClick={onOpenProfile}
          title="Open Operator Profile"
          className="flex items-center gap-2 bg-white pl-3 pr-1 py-1 rounded-full border border-[#E2E6EA] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#111315] hover:shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-medium text-[#111315]">Active</span>
          <img
            src={operatorAvatar}
            alt="User profile"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E2E6EA]"
          />
        </button>
      </header>

      {/* CORE SYNTHESIS Card */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)]">
        {/* Section Title & Target Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8395A7] font-telemetry">
            CORE SYNTHESIS
          </span>
          <span className="text-[11px] font-semibold text-[#46607f] bg-[#F1F3F5] px-2.5 py-1 rounded-md border border-[#E2E6EA] font-telemetry">
            {caloriePercent}% Target Met
          </span>
        </div>

        {/* Dual Gauges: Calories + Hydration */}
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          {/* Calorie Dial Card */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3.5 flex flex-col items-center justify-between text-center relative">
            <div className="relative w-32 h-32 flex items-center justify-center my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                {/* Background Ring */}
                <circle
                  cx="65"
                  cy="65"
                  r={circleRadius}
                  stroke="#E2E6EA"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Arc */}
                <circle
                  cx="65"
                  cy="65"
                  r={circleRadius}
                  stroke="#111315"
                  strokeWidth="8.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Inside dial text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8395A7] font-telemetry">
                  INTAKE
                </span>
                <span className="text-[20px] font-bold text-[#111315] font-telemetry leading-tight mt-0.5">
                  {currentCalories.toLocaleString()}
                </span>
                <span className="text-[11px] font-medium text-[#8395A7] font-telemetry">
                  / {targetCalories.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-1">
              <div className="text-[13px] font-semibold text-[#111315]">Calories</div>
              <div className="text-[11px] text-[#8395A7] font-telemetry mt-0.5">
                {caloriesLeft} kcal left
              </div>
            </div>
          </div>

          {/* Hydration Card */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#111315]">Hydration</span>
                <Droplet size={15} className="text-[#46607f] fill-[#46607f]/20" />
              </div>
              <span className="text-[11px] text-[#8395A7] font-telemetry">Target 2.5L</span>
            </div>

            {/* Cylinder reservoir + Readout */}
            <div className="flex items-center gap-3 my-2">
              {/* Capsule Cylinder */}
              <div className="w-9 h-24 bg-[#E2E6EA] rounded-full p-1 relative flex flex-col justify-end overflow-hidden">
                <div 
                  className="w-full bg-[#46607f] rounded-full transition-all duration-700 ease-out relative"
                  style={{ height: `${Math.min(100, Math.max(12, waterPercent))}%` }}
                >
                  {/* Subtle fluid reflection */}
                  <div className="absolute top-1 left-1 right-1 h-1.5 bg-white/20 rounded-full"></div>
                </div>
              </div>

              {/* Value and Status */}
              <div className="flex flex-col">
                <div className="text-[18px] font-bold text-[#111315] font-telemetry leading-none flex items-baseline gap-1">
                  {waterIntake.toLocaleString()}
                  <span className="text-[11px] font-medium text-[#8395A7]">ml</span>
                </div>
                <div className="text-[11px] font-semibold text-[#46607f] font-telemetry mt-1">
                  {waterPercent}% Reached
                </div>
                <div className="text-[10px] text-[#8395A7] leading-tight mt-1">
                  Hydration status balanced
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Hydration Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleWaterClick(250, 'Glass')}
            className="flex items-center justify-between bg-white hover:bg-[#F8F9FA] active:scale-[0.98] border border-[#E2E6EA] rounded-xl px-3.5 py-2.5 transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] flex items-center justify-center text-[#46607f] group-hover:bg-[#E2E6EA]">
                <CupSoda size={16} />
              </div>
              <div>
                <div className="text-[12px] font-bold text-[#111315] font-telemetry">+250 ml</div>
                <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">GLASS</div>
              </div>
            </div>
            <Plus size={15} className="text-[#8395A7] group-hover:text-[#111315]" />
          </button>

          <button
            onClick={() => handleWaterClick(500, 'Flask')}
            className="flex items-center justify-between bg-white hover:bg-[#F8F9FA] active:scale-[0.98] border border-[#E2E6EA] rounded-xl px-3.5 py-2.5 transition-all text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] flex items-center justify-center text-[#46607f] group-hover:bg-[#E2E6EA]">
                <FlaskConical size={16} />
              </div>
              <div>
                <div className="text-[12px] font-bold text-[#111315] font-telemetry">+500 ml</div>
                <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">FLASK</div>
              </div>
            </div>
            <Plus size={15} className="text-[#8395A7] group-hover:text-[#111315]" />
          </button>
        </div>
      </div>

      {/* MACRONUTRIENTS Card */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-[#111315] font-telemetry">
            <PieChart size={14} className="text-[#111315]" />
            MACRONUTRIENTS
          </div>
          <span className="text-[10px] font-semibold text-[#8395A7] font-telemetry tracking-wider">
            RATIO 40 • 40 • 20
          </span>
        </div>

        {/* 3 Macro Pods */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Protein */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-[#111315]">Protein</span>
              <span className="text-[10px] text-[#8395A7] font-telemetry">{proteinPercent}%</span>
            </div>
            <div className="text-[18px] font-bold text-[#111315] font-telemetry leading-tight my-1">
              {currentProtein}
              <span className="text-[10px] font-normal text-[#8395A7] ml-0.5">/{proteinTarget}g</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#E2E6EA] h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-[#111315] h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-[#111315]">Carbs</span>
              <span className="text-[10px] text-[#8395A7] font-telemetry">{carbsPercent}%</span>
            </div>
            <div className="text-[18px] font-bold text-[#111315] font-telemetry leading-tight my-1">
              {currentCarbs}
              <span className="text-[10px] font-normal text-[#8395A7] ml-0.5">/{carbsTarget}g</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#E2E6EA] h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-[#46607f] h-full rounded-full transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-[#111315]">Fat</span>
              <span className="text-[10px] text-[#8395A7] font-telemetry">{fatPercent}%</span>
            </div>
            <div className="text-[18px] font-bold text-[#111315] font-telemetry leading-tight my-1">
              {currentFat}
              <span className="text-[10px] font-normal text-[#8395A7] ml-0.5">/{fatTarget}g</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#E2E6EA] h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-[#8395A7] h-full rounded-full transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RATION TIMELINE Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-[#111315] font-telemetry">
            <Clock size={14} className="text-[#111315]" />
            RATION TIMELINE
          </div>
          <span className="text-[10px] font-semibold text-[#8395A7] font-telemetry tracking-wider">
            {recordedCount} OF 4 RECORDED
          </span>
        </div>

        {/* Timeline items */}
        <div className="flex flex-col gap-2.5">
          {meals.map((meal) => {
            if (meal.logged) {
              return (
                <div
                  key={meal.id}
                  onClick={() => onMealClick(meal)}
                  className="bg-white rounded-xl border border-[#E2E6EA] p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#8395A7] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F3F5] flex items-center justify-center text-[#46607f] shrink-0 group-hover:bg-[#E2E6EA]">
                      {meal.iconType === 'egg' && <Egg size={18} />}
                      {meal.iconType === 'bowl' && <Soup size={18} />}
                      {meal.iconType === 'berry' && <Sparkles size={18} />}
                      {meal.iconType === 'utensils' && <UtensilsCrossed size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#111315]">{meal.slotName}</span>
                        <span className="text-[11px] text-[#8395A7] font-telemetry">{meal.time}</span>
                      </div>
                      <div className="text-[11px] text-[#8395A7] truncate max-w-[190px] sm:max-w-[220px]">
                        {meal.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[14px] font-bold text-[#111315] font-telemetry">
                      {meal.calories}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">
                      KCAL
                    </div>
                  </div>
                </div>
              );
            }

            // Unrecorded slot (Dinner)
            return (
              <div
                key={meal.id}
                className="bg-transparent rounded-xl border border-dashed border-[#c5c6ca] p-3.5 flex items-center justify-between hover:bg-white/70 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenLogMeal(meal.slot)}
                    className="w-10 h-10 rounded-xl bg-white border border-[#E2E6EA] flex items-center justify-center text-[#8395A7] hover:text-[#111315] hover:border-[#111315] transition-all"
                  >
                    <Plus size={18} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#111315]">{meal.slotName}</span>
                      <span className="text-[11px] text-[#8395A7] font-telemetry">{meal.time}</span>
                    </div>
                    <div className="text-[11px] text-[#8395A7]">Not recorded yet</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onNavigateScan}
                    className="text-[11px] font-medium text-[#46607f] hover:text-[#111315] px-2.5 py-1.5 rounded-lg border border-[#E2E6EA] bg-white transition-all shadow-xs"
                  >
                    AI Scan
                  </button>
                  <button
                    onClick={() => onOpenLogMeal(meal.slot)}
                    className="text-[12px] font-semibold text-[#111315] hover:text-[#46607f] px-2 py-1.5 transition-all"
                  >
                    Log meal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
