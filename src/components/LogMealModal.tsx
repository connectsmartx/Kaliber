import React, { useState } from 'react';
import { X, Check, Search, Sparkles } from 'lucide-react';
import { MealItem } from '../types';

interface LogMealModalProps {
  initialSlot?: string;
  onClose: () => void;
  onSaveMeal: (meal: MealItem) => void;
}

const NORDIC_QUICK_PRESETS = [
  { name: 'Finnish Salmon Soup (Lohikeitto)', cal: 480, p: 32, c: 26, f: 28, icon: 'bowl' },
  { name: 'Crispbread with Jarlsberg & Cucumber', cal: 210, p: 12, c: 18, f: 9, icon: 'egg' },
  { name: 'Karelian Pastry with Egg Butter', cal: 260, p: 8, c: 34, f: 11, icon: 'egg' },
  { name: 'Icelandic Cod Fillet & Steamed Asparagus', cal: 390, p: 48, c: 12, f: 6, icon: 'utensils' },
  { name: 'Nordic Forest Berry Bowl & Chia', cal: 180, p: 6, c: 28, f: 4, icon: 'berry' },
  { name: 'Reindeer Stew with Root Mash', cal: 560, p: 44, c: 38, f: 18, icon: 'utensils' },
];

export const LogMealModal: React.FC<LogMealModalProps> = ({
  initialSlot = 'dinner',
  onClose,
  onSaveMeal,
}) => {
  const [slot, setSlot] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>(
    (initialSlot as any) || 'dinner'
  );
  const [name, setName] = useState('');
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [calories, setCalories] = useState<number | ''>(450);
  const [protein, setProtein] = useState<number | ''>(35);
  const [carbs, setCarbs] = useState<number | ''>(40);
  const [fat, setFat] = useState<number | ''>(15);

  const slotLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snack: 'Snack',
    dinner: 'Dinner',
  };

  const handleSelectPreset = (preset: typeof NORDIC_QUICK_PRESETS[0]) => {
    setName(preset.name);
    setCalories(preset.cal);
    setProtein(preset.p);
    setCarbs(preset.c);
    setFat(preset.f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMeal: MealItem = {
      id: `meal-${Date.now()}`,
      slot,
      slotName: slotLabels[slot],
      time: time || '19:30',
      name: name.trim(),
      description: 'Logged via Precision Ledger',
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      iconType: slot === 'breakfast' ? 'egg' : slot === 'lunch' ? 'bowl' : slot === 'snack' ? 'berry' : 'utensils',
      logged: true,
    };

    onSaveMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#E2E6EA] shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E6EA]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8395A7] font-telemetry">
              MANUAL RATION ENTRY
            </span>
            <h3 className="text-[17px] font-bold text-[#111315]">Log Telemetry Record</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1F3F5] text-[#8395A7] hover:text-[#111315] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Slot selector */}
          <div>
            <label className="text-[11px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1.5">
              Ration Slot
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-[#F1F3F5] p-1 rounded-xl border border-[#E2E6EA]">
              {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    slot === s
                      ? 'bg-white text-[#111315] shadow-xs'
                      : 'text-[#8395A7] hover:text-[#111315]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Name */}
          <div>
            <label className="text-[11px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1.5">
              Meal Name / Composition
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Poached Trout & Rye Crisps"
              className="w-full bg-[#F8F9FA] border border-[#E2E6EA] rounded-xl px-3 py-2.5 text-sm text-[#111315] focus:outline-none focus:border-[#111315] transition-colors"
            />
          </div>

          {/* Quick Nordic Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8395A7] font-telemetry flex items-center gap-1">
                <Sparkles size={12} className="text-[#2563eb]" />
                Nordic Catalog Quick Select
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {NORDIC_QUICK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="bg-[#F8F9FA] hover:bg-[#F1F3F5] border border-[#E2E6EA] px-2.5 py-1.5 rounded-lg text-left shrink-0 transition-colors"
                >
                  <div className="text-[11px] font-medium text-[#111315] whitespace-nowrap">
                    {p.name}
                  </div>
                  <div className="text-[9px] text-[#8395A7] font-telemetry">
                    {p.cal} kcal • P:{p.p}g
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time & Calories */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1.5">
                Timestamp
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-[#E2E6EA] rounded-xl px-3 py-2 text-sm font-telemetry text-[#111315]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1.5">
                Energy (Kcal)
              </label>
              <input
                type="number"
                min="0"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#F8F9FA] border border-[#E2E6EA] rounded-xl px-3 py-2 text-sm font-telemetry font-bold text-[#111315]"
              />
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E2E6EA]">
              <label className="text-[9px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-[#E2E6EA] rounded-lg px-2 py-1 text-xs font-telemetry font-bold text-[#111315]"
              />
            </div>

            <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E2E6EA]">
              <label className="text-[9px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-[#E2E6EA] rounded-lg px-2 py-1 text-xs font-telemetry font-bold text-[#111315]"
              />
            </div>

            <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E2E6EA]">
              <label className="text-[9px] font-bold text-[#8395A7] uppercase tracking-wider font-telemetry block mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                value={fat}
                onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-[#E2E6EA] rounded-lg px-2 py-1 text-xs font-telemetry font-bold text-[#111315]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E2E6EA] text-xs font-semibold text-[#8395A7] hover:text-[#111315] hover:bg-[#F8F9FA] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#111315] text-white text-xs font-bold font-telemetry flex items-center justify-center gap-1.5 hover:bg-[#2C3036] shadow-md transition-all cursor-pointer"
            >
              <Check size={14} />
              Confirm Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
