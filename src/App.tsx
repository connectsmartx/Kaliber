import React, { useState } from 'react';
import { TabType, MealItem } from './types';
import { INITIAL_MEALS } from './data';
import { TodayScreen } from './components/TodayScreen';
import { PrecisionScanScreen } from './components/PrecisionScanScreen';
import { WeeklyLedgerScreen } from './components/WeeklyLedgerScreen';
import { LogScreen } from './components/LogScreen';
import { BottomNav } from './components/BottomNav';
import { LogMealModal } from './components/LogMealModal';
import { MealDetailModal } from './components/MealDetailModal';
import { ReportModal } from './components/ReportModal';
import { LoginScreen } from './components/LoginScreen';
import { ProfileDrawer } from './components/ProfileDrawer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('today');
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [waterIntake, setWaterIntake] = useState<number>(1750);

  // Operator / Auth state
  const [operator, setOperator] = useState({
    name: 'Auden Berg',
    email: 'auden.berg@kaliber.io',
    isPro: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoginScreenOpen, setIsLoginScreenOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<string>('dinner');
  const [activeMealDetail, setActiveMealDetail] = useState<MealItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Water increment
  const handleAddWater = (amount: number) => {
    setWaterIntake((prev) => prev + amount);
  };

  // Add / replace meal
  const handleSaveMeal = (newMeal: MealItem) => {
    setMeals((prev) => {
      const existingSlotIndex = prev.findIndex((m) => m.slot === newMeal.slot && !m.logged);
      if (existingSlotIndex !== -1) {
        const updated = [...prev];
        updated[existingSlotIndex] = newMeal;
        return updated;
      }
      const existingIdIndex = prev.findIndex((m) => m.id === newMeal.id);
      if (existingIdIndex !== -1) {
        const updated = [...prev];
        updated[existingIdIndex] = newMeal;
        return updated;
      }
      return [...prev, newMeal];
    });
  };

  // Delete meal
  const handleDeleteMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            name: 'Not recorded yet',
            description: 'Awaiting intake telemetry',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            logged: false,
          };
        }
        return m;
      })
    );
  };

  const handleOpenLogMeal = (slot?: string) => {
    if (slot) setTargetSlot(slot);
    setIsLogModalOpen(true);
  };

  const handleOpenProfile = () => {
    if (!isAuthenticated) {
      setIsLoginScreenOpen(true);
    } else {
      setIsProfileDrawerOpen(true);
    }
  };

  const handleLoginSuccess = (newOperator: { name: string; email: string; isPro: boolean; avatar: string }) => {
    setOperator(newOperator);
    setIsAuthenticated(true);
    setIsLoginScreenOpen(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setIsLoginScreenOpen(true);
  };

  // Aggregated totals
  const currentTotalCalories = meals.reduce((sum, m) => sum + (m.logged ? m.calories : 0), 0);
  const currentProtein = meals.reduce((sum, m) => sum + (m.logged ? m.protein : 0), 0);
  const currentCarbs = meals.reduce((sum, m) => sum + (m.logged ? m.carbs : 0), 0);
  const currentFat = meals.reduce((sum, m) => sum + (m.logged ? m.fat : 0), 0);

  // If login screen is explicitly opened or required
  if (isLoginScreenOpen) {
    return (
      <LoginScreen
        onBack={() => setIsLoginScreenOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] flex flex-col font-sans-clean">
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-x-hidden pt-2">
        {currentTab === 'today' && (
          <TodayScreen
            meals={meals}
            onOpenLogMeal={handleOpenLogMeal}
            onNavigateScan={() => setCurrentTab('scan')}
            waterIntake={waterIntake}
            onAddWater={handleAddWater}
            onMealClick={(meal) => setActiveMealDetail(meal)}
            onOpenProfile={handleOpenProfile}
            operatorAvatar={operator.avatar}
          />
        )}

        {currentTab === 'scan' && (
          <PrecisionScanScreen
            onMealLogged={handleSaveMeal}
            onNavigateToday={() => setCurrentTab('today')}
            onOpenProfile={handleOpenProfile}
            operatorAvatar={operator.avatar}
          />
        )}

        {currentTab === 'summary' && (
          <WeeklyLedgerScreen
            currentDayCalories={currentTotalCalories}
            currentProtein={currentProtein}
            currentCarbs={currentCarbs}
            currentFat={currentFat}
            waterIntake={waterIntake}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenProfile={handleOpenProfile}
            operatorAvatar={operator.avatar}
          />
        )}

        {currentTab === 'log' && (
          <LogScreen
            meals={meals}
            onOpenLogModal={handleOpenLogMeal}
            onMealClick={(meal) => {
              if (meal.logged) setActiveMealDetail(meal);
              else handleOpenLogMeal(meal.slot);
            }}
            onDeleteMeal={handleDeleteMeal}
            waterIntake={waterIntake}
          />
        )}
      </main>

      {/* Docked Navigation Bar */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Profile Terminal Drawer */}
      {isProfileDrawerOpen && (
        <ProfileDrawer
          operator={operator}
          onClose={() => setIsProfileDrawerOpen(false)}
          onGoToLogin={() => setIsLoginScreenOpen(true)}
          onSignOut={handleSignOut}
        />
      )}

      {/* Modals */}
      {isLogModalOpen && (
        <LogMealModal
          initialSlot={targetSlot}
          onClose={() => setIsLogModalOpen(false)}
          onSaveMeal={handleSaveMeal}
        />
      )}

      {activeMealDetail && (
        <MealDetailModal
          meal={activeMealDetail}
          onClose={() => setActiveMealDetail(null)}
          onDeleteMeal={handleDeleteMeal}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          onClose={() => setIsReportModalOpen(false)}
          meals={meals}
          waterIntake={waterIntake}
        />
      )}
    </div>
  );
}
