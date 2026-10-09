import React from 'react';
import { 
  Compass, 
  Scan, 
  BookOpen, 
  BarChart2 
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'today',
      label: 'TODAY',
      icon: <Compass size={19} strokeWidth={2.2} />,
    },
    {
      id: 'scan',
      label: 'AI SCAN',
      icon: <Scan size={19} strokeWidth={2.2} />,
    },
    {
      id: 'log',
      label: 'LOG',
      icon: <BookOpen size={19} strokeWidth={2.2} />,
    },
    {
      id: 'summary',
      label: 'SUMMARY',
      icon: <BarChart2 size={19} strokeWidth={2.2} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E6EA] shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
                isActive ? 'text-[#111315]' : 'text-[#8395A7] hover:text-[#46607f]'
              }`}
            >
              <div className="relative mb-0.5 transition-transform active:scale-95">
                {item.icon}
              </div>

              <span className={`text-[9px] font-bold tracking-[0.16em] uppercase font-telemetry transition-colors ${
                isActive ? 'text-[#111315]' : 'text-[#8395A7]'
              }`}>
                {item.label}
              </span>

              {/* Active Indicator Dot under active label */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#111315] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
