export interface MealItem {
  id: string;
  slot: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  slotName: string;
  time: string;
  name: string;
  description: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  iconType: 'egg' | 'bowl' | 'berry' | 'utensils';
  logged: boolean;
}

export interface DayData {
  dayKey: string;
  dayShort: string;
  label: string;
  calories: number;
  displayKcal: string;
  isToday?: boolean;
  hasData: boolean;
  protein: number;
  carbs: number;
  fat: number;
  waterReached: boolean;
}

export interface ScannedFoodComponent {
  id: string;
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  icon: string;
}

export type TabType = 'today' | 'scan' | 'log' | 'summary';
