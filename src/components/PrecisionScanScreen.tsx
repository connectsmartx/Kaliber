import React, { useState, useRef, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Info, 
  Zap, 
  ZapOff, 
  Camera, 
  RefreshCw, 
  Check, 
  Utensils, 
  Grid3X3, 
  Leaf, 
  Sparkles,
  Minus,
  Plus,
  Video
} from 'lucide-react';
import { SCANNED_MEAL_PRESET, ALTERNATE_PRESETS } from '../data';
import { MealItem } from '../types';

interface PrecisionScanScreenProps {
  onMealLogged: (meal: MealItem) => void;
  onNavigateToday: () => void;
  onOpenProfile?: () => void;
  operatorAvatar?: string;
}

export const PrecisionScanScreen: React.FC<PrecisionScanScreenProps> = ({
  onMealLogged,
  onNavigateToday,
  onOpenProfile,
  operatorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80",
}) => {
  const [portion, setPortion] = useState(1.0);
  const [flashOn, setFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Available presets
  const presets = [
    SCANNED_MEAL_PRESET,
    ALTERNATE_PRESETS[0],
    ALTERNATE_PRESETS[1],
  ];

  const currentPreset = presets[activePresetIndex % presets.length];

  // Base values for current preset
  const baseCalories = currentPreset.components.reduce((sum, c) => sum + c.calories, 0);
  const baseProtein = currentPreset.components.reduce((sum, c) => sum + c.protein, 0);
  const baseCarbs = currentPreset.components.reduce((sum, c) => sum + c.carbs, 0);
  const baseFat = currentPreset.components.reduce((sum, c) => sum + c.fat, 0);

  // Scaled values
  const scaledCalories = Math.round(baseCalories * portion);
  const scaledProtein = Math.round(baseProtein * portion);
  const scaledCarbs = Math.round(baseCarbs * portion);
  const scaledFat = Math.round(baseFat * portion);

  // Percentage of daily goal
  const proteinGoalPct = Math.round((scaledProtein / 140) * 100);
  const carbsGoalPct = Math.round((scaledCarbs / 230) * 100);
  const lipidsGoalPct = Math.round((scaledFat / 65) * 100);

  // Handle live camera toggle
  const toggleLiveCamera = async () => {
    if (useLiveCamera) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setUseLiveCamera(false);
      setCameraError(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setUseLiveCamera(true);
        setCameraError(null);
      } catch (err: unknown) {
        console.warn('Camera access denied or unavailable, using high-res visual preset.', err);
        setCameraError('Camera unavailable in preview mode. Using precision mock feed.');
        setTimeout(() => setCameraError(null), 3500);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Shutter trigger animation
  const handleShutter = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 900);
  };

  // Switch preset
  const handleNextPreset = () => {
    setIsScanning(true);
    setTimeout(() => {
      setActivePresetIndex((prev) => (prev + 1) % presets.length);
      setIsScanning(false);
    }, 400);
  };

  const handleAdjustPortion = (delta: number) => {
    setPortion((prev) => Math.max(0.5, Math.min(3.0, parseFloat((prev + delta).toFixed(1)))));
  };

  const handleLogMeal = () => {
    setLoggedSuccess(true);
    const newMeal: MealItem = {
      id: `logged-${Date.now()}`,
      slot: 'dinner',
      slotName: 'Dinner',
      time: '19:45',
      name: currentPreset.name,
      description: currentPreset.components.map((c) => c.name).join(', '),
      calories: scaledCalories,
      protein: scaledProtein,
      carbs: scaledCarbs,
      fat: scaledFat,
      iconType: 'utensils',
      logged: true,
    };

    setTimeout(() => {
      onMealLogged(newMeal);
      onNavigateToday();
    }, 800);
  };

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-md mx-auto w-full px-4 pt-3">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
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

        <h1 className="text-[13px] font-bold tracking-[0.22em] text-[#46607f] font-telemetry uppercase text-center">
          PRECISION SCAN
        </h1>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleNextPreset}
            title="Cycle food sample"
            className="w-8 h-8 rounded-full bg-white border border-[#E2E6EA] flex items-center justify-center text-[#46607f] hover:text-[#111315] hover:bg-[#F8F9FA] transition-all"
          >
            <SlidersHorizontal size={15} />
          </button>
          <button 
            onClick={() => setShowInfoModal(true)}
            title="Telemetry specifications"
            className="w-8 h-8 rounded-full bg-white border border-[#E2E6EA] flex items-center justify-center text-[#46607f] hover:text-[#111315] hover:bg-[#F8F9FA] transition-all"
          >
            <Info size={16} />
          </button>
        </div>
      </header>

      {cameraError && (
        <div className="bg-[#111315] text-white text-[11px] p-2.5 rounded-xl font-telemetry text-center">
          {cameraError}
        </div>
      )}

      {/* Camera Viewfinder Card */}
      <div className="relative w-full aspect-square bg-[#191c1d] rounded-2xl overflow-hidden border border-[#E2E6EA] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col justify-between p-3.5 select-none">
        {/* Live Camera Feed or Sample Image */}
        {useLiveCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentPreset.image}
            alt={currentPreset.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isScanning ? 'opacity-70 scale-102' : 'opacity-100 scale-100'
            }`}
          />
        )}

        {/* Subtle Vignette / Contrast gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

        {/* Viewfinder 4 Corner Brackets (White Hairline) */}
        <div className="absolute inset-4 pointer-events-none">
          {/* Top-Left */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white/90 rounded-tl-sm"></div>
          {/* Top-Right */}
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white/90 rounded-tr-sm"></div>
          {/* Bottom-Left */}
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white/90 rounded-bl-sm"></div>
          {/* Bottom-Right */}
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white/90 rounded-br-sm"></div>
        </div>

        {/* Flash effect overlay */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none mix-blend-screen" />
        )}

        {/* Scanning laser beam animation */}
        {isScanning && (
          <div className="absolute inset-x-0 h-1 bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-pulse top-1/2 -translate-y-1/2" />
        )}

        {/* Top Floating Badge: AI LIVE DETECT */}
        <div className="relative z-10 flex justify-center">
          <div className="bg-[#111315]/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white font-telemetry">
              AI LIVE DETECT
            </span>
          </div>
        </div>

        {/* AR Detection Callouts directly on the food */}
        <div className="relative z-10 flex-1 pointer-events-none flex flex-col justify-around py-4 px-2">
          {/* Callout 1 (Top Left / Chicken Breast) */}
          <div className="self-start ml-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2E6EA] shadow-lg flex items-center gap-2 transform -translate-y-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#111315]"></div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#111315] leading-none">
                {currentPreset.components[0]?.name || 'Target Asset'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#8395A7] font-telemetry ml-2">
              {currentPreset.components[0]?.confidence || 98}%
            </span>
          </div>

          {/* Callout 2 (Bottom Right / Avocado) */}
          {currentPreset.components[1] && (
            <div className="self-end mr-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2E6EA] shadow-lg flex items-center gap-2 transform translate-y-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></div>
              <span className="text-[11px] font-bold text-[#111315] leading-none">
                {currentPreset.components[1]?.name}
              </span>
              <span className="text-[11px] font-bold text-[#8395A7] font-telemetry ml-1">
                {currentPreset.components[1]?.confidence}%
              </span>
            </div>
          )}
        </div>

        {/* Viewfinder Bottom Controls & Target Locked */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-between w-full px-6">
            {/* Flash toggle */}
            <button
              onClick={() => setFlashOn(!flashOn)}
              className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                flashOn
                  ? 'bg-amber-400 text-black border-amber-300'
                  : 'bg-black/50 text-white/90 border-white/20 hover:bg-black/70'
              }`}
            >
              {flashOn ? <Zap size={16} /> : <ZapOff size={16} />}
            </button>

            {/* Shutter Button with focus ring */}
            <button
              onClick={handleShutter}
              className="relative p-1 rounded-full bg-white/20 backdrop-blur-xs border-2 border-white/80 active:scale-95 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#111315] shadow-md group-hover:scale-102 transition-transform">
                <Camera size={22} className="text-[#111315]" />
              </div>
            </button>

            {/* Switch Camera / Switch Preset */}
            <button
              onClick={toggleLiveCamera}
              title={useLiveCamera ? 'Switch to Preset' : 'Enable Live Camera'}
              className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                useLiveCamera
                  ? 'bg-[#2563eb] text-white border-blue-400'
                  : 'bg-black/50 text-white/90 border-white/20 hover:bg-black/70'
              }`}
            >
              {useLiveCamera ? <RefreshCw size={16} /> : <Video size={16} />}
            </button>
          </div>

          <div className="text-[9px] uppercase tracking-[0.2em] font-telemetry text-white/80">
            TARGET LOCKED
          </div>
        </div>
      </div>

      {/* IDENTIFIED COMPONENTS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#46607f] font-telemetry">
            IDENTIFIED COMPONENTS
          </div>
          <span className="text-[11px] text-[#8395A7] font-telemetry">
            {currentPreset.components.length} items matched
          </span>
        </div>

        {/* 2-column or list cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {currentPreset.components.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E2E6EA] p-3 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] flex items-center justify-center text-[#46607f] shrink-0">
                {item.icon === 'utensils' ? <Utensils size={15} /> : <Grid3X3 size={15} />}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#111315] truncate">
                  {item.name}
                </div>
                <div className="text-[10px] text-[#8395A7] font-telemetry">
                  {item.confidence}% • {Math.round(item.calories * portion)} kcal
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional secondary identified items (avocado / cherry tomatoes) */}
        {currentPreset.components.length > 2 && (
          <div className="grid grid-cols-2 gap-2.5">
            {currentPreset.components.slice(2, 4).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#E2E6EA] p-3 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F1F3F5] flex items-center justify-center text-[#46607f] shrink-0">
                  {item.icon === 'leaf' ? <Leaf size={15} /> : <Sparkles size={15} />}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#111315] truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-[#8395A7] font-telemetry">
                    {item.confidence}% • {Math.round(item.calories * portion)} kcal
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NUTRITIONAL SUMMARY CARD */}
      <div className="bg-white rounded-2xl border border-[#E2E6EA] p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,19,21,0.02),0_4px_12px_rgba(17,19,21,0.03)] space-y-4">
        {/* Top line with portion selector */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#46607f] font-telemetry">
              NUTRITIONAL SUMMARY
            </div>
            <div className="text-[16px] font-bold text-[#111315] font-telemetry mt-0.5">
              {scaledCalories} <span className="text-[13px] font-medium text-[#8395A7]">kcal total</span>
            </div>
          </div>

          {/* Portion Scaler */}
          <div className="flex items-center bg-[#F1F3F5] rounded-xl border border-[#E2E6EA] p-1 gap-2">
            <button
              onClick={() => handleAdjustPortion(-0.1)}
              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#111315] hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Minus size={13} />
            </button>
            <span className="text-[12px] font-bold text-[#111315] font-telemetry px-1 min-w-[36px] text-center">
              {portion.toFixed(1)}x
            </span>
            <button
              onClick={() => handleAdjustPortion(0.1)}
              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#111315] hover:bg-slate-100 active:scale-95 transition-all"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* 3 Macro Pods (Protein, Carbs, Lipids) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Protein */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-telemetry text-[#46607f]">
              <span>PROTEIN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#111315]"></span>
            </div>
            <div className="text-[18px] font-bold text-[#111315] font-telemetry my-1">
              {scaledProtein}g
            </div>
            <div className="text-[10px] text-[#8395A7] font-telemetry">
              {proteinGoalPct}% of goal
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-telemetry text-[#46607f]">
              <span>CARBS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#46607f]"></span>
            </div>
            <div className="text-[18px] font-bold text-[#111315] font-telemetry my-1">
              {scaledCarbs}g
            </div>
            <div className="text-[10px] text-[#8395A7] font-telemetry">
              {carbsGoalPct}% of goal
            </div>
          </div>

          {/* Lipids / Fat */}
          <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E6EA] p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-telemetry text-[#46607f]">
              <span>LIPIDS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8395A7]"></span>
            </div>
            <div className="text-[18px] font-bold text-[#111315] font-telemetry my-1">
              {scaledFat}g
            </div>
            <div className="text-[10px] text-[#8395A7] font-telemetry">
              {lipidsGoalPct}% of goal
            </div>
          </div>
        </div>

        {/* Primary CTA: Log This Meal */}
        <button
          onClick={handleLogMeal}
          disabled={loggedSuccess}
          className="w-full bg-[#111315] hover:bg-[#2C3036] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-80"
        >
          {loggedSuccess ? (
            <>
              <Check size={18} className="text-emerald-400" />
              <span>Meal Synchronized</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>Log This Meal</span>
            </>
          )}
        </button>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-[#E2E6EA] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#46607f] font-telemetry">
                Spectral Telemetry v4.2
              </span>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-[#8395A7] hover:text-[#111315] text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[12px] text-[#45474a] leading-relaxed">
              Nordic Precision uses multi-spectral optical segmentation to identify macro components and volumetric portion sizing.
            </p>
            <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E2E6EA] text-[11px] font-telemetry text-[#8395A7] space-y-1">
              <div>• Model: BioScan Neural Net v4</div>
              <div>• Calibration: 98.4% Confidence Interval</div>
              <div>• Latency: ~120ms Local Telemetry</div>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full bg-[#111315] text-white py-2.5 rounded-xl text-xs font-bold font-telemetry"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
