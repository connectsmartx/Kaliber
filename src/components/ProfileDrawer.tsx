import React from 'react';
import { 
  X, 
  ShieldCheck, 
  LogOut, 
  UserCheck, 
  KeyRound, 
  Sliders, 
  Zap, 
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface OperatorProfile {
  name: string;
  email: string;
  isPro: boolean;
  avatar: string;
}

interface ProfileDrawerProps {
  operator: OperatorProfile;
  onClose: () => void;
  onGoToLogin: () => void;
  onSignOut: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  operator,
  onClose,
  onGoToLogin,
  onSignOut,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-[#E2E6EA] shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E6EA]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8395A7] font-telemetry">
              OPERATOR TERMINAL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F3F5] text-[#8395A7] hover:text-[#111315] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E6EA]">
          <img
            src={operator.avatar}
            alt={operator.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[16px] font-bold text-[#111315] truncate">{operator.name}</h3>
              {operator.isPro && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#111315] text-white px-1.5 py-0.5 rounded-sm font-telemetry">
                  PRO
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#8395A7] font-telemetry truncate">
              {operator.email}
            </div>
            <div className="text-[10px] text-emerald-600 font-telemetry font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={11} />
              Session Authenticated (30d)
            </div>
          </div>
        </div>

        {/* Telemetry Configuration Badges */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8395A7] font-telemetry">
            Calibrated Baseline Specs
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E2E6EA]">
              <span className="text-[9px] text-[#8395A7] uppercase font-telemetry block">Daily Burn Goal</span>
              <span className="font-bold text-[#111315] font-telemetry text-sm">2,200 kcal</span>
            </div>
            <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E2E6EA]">
              <span className="text-[9px] text-[#8395A7] uppercase font-telemetry block">Hydration Target</span>
              <span className="font-bold text-[#46607f] font-telemetry text-sm">2,500 ml</span>
            </div>
          </div>
        </div>

        {/* Security & Access details */}
        <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E2E6EA] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              Biometric Access
            </span>
            <span className="text-[10px] font-telemetry font-bold text-emerald-600">Face ID Active</span>
          </div>
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <KeyRound size={14} className="text-[#46607f]" />
              Master Key Vault
            </span>
            <span className="text-[10px] font-telemetry text-[#8395A7]">AES-256 GCM</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onGoToLogin();
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-[#E2E6EA] hover:bg-[#F8F9FA] text-xs font-semibold text-[#111315] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Lock size={14} className="text-[#8395A7]" />
            <span>Switch Operator / View Sanctuary Login</span>
          </button>

          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Lock Session & Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
