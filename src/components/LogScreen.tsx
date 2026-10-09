import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  Filter, 
  Egg, 
  Soup, 
  UtensilsCrossed,
  Droplet
} from 'lucide-react';
import { MealItem } from '../types';

interface LogScreenProps {
  meals: MealItem[];
  onOpenLogModal: (slot?: string) => void;
  onMealClick: (meal: MealItem) => void;
  onDeleteMeal: (id: string) => void;
  waterIntake: number;
}

export const LogScreen: React.FC<LogScreenProps> = ({
  meals,
  onOpenLogModal,
  onMealClick,
  onDeleteMeal,
  waterIntake,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeals = meals.filter((meal) => {
    if (filter !== 'all' && meal.slot !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        meal.name.toLowerCase().includes(q) ||
        meal.description.toLowerCase().includes(q) ||
        meal.slotName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCalories = meals.reduce((sum, m) => sum + (m.logged ? m.calories : 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.logged ? m.protein : 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.logged ? m.carbs : 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.logged ? m.fat : 0), 0);

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-md mx-auto w-full px-4 pt-3">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-telemetry text-[#8395A7] font-semibold">
            CHRONOLOGICAL ARCHIVE
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#111315]">
            Ration Ledger
          </h1>
        </div>

        <button
          onClick={() => onOpenLogModal()}
          className="bg-[#111315] hover:bg-[#2C3036] text-white px-3 py-2 rounded-xl text-xs font-bold font-telemetry flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>New Entry</span>
        </button>
      </header>

      {/* Daily Quick Summary Pod */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 shadow-[0_1px_3px_rgba(17,19,21,0.02)] space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#111315]">Today's Recorded Aggregate</span>
          <span className="font-bold text-[#111315] font-telemetry text-sm">
            {totalCalories.toLocaleString()} kcal
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#E2E6EA] text-center">
          <div className="bg-[#F8F9FA] p-2 rounded-xl border border-[#E2E6EA]">
            <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">Protein</div>
            <div className="text-xs font-bold text-[#111315] font-telemetry">{totalProtein}g</div>
          </div>
          <div className="bg-[#F8F9FA] p-2 rounded-xl border border-[#E2E6EA]">
            <div className="text-[9px] uppercase tracking-wider text-[#46607f] font-telemetry">Carbs</div>
            <div className="text-xs font-bold text-[#111315] font-telemetry">{totalCarbs}g</div>
          </div>
          <div className="bg-[#F8F9FA] p-2 rounded-xl border border-[#E2E6EA]">
            <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">Fat</div>
            <div className="text-xs font-bold text-[#111315] font-telemetry">{totalFat}g</div>
          </div>
          <div className="bg-[#F8F9FA] p-2 rounded-xl border border-[#E2E6EA]">
            <div className="text-[9px] uppercase tracking-wider text-[#2563eb] font-telemetry">Water</div>
            <div className="text-xs font-bold text-[#2563eb] font-telemetry">{waterIntake}ml</div>
          </div>
        </div>
      </div>

      {/* Search & Slot Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8395A7]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, ingredients, slots..."
            className="w-full bg-white border border-[#E2E6EA] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#111315] focus:outline-none focus:border-[#111315] transition-colors"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['all', 'breakfast', 'lunch', 'snack', 'dinner'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize shrink-0 transition-all ${
                filter === s
                  ? 'bg-[#111315] text-white shadow-xs'
                  : 'bg-white text-[#8395A7] border border-[#E2E6EA] hover:text-[#111315]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-2.5">
        {filteredMeals.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#E2E6EA] text-xs text-[#8395A7]">
            No records matched your criteria.
          </div>
        ) : (
          filteredMeals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => onMealClick(meal)}
              className={`bg-white rounded-xl border transition-all p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer group ${
                meal.logged ? 'border-[#E2E6EA] hover:border-[#8395A7]' : 'border-dashed border-[#c5c6ca] bg-[#fbfcfc]'
              }`}
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
                  <div className="text-[11px] text-[#8395A7] line-clamp-1 max-w-[200px]">
                    {meal.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#111315] font-telemetry">
                    {meal.calories}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-[#8395A7] font-telemetry">
                    KCAL
                  </div>
                </div>

                {meal.logged && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMeal(meal.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-rose-500 rounded-md transition-opacity"
                    title="Remove entry"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
