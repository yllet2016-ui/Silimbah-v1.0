import React from 'react';
import {
  SimulationTelemetry,
  ActiveAlert,
  SimulationObjectDef,
} from '../../types';
import {
  Droplets,
  Truck,
  Filter,
  Wind,
  Activity,
  AlertTriangle,
  Layers,
  Sliders,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { IntegratedDiagramCanvas } from './IntegratedDiagramCanvas';

interface CanvasProps {
  missionId: string;
  telemetry: SimulationTelemetry;
  activeAlerts: ActiveAlert[];
  onSelectObject: (obj: SimulationObjectDef) => void;
  onExecuteAction: (actionName: string, actionType: string) => void;
  draggedComponents?: string[];
  onDropComponent?: (slotId: string, compId: string) => void;
  objects: SimulationObjectDef[];
  openedNarrativeIds?: Set<string>;
}

export const InteractiveInstallationCanvas: React.FC<CanvasProps> = ({
  missionId,
  telemetry,
  activeAlerts,
  onSelectObject,
  onExecuteAction,
  draggedComponents = [],
  onDropComponent,
  objects,
  openedNarrativeIds,
}) => {
  const findObj = (cat: string) =>
    objects.find((o) => o.category === cat) || objects[0];

  const hasAlert = (code: string) => activeAlerts.some((a) => a.code === code);
  const isCriticalAlert = (code: string) =>
    activeAlerts.some((a) => a.code === code && a.level === 'critical');

  /* -------------------------------------------------------------------------- */
  /* BW-2: RAKIT TANGKI SEPTIK KEDAP INTERAKTIF (SNI 2398:2017)                */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'BW-2') {
    const isInstalled = (compId: string) => draggedComponents.includes(compId);
    const completedCount = draggedComponents.length;
    const isComplete = completedCount === 8;

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Ground & Concrete Shell */}
          <rect x="0" y="80" width="800" height="320" fill="#1e1810" opacity="0.6" />
          <rect x="0" y="76" width="800" height="8" fill="#15803d" />

          {/* Septic Tank Concrete Outer Shell */}
          <rect
            x="140"
            y="110"
            width="380"
            height="240"
            rx="14"
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="8"
          />

          {/* Component 1: Inlet T-Pipe (Left) */}
          {isInstalled('comp_inlet_t') ? (
            <g className="cursor-pointer" onClick={() => onSelectObject(findObj('inlet'))}>
              <path d="M 60 70 L 170 70 L 170 180" fill="none" stroke="#38bdf8" strokeWidth="12" />
              <path d="M 170 120 L 170 190" fill="none" stroke="#0284c7" strokeWidth="10" />
              <circle cx="170" cy="180" r="7" fill="#38bdf8" />
              <text x="110" y="60" fill="#38bdf8" fontSize="10" fontWeight="bold">
                1. Inlet Tee ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_inlet', 'comp_inlet_t')}>
              <path d="M 60 70 L 170 70 L 170 180" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="6 4" />
              <rect x="75" y="48" width="85" height="18" rx="4" fill="#334155" />
              <text x="117" y="61" fill="#94a3b8" fontSize="9" textAnchor="middle">
                [+ Pasang Inlet T]
              </text>
            </g>
          )}

          {/* Component 2: Ruang Pengendapan Primer (2/3 Volume) */}
          {isInstalled('comp_sediment_room') ? (
            <g>
              <rect x="150" y="125" width="230" height="215" fill="#042f2e" opacity="0.7" />
              <rect x="150" y="270" width="230" height="70" fill="#451a03" opacity="0.85" />
              <text x="265" y="220" fill="#5eead4" fontSize="11" fontWeight="bold" textAnchor="middle">
                2. Ruang Pengendapan (2/3) ✓
              </text>
              <text x="265" y="305" fill="#fef08a" fontSize="9" textAnchor="middle">
                Endapan Lumpur Anaerobik
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_sediment', 'comp_sediment_room')}>
              <rect x="150" y="125" width="230" height="215" fill="#1e293b" opacity="0.4" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="265" y="235" fill="#94a3b8" fontSize="10" textAnchor="middle">
                [+ Pasang Ruang Pengendapan 2/3]
              </text>
            </g>
          )}

          {/* Component 3: Baffle Partition Wall */}
          {isInstalled('comp_baffle') ? (
            <g>
              <rect x="380" y="118" width="14" height="175" fill="#64748b" rx="2" />
              <text x="387" y="200" fill="#ffffff" fontSize="9" fontWeight="bold" transform="rotate(-90 387 200)" textAnchor="middle">
                3. Baffle Penyekat ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_baffle', 'comp_baffle')}>
              <rect x="380" y="118" width="14" height="175" fill="#334155" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
              <text x="387" y="200" fill="#94a3b8" fontSize="8" transform="rotate(-90 387 200)" textAnchor="middle">
                [+ Dinding Baffle]
              </text>
            </g>
          )}

          {/* Component 4: Ruang Penguraian Sekunder (1/3 Volume) */}
          {isInstalled('comp_chamber2') ? (
            <g>
              <rect x="394" y="125" width="118" height="215" fill="#0369a1" opacity="0.5" />
              <text x="453" y="220" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                4. Ruang Ke-2 (1/3) ✓
              </text>
              <text x="453" y="238" fill="#bae6fd" fontSize="8" textAnchor="middle">
                Klarifikasi Efluen
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_chamber2', 'comp_chamber2')}>
              <rect x="394" y="125" width="118" height="215" fill="#1e293b" opacity="0.4" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="453" y="235" fill="#94a3b8" fontSize="9" textAnchor="middle">
                [+ Ruang 1/3]
              </text>
            </g>
          )}

          {/* Component 5: Pipa Hawa Ventilasi */}
          {isInstalled('comp_vent_pipe') ? (
            <g>
              <rect x="460" y="30" width="8" height="80" fill="#38bdf8" />
              <polygon points="455,30 473,30 464,18" fill="#0284c7" />
              <text x="464" y="12" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                5. Pipa Hawa ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_vent', 'comp_vent_pipe')}>
              <line x1="464" y1="30" x2="464" y2="110" stroke="#64748b" strokeWidth="3" strokeDasharray="4 3" />
              <text x="464" y="25" fill="#94a3b8" fontSize="8" textAnchor="middle">
                [+ Pipa Ventilasi]
              </text>
            </g>
          )}

          {/* Component 6: Manhole / Lubang Kontrol */}
          {isInstalled('comp_manhole') ? (
            <g>
              <rect x="290" y="78" width="60" height="34" fill="#475569" stroke="#334155" strokeWidth="2" />
              <rect x="284" y="72" width="72" height="8" rx="2" fill="#14b8a6" />
              <text x="320" y="65" fill="#5eead4" fontSize="9" fontWeight="bold" textAnchor="middle">
                6. Manhole Kedap ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_manhole', 'comp_manhole')}>
              <rect x="290" y="78" width="60" height="34" fill="#334155" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
              <text x="320" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle">
                [+ Manhole]
              </text>
            </g>
          )}

          {/* Component 7: Outlet T-Pipe */}
          {isInstalled('comp_outlet_t') ? (
            <g>
              <path d="M 495 150 L 495 210" fill="none" stroke="#38bdf8" strokeWidth="8" />
              <path d="M 495 160 L 580 160 L 580 230" fill="none" stroke="#38bdf8" strokeWidth="10" />
              <text x="540" y="150" fill="#38bdf8" fontSize="10" fontWeight="bold">
                7. Outlet Tee ✓
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_outlet', 'comp_outlet_t')}>
              <path d="M 495 160 L 580 160 L 580 230" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="4 3" />
              <text x="540" y="150" fill="#94a3b8" fontSize="8">
                [+ Outlet T]
              </text>
            </g>
          )}

          {/* Component 8: Bidang Resapan Kerikil */}
          {isInstalled('comp_drain_field') ? (
            <g>
              <rect x="570" y="220" width="200" height="120" rx="10" fill="#1e293b" stroke="#059669" strokeWidth="3" />
              {[...Array(12)].map((_, i) => (
                <circle
                  key={i}
                  cx={590 + (i % 4) * 45}
                  cy={245 + Math.floor(i / 4) * 35}
                  r="7"
                  fill="#64748b"
                />
              ))}
              <text x="670" y="240" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                8. Bidang Resapan SNI ✓
              </text>
              <text x="670" y="325" fill="#a7f3d0" fontSize="9" textAnchor="middle">
                Resapan Aman ke Air Tanah
              </text>
            </g>
          ) : (
            <g className="cursor-pointer" onClick={() => onDropComponent && onDropComponent('slot_drain', 'comp_drain_field')}>
              <rect x="570" y="220" width="200" height="120" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
              <text x="670" y="280" fill="#94a3b8" fontSize="10" textAnchor="middle">
                [+ Pasang Bidang Resapan]
              </text>
            </g>
          )}

          {/* Flow Animation when Complete */}
          {isComplete && (
            <g>
              <path d="M 60 70 L 170 70 L 170 180" fill="none" stroke="#ffffff" strokeWidth="3" className="anim-flow-pipe" />
              <path d="M 495 160 L 580 160 L 580 230" fill="none" stroke="#ffffff" strokeWidth="3" className="anim-flow-pipe" />
              <rect x="250" y="16" width="300" height="32" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="2" />
              <text x="400" y="36" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ✨ TANGKI SEPTIK KEDAP SELESAI DIRAKIT SESUAI SNI 2398
              </text>
            </g>
          )}
        </svg>

        <div className="absolute top-3 left-3 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-xs text-slate-300 font-mono">
          Progres Rakit: <strong className="text-teal-400">{completedCount} / 8</strong> Komponen
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* BW-3: SIMULASI TANGKI SEPTIK & PENYEDOTAN TRUK TINJA                       */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'BW-3') {
    const isSludgeOverload = telemetry.sludgeHeightPercent >= 60; // AL-01
    const isLeaking = hasAlert('AL-02'); // AL-02 rembesan
    const sludgeHeightY = Math.min(100, Math.max(20, telemetry.sludgeHeightPercent));

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-sky-900/60 via-slate-900 to-amber-950/40 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <defs>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d2817" />
              <stop offset="100%" stopColor="#1f140a" />
            </linearGradient>
            <linearGradient id="waterClearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0d213a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="sludgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5c3a1e" />
              <stop offset="100%" stopColor="#301b0b" />
            </linearGradient>
            <linearGradient id="scumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#87683b" />
              <stop offset="100%" stopColor="#4f3818" />
            </linearGradient>
          </defs>

          {/* Ground Soil & Surface Line */}
          <rect x="0" y="80" width="800" height="320" fill="url(#groundGrad)" />
          {/* Grass strip */}
          <rect x="0" y="76" width="800" height="8" fill="#2d5a27" />

          {/* Above Ground Elements: Toilet House & UPTD Desludging Truck */}
          {/* House Wall / Toilet Connection */}
          <rect x="10" y="10" width="120" height="70" fill="#334155" rx="4" />
          <polygon points="5,15 70,-5 135,15" fill="#991b1b" />
          <text x="70" y="45" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
            Kloset Rumah
          </text>
          <text x="70" y="60" fill="#94a3b8" fontSize="9" textAnchor="middle">
            Air Gelontor & Tinja
          </text>

          {/* UPTD Vacuum Truck (Desludging Tanker) */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectObject(findObj('storage'))}
          >
            {/* Truck Cab */}
            <rect x="520" y="32" width="75" height="48" rx="5" fill="#0284c7" />
            <rect x="555" y="38" width="35" height="22" rx="3" fill="#e0f2fe" opacity="0.85" />
            {/* Truck Tank */}
            <rect x="420" y="24" width="105" height="56" rx="16" fill="#0369a1" />
            <text x="472" y="56" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              Truk Tinja UPTD
            </text>
            {/* Wheels */}
            <circle cx="450" cy="80" r="10" fill="#0f172a" />
            <circle cx="450" cy="80" r="4" fill="#94a3b8" />
            <circle cx="565" cy="80" r="10" fill="#0f172a" />
            <circle cx="565" cy="80" r="4" fill="#94a3b8" />
          </g>

          {/* Suction Hose into Septic Tank Manhole */}
          <path
            d="M 430 65 Q 360 70 330 110 L 330 200"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {telemetry.sludgeHeightPercent < 60 && (
            <path
              d="M 430 65 Q 360 70 330 110 L 330 200"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              className="anim-flow-pipe"
            />
          )}

          {/* Underground Watertight Septic Tank Outer Shell */}
          <rect
            x="160"
            y="110"
            width="340"
            height="240"
            rx="12"
            fill="#1e293b"
            stroke={isLeaking ? '#ef4444' : '#64748b'}
            strokeWidth="8"
          />
          {/* Manhole Neck & Cover */}
          <rect x="300" y="80" width="60" height="34" fill="#475569" stroke="#334155" strokeWidth="2" />
          <rect x="294" y="74" width="72" height="8" rx="2" fill="#94a3b8" />
          <text x="330" y="70" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
            Manhole
          </text>

          {/* Vent Pipe (Pipa Hawa Ventilasi) with gas emission */}
          <rect x="440" y="40" width="8" height="72" fill="#94a3b8" />
          <path d="M 436 40 L 452 40 L 444 32 Z" fill="#64748b" />
          <text x="444" y="24" fill="#38bdf8" fontSize="9" textAnchor="middle" className="animate-pulse">
            Gas CH₄ / H₂S ⇡
          </text>

          {/* Inside Septic Tank: Chamber 1 (2/3 volume) & Chamber 2 (1/3 volume) */}
          <g>
            {/* Water body */}
            <rect x="168" y="140" width="324" height="202" fill="url(#waterClearGrad)" />

            {/* Baffle Wall (Dinding Penyekat) */}
            <rect x="370" y="118" width="10" height="180" fill="#475569" />
            {/* Underflow orifice between chambers */}
            <rect x="370" y="298" width="10" height="30" fill="none" stroke="#38bdf8" strokeDasharray="3 3" />

            {/* Scum Layer (Lapisan Lemak/Busa Atas) */}
            <rect x="168" y="140" width="202" height="22" fill="url(#scumGrad)" rx="2" />
            <text x="260" y="155" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lapisan Scum (Minyak/Buih)
            </text>

            {/* Dynamic Bottom Sludge Layer (Endapan Lumpur Anaerobik) */}
            {/* Height calculated dynamically */}
            <rect
              x="168"
              y={342 - (sludgeHeightY * 1.6)}
              width="202"
              height={sludgeHeightY * 1.6}
              fill="url(#sludgeGrad)"
              className={isSludgeOverload ? 'animate-pulse' : ''}
            />
            {/* Secondary Chamber Sludge (lighter) */}
            <rect
              x="380"
              y={342 - (sludgeHeightY * 0.5)}
              width="112"
              height={sludgeHeightY * 0.5}
              fill="url(#sludgeGrad)"
            />

            {/* 2/3 Height Limit Indicator Line (AL-01 Trigger Point) */}
            <line
              x1="168"
              y1="235"
              x2="370"
              y2="235"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <rect x="175" y="222" width="140" height="16" rx="3" fill="#b91c1c" />
            <text x="245" y="234" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              AMBANG 2/3 TINGGI LUMPUR
            </text>

            {/* Sludge height label */}
            <text
              x="260"
              y={Math.max(260, 335 - (sludgeHeightY * 1.2))}
              fill="#ffffff"
              fontSize="11"
              fontWeight="extrabold"
              textAnchor="middle"
            >
              Lumpur Tinja: {telemetry.sludgeHeightPercent}%
            </text>
          </g>

          {/* Inlet T-Pipe from house */}
          <path d="M 120 70 L 190 70 L 190 175" fill="none" stroke="#64748b" strokeWidth="12" />
          <path d="M 190 125 L 190 185" fill="none" stroke="#94a3b8" strokeWidth="8" />
          <path d="M 120 70 L 190 70 L 190 175" fill="none" stroke="#f59e0b" strokeWidth="4" className="anim-flow-pipe" />

          {/* Outlet T-Pipe to soakaway */}
          <path d="M 480 155 L 480 205" fill="none" stroke="#64748b" strokeWidth="8" />
          <path d="M 480 165 L 560 165 L 560 220" fill="none" stroke="#64748b" strokeWidth="10" />
          <path d="M 480 165 L 560 165 L 560 220" fill="none" stroke="#38bdf8" strokeWidth="3" className="anim-flow-pipe" />

          {/* Soakaway Drain Field (Bidang Resapan Kerikil) */}
          <g>
            <rect x="540" y="210" width="220" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
            {/* Gravel dots */}
            {[...Array(15)].map((_, i) => (
              <circle
                key={i}
                cx={560 + (i % 5) * 40}
                cy={240 + Math.floor(i / 5) * 35}
                r="6"
                fill="#64748b"
              />
            ))}
            <text x="650" y="232" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              Bidang Resapan Tanah
            </text>
            <text x="650" y="250" fill="#94a3b8" fontSize="9" textAnchor="middle">
              Kerikil & Pasir SNI 2398
            </text>
            <text x="650" y="320" fill="#34d399" fontSize="10" textAnchor="middle">
              Air Meresap Aman Tanpa Bau
            </text>
          </g>

          {/* Alert Status Pin */}
          {isSludgeOverload && (
            <g className="animate-bounce">
              <rect x="230" y="100" width="130" height="24" rx="6" fill="#dc2626" />
              <text x="295" y="116" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                ⚠️ AL-01: SEGERA SEDOT
              </text>
            </g>
          )}
        </svg>

        {/* Floating Quick Action Button overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={() => onExecuteAction('Jadwalkan penyedotan truk tinja berizin', 'desludge')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          >
            <Truck className="w-4 h-4" />
            <span>Panggil Truk Sedot UPTD</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-2: SARINGAN & PEMISAH LEMAK                                             */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-2') {
    const isOilHigh = hasAlert('AL-07') || telemetry.oilAndGrease >= 25;
    const isScreenClogged = hasAlert('AL-17') || (telemetry.screenHeadlossCm ?? 0) >= 15;
    const oilThickness = Math.min(72, Math.max(14, telemetry.oilAndGrease * 2.2));

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Drainase Lingkungan -> Bak Pengambilan -> Saringan -> Pemisah Lemak */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectObject(objects.find((o) => o.id === 'obj_drainase_lingkungan') || findObj('inlet'))}
          >
            <rect x="18" y="100" width="135" height="80" fill="#1e293b" stroke="#64748b" strokeWidth="3" rx="8" />
            <text x="85" y="132" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Drainase
            </text>
            <text x="85" y="148" fill="#94a3b8" fontSize="9" textAnchor="middle">
              Lingkungan (Terbuka)
            </text>
          </g>
          <path d="M 153 140 L 183 140" fill="none" stroke="#00cfff" strokeWidth="6" className="anim-flow-pipe" />

          {/* Bak Pengambilan */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectObject(objects.find((o) => o.id === 'obj_bak_pengambilan') || findObj('inlet'))}
          >
            <rect x="183" y="100" width="110" height="80" fill="#1e293b" stroke="#64748b" strokeWidth="3" rx="8" />
            <text x="238" y="132" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Bak
            </text>
            <text x="238" y="148" fill="#94a3b8" fontSize="9" textAnchor="middle">
              Pengambilan
            </text>
          </g>
          <path d="M 293 140 L 323 140" fill="none" stroke="#00cfff" strokeWidth="6" className="anim-flow-pipe" />

          {/* Unit Saringan (AL-17) */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectObject(objects.find((o) => o.id === 'obj_saringan_gw2') || findObj('treatment'))}
          >
            <rect
              x="323"
              y="95"
              width="110"
              height="160"
              rx="10"
              fill="#0f172a"
              stroke={isScreenClogged ? '#f59e0b' : '#64748b'}
              strokeWidth={isScreenClogged ? '5' : '4'}
            />
            <text x="378" y="118" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              Saringan
            </text>
            <path d="M 353 132 L 353 230 M 378 132 L 378 230 M 403 132 L 403 230" stroke="#94a3b8" strokeWidth="3" />
            <text x="378" y="246" fill={isScreenClogged ? '#fbbf24' : '#34d399'} fontSize="9" fontWeight="bold" textAnchor="middle">
              Beda Air: {telemetry.screenHeadlossCm ?? 4} cm
            </text>
          </g>

          <path d="M 433 165 L 463 165" fill="none" stroke="#00cfff" strokeWidth="6" className="anim-flow-pipe" />

          {/* Pemisah Lemak (Grease Trap AL-07) */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectObject(objects.find((o) => o.id === 'obj_pemisah_lemak_gw2') || findObj('treatment'))}
          >
            <rect
              x="463"
              y="95"
              width="230"
              height="200"
              rx="12"
              fill="#0f172a"
              stroke={isOilHigh ? '#f59e0b' : '#64748b'}
              strokeWidth={isOilHigh ? '5' : '4'}
            />
            <text x="578" y="118" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">
              Pemisah Lemak (Grease Trap)
            </text>
            <rect x="471" y="135" width="214" height="152" fill="#0369a1" opacity="0.38" />
            <rect
              x="471"
              y="135"
              width="214"
              height={oilThickness}
              fill="#eab308"
              opacity="0.9"
              className={isOilHigh ? 'animate-pulse' : ''}
            />
            <text x="578" y={135 + Math.min(28, oilThickness / 2 + 5)} fill="#713f12" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Lapisan Minyak: {telemetry.oilAndGrease}%
            </text>
            <rect x="635" y="160" width="10" height="125" fill="#64748b" rx="2" />
            <line x1="471" y1="185" x2="685" y2="185" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
            <text x="578" y="200" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
              Ambang Maksimum: 25% (AL-07)
            </text>
          </g>

          <path d="M 693 215 L 785 215" fill="none" stroke="#00cfff" strokeWidth="8" className="anim-flow-pipe" />
          <text x="739" y="202" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
            Ke 1. Ekualisasi
          </text>
        </svg>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {isScreenClogged && (
            <button
              onClick={() => onExecuteAction('Bersihkan saringan dari sampah tersangkut', 'clean_screen')}
              className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>Bersihkan Saringan (AL-17)</span>
            </button>
          )}
          <button
            onClick={() => onExecuteAction('Sendok dan bersihkan lapisan lemak pada pemisah lemak', 'clean_grease')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span>Bersihkan Pemisah Lemak</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-3: BIOFILTER BERJALAN (ABR + BIOFILTER ANAEROB + PENGELOLAAN GAS)       */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-3') {
    const isClogged = hasAlert('AL-10');
    const isFlowHigh = hasAlert('AL-09');

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-teal-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Header Gas Management */}
          <rect x="330" y="22" width="160" height="36" rx="8" fill="#422006" stroke="#facc15" strokeWidth="2" />
          <text x="410" y="44" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">
            Pengelolaan Gas (CH₄ / H₂S)
          </text>
          <path d="M 220 90 L 220 40 L 330 40 M 540 90 L 540 40 L 490 40" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="5 3" />

          {/* Unit 1: ABR */}
          <rect x="70" y="90" width="290" height="240" rx="14" fill="#0f172a" stroke={isFlowHigh ? '#f59e0b' : '#475569'} strokeWidth="5" />
          <text x="215" y="114" fill="#2dd4bf" fontSize="12" fontWeight="bold" textAnchor="middle">
            1. Reaktor Anaerob Bersekat (ABR)
          </text>
          <line x1="150" y1="130" x2="150" y2="295" stroke="#64748b" strokeWidth="5" />
          <line x1="220" y1="160" x2="220" y2="325" stroke="#64748b" strokeWidth="5" />
          <line x1="290" y1="130" x2="290" y2="295" stroke="#64748b" strokeWidth="5" />
          <path d="M 25 180 L 90 180 Q 150 290 185 180 Q 250 290 325 180" fill="none" stroke="#00cfff" strokeWidth="4" className="anim-flow-pipe" />
          <text x="215" y="316" fill="#ffcc81" fontSize="9" textAnchor="middle">
            Debit Masuk: {telemetry.flowRate} L/dtk (Aliran Naik–Turun)
          </text>

          <path d="M 360 190 L 420 190" fill="none" stroke="#00cfff" strokeWidth="7" className="anim-flow-pipe" />

          {/* Unit 2: Biofilter Anaerob */}
          <rect x="420" y="90" width="310" height="240" rx="14" fill="#0f172a" stroke={isClogged ? '#dc2626' : '#475569'} strokeWidth="5" />
          <text x="575" y="114" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
            2. Biofilter Anaerob (Media Sarang Tawon)
          </text>
          <rect x="455" y="145" width="240" height="125" fill="#134e4a" stroke="#2dd4bf" strokeWidth="2" rx="8" />
          {[...Array(15)].map((_, i) => (
            <circle
              key={i}
              cx={485 + (i % 5) * 45}
              cy={172 + Math.floor(i / 5) * 35}
              r="11"
              fill="none"
              stroke={isClogged ? '#fbbf24' : '#5eead4'}
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          ))}
          <text x="575" y="294" fill="#99f6e4" fontSize="9" textAnchor="middle">
            TSS Efluen: {telemetry.TSS} mg/L · BOD: {telemetry.BOD} mg/L
          </text>
          <path d="M 730 190 L 785 190" fill="none" stroke="#00cfff" strokeWidth="7" className="anim-flow-pipe" />
        </svg>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {isFlowHigh && (
            <button
              onClick={() => onExecuteAction('Atur debit pompa dari bak ekualisasi ke ABR', 'equalize_flow')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Atur Debit ke ABR (AL-09)</span>
            </button>
          )}
          <button
            onClick={() => onExecuteAction('Lakukan backwash pencucian media biofilter', 'backwash')}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Wind className="w-4 h-4" />
            <span>Backwash Media Biofilter (AL-10)</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-4: AERASI & PENGENDAP AKHIR (BLOWER + BAK AERASI + CLARIFIER + RAS)     */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-4') {
    const isBlowerOff = telemetry.blowerActive === false || (telemetry.dissolvedOxygen ?? 2) < 1.0;
    const isSludgeHigh = (telemetry.finalClarifierSludgePercent ?? 18) >= 33 || telemetry.rasPumpActive === false;

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-cyan-950/70 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Blower Udara */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('treatment'))}>
            <rect
              x="70"
              y="32"
              width="175"
              height="48"
              rx="10"
              fill={isBlowerOff ? '#7f1d1d' : '#7c2d12'}
              stroke={isBlowerOff ? '#ef4444' : '#fb923c'}
              strokeWidth="3"
            />
            <text x="157" y="54" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              Blower Udara {isBlowerOff ? '(MATI)' : '(AKTIF)'}
            </text>
            <text x="157" y="70" fill="#fed7aa" fontSize="9" textAnchor="middle">
              DO Target: 1,5–3,0 mg/L
            </text>
          </g>
          <path
            d="M 157 80 L 157 265 L 365 265"
            fill="none"
            stroke={isBlowerOff ? '#64748b' : '#fb923c'}
            strokeWidth="5"
            strokeDasharray={isBlowerOff ? '4 4' : 'none'}
          />

          {/* Bak Aerasi Aerob */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('treatment'))}>
            <rect
              x="90"
              y="110"
              width="310"
              height="195"
              rx="14"
              fill="#0f172a"
              stroke={isBlowerOff ? '#dc2626' : '#38bdf8'}
              strokeWidth="5"
            />
            <rect x="102" y="135" width="286" height="158" fill="#0369a1" opacity="0.4" rx="8" />
            <text x="245" y="128" fill="#7dd3fc" fontSize="12" fontWeight="bold" textAnchor="middle">
              1. Bak Aerasi Aerob (DO: {(telemetry.dissolvedOxygen ?? 2.1).toFixed(1)} mg/L)
            </text>
            {!isBlowerOff &&
              [...Array(7)].map((_, i) => (
                <circle
                  key={i}
                  cx={145 + i * 35}
                  cy={245}
                  r="4"
                  fill="#fb923c"
                  className={`anim-bubble-${(i % 3) + 1}`}
                />
              ))}
          </g>

          <path d="M 400 195 L 455 195" fill="none" stroke="#00cfff" strokeWidth="7" className="anim-flow-pipe" />

          {/* Pengendap Akhir & Pompa RAS */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('treatment'))}>
            <rect
              x="455"
              y="110"
              width="285"
              height="195"
              rx="14"
              fill="#0f172a"
              stroke={isSludgeHigh ? '#eab308' : '#475569'}
              strokeWidth="5"
            />
            <text x="597" y="128" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
              2. Pengendap Akhir (Clarifier)
            </text>
            <polygon points="485,220 710,220 597,295" fill="#78350f" opacity="0.85" />
            <text x="597" y="255" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
              Lapisan Lumpur: {telemetry.finalClarifierSludgePercent ?? 18}% (&lt; 33%)
            </text>
          </g>

          {/* Pompa Lumpur Balik (RAS) ke Bak Aerasi & Waste ke L */}
          <path d="M 597 295 L 597 345 L 245 345 L 245 305" fill="none" stroke="#ffcc81" strokeWidth="5" className="anim-flow-pipe" />
          <rect x="345" y="332" width="160" height="24" rx="6" fill="#451a03" stroke="#ffcc81" strokeWidth="1.5" />
          <text x="425" y="348" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">
            Pompa Lumpur Balik (RAS)
          </text>
          <path d="M 597 345 L 700 345" fill="none" stroke="#ffcc81" strokeWidth="4" />
          <rect x="700" y="332" width="60" height="24" rx="6" fill="#78350f" />
          <text x="730" y="348" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
            Ke L
          </text>
        </svg>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {isBlowerOff && (
            <button
              onClick={() => onExecuteAction('Nyalakan blower cadangan & perbaiki pasokan udara', 'start_blower')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Wind className="w-4 h-4" />
              <span>Nyalakan Blower Cadangan (AL-11)</span>
            </button>
          )}
          <button
            onClick={() => onExecuteAction('Jalankan pompa lumpur balik (RAS) & buang lumpur lebih ke L', 'run_ras')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Jalankan Pompa RAS (AL-12)</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* GW-5: PAKAI ULANG AMAN (FILTER PASIR + DISINFEKSI + DEKLORINASI + KONTROL) */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'GW-5') {
    const isColiformHigh = telemetry.totalColiform > 3000;
    const isFilterClogged = (telemetry.sandFilterHeadlossM ?? 0.5) >= 2.0;
    const cl = telemetry.freeChlorine ?? 0.5;
    const isClOut = cl < 0.2 || cl > 1.0;

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <text x="400" y="28" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">
            Tahap Pengolahan Akhir: Filter Pasir · Disinfeksi &amp; Deklorinasi · Bak Kontrol Akhir
          </text>

          {/* 1. Filter Pasir */}
          <rect x="35" y="85" width="160" height="190" rx="10" fill="#0f172a" stroke={isFilterClogged ? '#eab308' : '#64748b'} strokeWidth="4" />
          <text x="115" y="110" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">
            1. Filter Pasir
          </text>
          <rect x="50" y="135" width="130" height="80" fill="#78350f" opacity="0.65" rx="6" />
          <text x="115" y="180" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">
            ΔP: {(telemetry.sandFilterHeadlossM ?? 0.5).toFixed(1)} m (Maks 2,0 m)
          </text>
          <path d="M 195 170 L 235 170" fill="none" stroke="#00cfff" strokeWidth="6" className="anim-flow-pipe" />

          {/* 2. Disinfeksi & Deklorinasi */}
          <rect x="235" y="85" width="180" height="190" rx="10" fill="#1e1b4b" stroke={isClOut || isColiformHigh ? '#dc2626' : '#818cf8'} strokeWidth="4" />
          <text x="325" y="110" fill="#e0e7ff" fontSize="11" fontWeight="bold" textAnchor="middle">
            2. Disinfeksi Klorin
          </text>
          <text x="325" y="145" fill="#f5d0fe" fontSize="10" fontWeight="bold" textAnchor="middle">
            Sisa Cl₂: {cl.toFixed(2)} mg/L
          </text>
          <text x="325" y="162" fill="#a5b4fc" fontSize="8" textAnchor="middle">
            Rentang Normal: 0,2 – 1,0 mg/L
          </text>
          <rect x="260" y="190" width="130" height="32" rx="6" fill="#312e81" />
          <text x="325" y="210" fill="#c7d2fe" fontSize="9" textAnchor="middle">
            Deklorinasi bila Cl₂ &gt; 1,0
          </text>
          <path d="M 415 170 L 455 170" fill="none" stroke="#c084fc" strokeWidth="6" className="anim-flow-pipe" />

          {/* 3. Bak Kontrol Akhir & Penampung */}
          <rect x="455" y="85" width="180" height="190" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="4" />
          <text x="545" y="110" fill="#f5d0fe" fontSize="11" fontWeight="bold" textAnchor="middle">
            3. Bak Kontrol &amp; Penampung
          </text>
          <rect x="470" y="135" width="150" height="65" rx="6" fill={isColiformHigh ? '#7f1d1d' : '#064e3b'} />
          <text x="545" y="162" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
            Coliform: {telemetry.totalColiform} /100mL
          </text>
          <text x="545" y="182" fill={isColiformHigh ? '#fca5a5' : '#86efac'} fontSize="8" textAnchor="middle">
            {isColiformHigh ? 'BELUM MEMENUHI MUTU (R)' : '✓ MEMENUHI MUTU PAKAI ULANG'}
          </text>

          {/* Outlets: Irigasi (Ungu), Badan Kali (Biru, hanya setelah memenuhi mutu), Olah Ulang R */}
          <path d="M 635 135 L 775 135" fill="none" stroke={telemetry.valveIrrigationOpen ? '#c084fc' : '#475569'} strokeWidth="7" strokeDasharray={telemetry.valveIrrigationOpen ? 'none' : '5 4'} />
          <text x="705" y="122" fill="#d8b4fe" fontSize="9" fontWeight="bold" textAnchor="middle">
            Taman Nonpangan
          </text>
          <path d="M 635 210 L 775 210" fill="none" stroke={telemetry.valveRiverOpen ? '#00cfff' : '#475569'} strokeWidth="7" strokeDasharray={telemetry.valveRiverOpen ? 'none' : '5 4'} />
          <text x="705" y="198" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">
            Badan Kali (Lulus Mutu)
          </text>
          <path d="M 545 275 L 545 330 L 115 330 L 115 275" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 4" />
          <text x="330" y="320" fill="#fdba74" fontSize="9" fontWeight="bold" textAnchor="middle">
            Jalur Olah Ulang (R) bila backwash / belum memenuhi mutu
          </text>
        </svg>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {isFilterClogged && (
            <button
              onClick={() => onExecuteAction('Backwash filter pasir & alirkan air pencucian ke olah ulang (R)', 'backwash_sand')}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer"
            >
              Backwash Filter Pasir (AL-18)
            </button>
          )}
          <button
            onClick={() => onExecuteAction('Atur dosis klorin agar sisa klorin 0,2–1,0 mg/L', 'disinfect_coliform')}
            className={`px-3.5 py-2 ${isColiformHigh || isClOut ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Atur Dosis Klorin &amp; Uji Ulang</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* BW-4 / BW-5: PENERIMAAN & KRISIS LUMPUR TINJA (TANPA KOLAM STABILISASI)    */
  /* -------------------------------------------------------------------------- */
  if (missionId === 'BW-4' || missionId === 'BW-5') {
    const isScreenClogged = hasAlert('AL-17') || (telemetry.screenHeadlossCm ?? 0) >= 15;
    const isTruckQueue = hasAlert('AL-03');
    const isSludgeFull = hasAlert('AL-06');

    return (
      <div className="relative w-full h-[360px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-700 p-2 sm:p-4 select-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Station 1: Kedatangan Truk Lumpur Tinja */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('storage'))}>
            <rect x="25" y="110" width="145" height="165" rx="10" fill="#1e293b" stroke={isTruckQueue ? '#eab308' : '#64748b'} strokeWidth="4" />
            <text x="97" y="135" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              1. Penerimaan Truk
            </text>
            <text x="97" y="150" fill="#94a3b8" fontSize="8" textAnchor="middle">
              {isTruckQueue ? '⚠️ Antrean Melebihi Kapasitas' : 'Ritase Terjadwal'}
            </text>
            <rect x="48" y="175" width="98" height="45" rx="10" fill="#0369a1" />
            <text x="97" y="201" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
              Truk Sedot Tinja
            </text>
          </g>

          <path d="M 170 192 L 210 192" fill="none" stroke="#ffcc81" strokeWidth="7" className="anim-flow-pipe" />

          {/* Station 2: Bak Penerima & Saringan (AL-17) */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('pretreatment'))}>
            <rect x="210" y="110" width="175" height="165" rx="10" fill="#1e293b" stroke={isScreenClogged ? '#eab308' : '#64748b'} strokeWidth="4" />
            <text x="297" y="135" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              2. Bak Penerima &amp; Saringan
            </text>
            <path d="M 270 155 L 270 235 M 297 155 L 297 235 M 324 155 L 324 235" stroke="#fbbf24" strokeWidth="4" />
            <text x="297" y="255" fill={isScreenClogged ? '#fbbf24' : '#34d399'} fontSize="9" fontWeight="bold" textAnchor="middle">
              Beda Air: {telemetry.screenHeadlossCm ?? 5} cm (normal &lt; 15 cm)
            </text>
          </g>

          <path d="M 385 192 L 425 192" fill="none" stroke="#ffcc81" strokeWidth="7" className="anim-flow-pipe" />

          {/* Station 3: Pemisahan Padatan-Cairan */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('treatment'))}>
            <rect x="425" y="110" width="165" height="165" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="4" />
            <text x="507" y="135" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              3. Pemisahan Padatan
            </text>
            <text x="507" y="150" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Padatan ke L · Filtrat ke Ekualisasi
            </text>
            <rect x="445" y="170" width="125" height="80" fill="#0f172a" rx="6" />
            <text x="507" y="205" fill="#00cfff" fontSize="9" fontWeight="bold" textAnchor="middle">
              Cairan → 1. Bak Ekualisasi
            </text>
            <text x="507" y="226" fill="#ffcc81" fontSize="9" fontWeight="bold" textAnchor="middle">
              Padatan → Pengolahan L
            </text>
          </g>

          {/* Filtrat cair (biru) menuju Bak Ekualisasi */}
          <path d="M 507 275 L 507 325 L 775 325" fill="none" stroke="#00cfff" strokeWidth="5" className="anim-flow-pipe" />
          <text x="640" y="316" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
            Filtrat Cair → 1. Bak Ekualisasi Gabungan
          </text>

          {/* Padatan lumpur (cokelat) menuju Pengolahan Lumpur (L) */}
          <path d="M 590 192 L 625 192" fill="none" stroke="#ffcc81" strokeWidth="6" className="anim-flow-pipe" />

          {/* Station 4: Pengolahan Lumpur (L) */}
          <g className="cursor-pointer" onClick={() => onSelectObject(findObj('storage'))}>
            <rect x="625" y="110" width="150" height="165" rx="10" fill="#1e293b" stroke={isSludgeFull ? '#dc2626' : '#64748b'} strokeWidth="4" />
            <text x="700" y="135" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              4. Pengolahan Lumpur (L)
            </text>
            <text x="700" y="150" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Penebalan, Stabilisasi, Pengeringan
            </text>
            <rect x="640" y="170" width="120" height="80" fill="#451a03" rx="6" />
            <text x="700" y="210" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
              Kapasitas: {telemetry.driedSludgeLevelPercent ?? 35}%
            </text>
            <text x="700" y="228" fill="#ffffff" fontSize="8" textAnchor="middle">
              {isSludgeFull ? '⚠️ Bak Pengering Penuh' : 'Siap Olah / Panen'}
            </text>
          </g>
        </svg>

        <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2">
          {isScreenClogged && (
            <button
              onClick={() => onExecuteAction('Bersihkan saringan dari sampah tersangkut', 'clean_screen')}
              className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>Bersihkan Saringan (AL-17)</span>
            </button>
          )}
          {isTruckQueue && (
            <button
              onClick={() => onExecuteAction('Atur jadwal truk atau buka unit cadangan', 'buffer_truck')}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Atur Jadwal Truk (AL-03)</span>
            </button>
          )}
          {isSludgeFull && (
            <button
              onClick={() => onExecuteAction('Panen lumpur kering untuk bahan kompos', 'harvest_sludge')}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Kosongkan Bak Pengering (AL-06)</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* INT-1, INT-2, INT-3: KANVAS TERINTEGRASI (1752 x 897 px)                   */
  /* -------------------------------------------------------------------------- */
  const stage: 1 | 2 | 3 =
    missionId === 'INT-1' ? 1 : missionId === 'INT-2' ? 2 : 3;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 text-slate-900">
      <IntegratedDiagramCanvas
        mode="simulation"
        activeStage={stage}
        telemetry={telemetry}
        activeAlerts={activeAlerts}
        objects={objects}
        onSelectObject={onSelectObject}
        openedNarrativeIds={openedNarrativeIds}
        isPlaying={true}
        speedMultiplier={1}
        allowZoom={true}
      />
    </div>
  );
};
