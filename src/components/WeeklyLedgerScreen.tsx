import React, { useState } from 'react';
import { 
  Bell, 
  BarChart2, 
  Compass, 
  Droplet, 
  Download, 
  Calendar, 
  ArrowDownRight, 
  Check, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { DayData } from '../types';
import { INITIAL_DAYS } from '../data';

interface WeeklyLedgerScreenProps {
  currentDayCalories: number;
  currentProtein: number;
  currentCarbs: number;
  currentFat: number;
  waterIntake: number;
  onOpenReportModal: () => void;
  onOpenProfile: () => void;
  operatorAvatar?: string;
}

export const WeeklyLedgerScreen: React.FC<WeeklyLedgerScreenProps> = ({
  currentDayCalories,
  currentProtein,
  currentCarbs,
  currentFat,
  waterIntake,
  onOpenReportModal,
  onOpenProfile,
  operatorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80",
}) => {
  const [days, setDays] = useState<DayData[]>(() => {
    return INITIAL_DAYS.map((d) => {
      if (d.isToday) {
        return {
          ...d,
          calories: currentDayCalories,
          displayKcal: (currentDayCalories / 1000).toFixed(1) + 'k',
          protein: currentProtein,
          carbs: currentCarbs,
          fat: currentFat,
          waterReached: waterIntake >= 2000,
        };
      }
      return d;
    });
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(4); // Friday by default
  const selectedDay = days[selectedDayIndex];

  const maxCalorieScale = 2500;
  const targetBaseline = 2200;

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-md mx-auto w-full px-4 pt-3">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          {/* Logo icon */}
          <div className="w-9 h-9 rounded-xl bg-[#111315] flex items-center justify-center text-white shadow-xs">
            <div className="w-4 h-4 border-2 border-white/90 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-xs"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold text-[#111315] tracking-tight">Kaliber</span>
              <span className="text-[9px] font-bold tracking-wider uppercase text-[#46607f] bg-[#F1F3F5] px-1.5 py-0.5 rounded border border-[#E2E6EA] font-telemetry">
                NORDIC
              </span>
            </div>
            <div className="text-[11px] text-[#8395A7] font-medium leading-tight">
              Architectural Health
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-white border border-[#E2E6EA] flex items-center justify-center text-[#46607f] hover:text-[#111315] hover:bg-[#F8F9FA] transition-all cursor-pointer">
            <Bell size={15} />
          </button>
          <button
            type="button"
            onClick={onOpenProfile}
            title="Open Operator Profile"
            className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#E2E6EA] hover:ring-[#111315] active:scale-95 transition-all cursor-pointer"
          >
            <img
              src={operatorAvatar}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Folio Ledger Card */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8395A7] font-telemetry">
            FOLIO NO. 42-OCT
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-[#0d9488] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0] font-telemetry">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]"></span>
            WEEK 43
          </span>
        </div>
        <h2 className="text-[21px] font-bold text-[#111315] tracking-tight mt-1">
          Weekly Dietary Ledger
        </h2>
      </div>

      {/* TELEMETRY MONITOR (Dark Slate Obsidian Card) */}
      <div className="bg-[#111315] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-[#2C3036] space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] font-telemetry">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            TELEMETRY MONITOR
          </div>
          <span className="text-[#8395A7] font-medium tracking-wider">
            TDEE BALANCE
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-[11px] text-[#8395A7] font-sans-clean font-medium">
              7–Day Mean Burn
            </div>
            <div className="text-[26px] font-bold tracking-tight font-telemetry flex items-baseline gap-1.5 mt-0.5">
              2,022
              <span className="text-[12px] font-normal text-[#8395A7]">kcal / day</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#1a2634] text-emerald-400 px-2.5 py-1.5 rounded-lg border border-[#2e4056] font-telemetry text-[11px] font-bold">
            <ArrowDownRight size={14} className="text-emerald-400" />
            <span>-8.4%</span>
            <span className="text-[9px] text-[#8395A7] uppercase ml-0.5 font-normal">SUB-TARGET</span>
          </div>
        </div>
      </div>

      {/* Caloric Barometers */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-[#2563eb]" />
            <h3 className="text-[15px] font-bold text-[#111315]">Caloric Barometers</h3>
          </div>
          <span className="text-[11px] text-[#8395A7] font-telemetry">
            Target: 2,200
          </span>
        </div>

        {/* Bar Chart Area */}
        <div className="relative pt-6 pb-2 px-1 bg-[#F8F9FA] rounded-xl border border-[#E2E6EA]">
          {/* Baseline Guideline */}
          <div 
            className="absolute inset-x-2 border-b border-dashed border-[#8395A7]/40 pointer-events-none flex justify-end"
            style={{ top: '24%' }}
          >
            <span className="text-[8px] uppercase tracking-wider text-[#8395A7] font-telemetry bg-[#F8F9FA] px-1 -translate-y-2">
              2,200 KCAL BASELINE
            </span>
          </div>

          {/* 7 Vertical Pillar Columns */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 items-end h-40">
            {days.map((day, idx) => {
              const heightPercent = day.hasData 
                ? Math.min(100, Math.round((day.calories / maxCalorieScale) * 100))
                : 0;

              const isSelected = selectedDayIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex flex-col items-center justify-end h-full cursor-pointer group relative"
                >
                  {/* Today Badge */}
                  {day.isToday && (
                    <div className="absolute -top-6 z-10 bg-[#111315] text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm font-telemetry shadow-xs">
                      TODAY
                    </div>
                  )}

                  {/* Pillar capsule container */}
                  <div className={`w-full max-w-[28px] h-32 rounded-full p-0.5 flex flex-col justify-end transition-all ${
                    day.isToday 
                      ? 'bg-blue-100/70 border border-blue-200' 
                      : day.hasData 
                        ? 'bg-[#E2E6EA]/70' 
                        : 'bg-[#E2E6EA]/40'
                  }`}>
                    {day.hasData ? (
                      <div
                        className={`w-full rounded-full transition-all duration-500 ${
                          day.isToday
                            ? 'bg-[#2563eb] shadow-sm'
                            : 'bg-[#46607f]'
                        } ${isSelected ? 'ring-2 ring-black/40 ring-offset-1' : ''}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    ) : (
                      <div className="w-full h-3 rounded-full bg-[#E2E6EA]" />
                    )}
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <div className={`text-[11px] font-bold ${
                      day.isToday ? 'text-[#2563eb]' : 'text-[#111315]'
                    }`}>
                      {day.dayKey}
                    </div>
                    <div className={`text-[9px] font-telemetry ${
                      day.isToday ? 'text-[#2563eb] font-semibold' : 'text-[#8395A7]'
                    }`}>
                      {day.displayKcal}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Telemetry Box */}
        <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#111315] font-medium">
            <Calendar size={14} className="text-[#8395A7]" />
            <span>
              Selected: {selectedDay.dayShort} {selectedDay.isToday ? '[Today]' : ''}
            </span>
          </div>
          <div className="text-[13px] font-bold text-[#111315] font-telemetry">
            {selectedDay.hasData ? `${selectedDay.calories.toLocaleString()} kcal` : 'No data'}
          </div>
          <div className="text-[10px] text-[#8395A7] font-telemetry">
            {selectedDay.hasData ? `P:${selectedDay.protein}g C:${selectedDay.carbs}g F:${selectedDay.fat}g` : '--'}
          </div>
        </div>
      </div>

      {/* Macro Compass */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#0d9488]" />
            <h3 className="text-[15px] font-bold text-[#111315]">Macro Compass</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8395A7] font-telemetry">
            CALIBRATED RATIO
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 py-2">
          {/* Donut Chart (SVG) */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Protein: 30% -> circumference = 2 * PI * 40 = 251.3 */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#0d9488"
                strokeWidth="8"
                strokeDasharray="238.7"
                strokeDashoffset="167" // 30%
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Carbs: 45% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#2563eb"
                strokeWidth="8"
                strokeDasharray="238.7"
                strokeDashoffset="131" // 45%
                transform="rotate(108 50 50)"
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Fat: 25% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#46607f"
                strokeWidth="8"
                strokeDasharray="238.7"
                strokeDashoffset="179" // 25%
                transform="rotate(270 50 50)"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#8395A7] font-telemetry">
                TDEE
              </span>
              <span className="text-[14px] font-bold text-[#111315] font-telemetry leading-none mt-0.5">
                100%
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-[#E2E6EA]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0d9488]"></span>
                <span className="text-[12px] font-medium text-[#111315]">Protein</span>
              </div>
              <span className="text-[12px] font-bold text-[#0d9488] font-telemetry">30%</span>
            </div>

            <div className="flex items-center justify-between bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-[#E2E6EA]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                <span className="text-[12px] font-medium text-[#111315]">Carbs</span>
              </div>
              <span className="text-[12px] font-bold text-[#2563eb] font-telemetry">45%</span>
            </div>

            <div className="flex items-center justify-between bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-[#E2E6EA]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#46607f]"></span>
                <span className="text-[12px] font-medium text-[#111315]">Fat</span>
              </div>
              <span className="text-[12px] font-bold text-[#46607f] font-telemetry">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Matrix */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet size={16} className="text-[#2563eb]" />
            <h3 className="text-[15px] font-bold text-[#111315]">Hydration Matrix</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full border border-[#bfdbfe] font-telemetry">
            5-DAY STREAK
          </span>
        </div>

        <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3.5 space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-telemetry">
            <span className="text-[#8395A7]">GOAL: 2,500 ML/DIEM</span>
            <span className="text-[#0d9488] font-bold">100% ON SCHEDULE</span>
          </div>

          {/* 7 Droplet Circles */}
          <div className="flex items-center justify-between px-1">
            {days.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  day.waterReached
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'bg-[#E2E6EA] text-[#8395A7]'
                }`}>
                  <Droplet size={14} className={day.waterReached ? 'fill-white' : ''} />
                </div>
                <span className={`text-[10px] font-telemetry font-bold ${
                  day.waterReached ? 'text-[#2563eb]' : 'text-[#8395A7]'
                }`}>
                  {day.dayKey}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export CTA Button */}
      <div className="pt-1 flex flex-col items-center gap-2">
        <button
          onClick={onOpenReportModal}
          className="w-full bg-[#111315] hover:bg-[#2C3036] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
        >
          <Download size={16} />
          <span>Export Weekly Ledger Report</span>
        </button>

        <div className="text-[9px] uppercase tracking-[0.2em] font-telemetry text-[#8395A7] text-center">
          CERTIFIED KALIBER HOROLOGICAL SYSTEM
        </div>
      </div>
    </div>
  );
};
