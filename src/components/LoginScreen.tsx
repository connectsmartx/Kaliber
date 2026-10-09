import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Activity, 
  AtSign, 
  Lock, 
  Eye, 
  EyeOff, 
  ScanFace, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Apple 
} from 'lucide-react';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: (operator: { name: string; email: string; isPro: boolean; avatar: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('auden.berg@kaliber.io');
  const [passkey, setPasskey] = useState('architectural_kaliber_2026');
  const [showPassword, setShowPassword] = useState(false);
  const [keepActive, setKeepActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [faceIdSuccess, setFaceIdSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Operator ID is required.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Auden Berg',
        email: email,
        isPro: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
      });
    }, 700);
  };

  const handleFaceId = () => {
    setFaceIdSuccess(true);
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Auden Berg',
        email: 'auden.berg@kaliber.io',
        isPro: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
      });
    }, 900);
  };

  const handleFastAuth = (provider: 'Apple' | 'Google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: provider === 'Apple' ? 'Auden Berg (Apple ID)' : 'Auden Berg (Google)',
        email: email,
        isPro: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between max-w-md mx-auto w-full px-5 py-4 select-none">
      <div className="space-y-6">
        {/* Status Bar info */}
        <div className="flex items-center justify-between text-[11px] font-telemetry pt-1">
          <span className="font-semibold text-[#111315]">09:41</span>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-widest text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SECURE NODE
          </div>
        </div>

        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-[#E2E6EA] flex items-center justify-center text-[#111315] hover:bg-[#F1F3F5] transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="bg-white/80 border border-[#E2E6EA] rounded-full px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] uppercase text-[#8395A7] font-telemetry shadow-xs">
            SYS. AUTH V2.4
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-3 pt-2">
          {/* Logo icon + title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#111315] flex items-center justify-center text-white shadow-sm">
              <Activity size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-extrabold text-[#111315] tracking-tight">Kaliber</span>
                <span className="text-[9px] font-bold tracking-wider uppercase text-white bg-[#46607f] px-1.5 py-0.5 rounded-sm font-telemetry">
                  PRO
                </span>
              </div>
              <div className="text-[11px] text-[#8395A7] font-medium leading-tight">
                Architectural Nutrition & Telemetry
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="pt-2">
            <h1 className="text-[24px] font-bold tracking-tight text-[#111315]">
              Access Your Sanctuary
            </h1>
            <p className="text-[12px] text-[#8395A7] leading-relaxed mt-1">
              Enter your calibrated credentials to synchronize your daily rations and hydration ledger.
            </p>
          </div>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl font-telemetry">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Operator ID / Email */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-telemetry">
              <span className="font-bold text-[#111315] tracking-wider">OPERATOR ID / EMAIL</span>
              <span className="text-[#8395A7] tracking-wider">ENCRYPTED</span>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8395A7]">
                <AtSign size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@kaliber.io"
                className="w-full bg-white border border-[#E2E6EA] rounded-xl pl-10 pr-3.5 py-3 text-sm text-[#111315] focus:outline-none focus:border-[#111315] font-telemetry shadow-xs transition-colors"
              />
            </div>
          </div>

          {/* Passkey / Master Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-telemetry">
              <span className="font-bold text-[#111315] tracking-wider">PASSKEY / MASTER KEY</span>
              <button
                type="button"
                onClick={() => alert('Master key recovery sent to calibrated operator terminal.')}
                className="text-[#8395A7] hover:text-[#111315] tracking-wider underline cursor-pointer"
              >
                Forgot key?
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8395A7]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="•••••••••••••"
                className="w-full bg-white border border-[#E2E6EA] rounded-xl pl-10 pr-10 py-3 text-sm text-[#111315] focus:outline-none focus:border-[#111315] font-telemetry shadow-xs transition-colors tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8395A7] hover:text-[#111315]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Session & Face ID row */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div 
                onClick={() => setKeepActive(!keepActive)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  keepActive ? 'bg-[#111315] border-[#111315] text-white' : 'border-[#c5c6ca] bg-white'
                }`}
              >
                {keepActive && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-[12px] text-[#111315] font-medium">
                Keep session active (30d)
              </span>
            </label>

            <button
              type="button"
              onClick={handleFaceId}
              className="flex items-center gap-1.5 text-[#46607f] hover:text-[#111315] text-[11px] font-telemetry font-semibold cursor-pointer active:scale-95 transition-all"
            >
              <ScanFace size={15} />
              <span>Face ID</span>
            </button>
          </div>

          {/* Sign In Primary CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111315] hover:bg-[#2C3036] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span className="font-telemetry">Synchronizing Sanctuary...</span>
            ) : faceIdSuccess ? (
              <span className="flex items-center gap-2 font-telemetry">
                <Check size={16} className="text-emerald-400" />
                Biometrics Calibrated
              </span>
            ) : (
              <>
                <span>Sign In to Kaliber</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2E6EA]" />
          </div>
          <span className="relative bg-[#F8F9FA] px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8395A7] font-telemetry">
            OR CALIBRATE WITH
          </span>
        </div>

        {/* Social auth options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleFastAuth('Apple')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#F8F9FA] active:scale-[0.98] border border-[#E2E6EA] rounded-xl py-2.5 px-3 transition-all text-xs font-semibold text-[#111315] shadow-xs cursor-pointer"
          >
            <Apple size={16} className="fill-current" />
            <span>Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleFastAuth('Google')}
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#F8F9FA] active:scale-[0.98] border border-[#E2E6EA] rounded-xl py-2.5 px-3 transition-all text-xs font-semibold text-[#111315] shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 pb-2 text-center space-y-3">
        <div className="text-[12px] text-[#8395A7]">
          Need a calibrated membership?{' '}
          <button 
            type="button"
            onClick={() => alert('Access request submitted to Kaliber Horology Concierge.')}
            className="font-bold text-[#111315] hover:underline cursor-pointer"
          >
            Request Access
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-telemetry text-[#8395A7]">
          <ShieldCheck size={12} className="text-[#8395A7]" />
          <span>AES-256 TELEMETRY VAULT</span>
        </div>
      </div>
    </div>
  );
};
