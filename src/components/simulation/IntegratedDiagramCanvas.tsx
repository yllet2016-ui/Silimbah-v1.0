import React, { useState, useEffect } from 'react';
import {
  ActiveAlert,
  SimulationObjectDef,
  SimulationTelemetry,
} from '../../types';
import { Maximize2, X } from 'lucide-react';

interface IntegratedDiagramCanvasProps {
  mode: 'simulation' | 'theory';
  activeStage?: 1 | 2 | 3 | 'all';
  telemetry?: SimulationTelemetry;
  activeAlerts?: ActiveAlert[];
  objects?: SimulationObjectDef[];
  onSelectObject?: (obj: SimulationObjectDef) => void;
  openedNarrativeIds?: Set<string>;
  isPlaying?: boolean;
  speedMultiplier?: number;
  allowZoom?: boolean;
}

interface HotspotCoord {
  objectId: string;
  label: string;
  x: number;
  y: number;
  stage: 1 | 2 | 3;
}

// Koordinat tepat mengikuti penampang_terintegrasi_67fe8078.png (1752 × 897 px)
// dan ID objek tepat mengikuti mockData.ts
const HOTSPOT_COORDS: HotspotCoord[] = [
  // Stage 1: Pendahuluan (y: 92–388)
  { objectId: 'obj_int_drainase', label: 'Drainase Lingkungan (Terbuka)', x: 360, y: 188, stage: 1 },
  { objectId: 'obj_int_bak_pengambilan', label: 'Bak Pengambilan', x: 662, y: 182, stage: 1 },
  { objectId: 'obj_int_saringan', label: 'Saringan', x: 895, y: 180, stage: 1 },
  { objectId: 'obj_int_pemisah_lemak', label: 'Pemisah Lemak', x: 1125, y: 180, stage: 1 },
  { objectId: 'obj_int_bak_penerima_tinja', label: 'Bak Penerima Lumpur Tinja & Saringan', x: 855, y: 302, stage: 1 },
  { objectId: 'obj_int_pemisahan_pc', label: 'Pemisahan Padatan–Cairan', x: 1110, y: 302, stage: 1 },
  { objectId: 'obj_int_ekualisasi', label: '1. Bak Pengumpul / Ekualisasi Gabungan', x: 1500, y: 255, stage: 1 },

  // Stage 2: Pengolahan Biologis (y: 388–628)
  { objectId: 'obj_int_abr', label: '2. Reaktor Anaerob Bersekat (ABR)', x: 1425, y: 488, stage: 2 },
  { objectId: 'obj_int_biofilter', label: '3. Biofilter Anaerob', x: 1043, y: 490, stage: 2 },
  { objectId: 'obj_int_gas', label: 'Pengelolaan Gas', x: 900, y: 404, stage: 2 },
  { objectId: 'obj_int_aerasi', label: '4. Bak Aerasi Aerob', x: 665, y: 488, stage: 2 },
  { objectId: 'obj_int_blower', label: 'Blower Udara', x: 545, y: 405, stage: 2 },
  { objectId: 'obj_int_pengendap_akhir', label: '5. Pengendap Akhir', x: 298, y: 495, stage: 2 },
  { objectId: 'obj_int_lumpur_l', label: 'Pengolahan Lumpur (L)', x: 552, y: 598, stage: 2 },

  // Stage 3: Pengolahan Akhir (y: 628–818)
  { objectId: 'obj_int_filter_pasir', label: '6. Filter Pasir', x: 277, y: 720, stage: 3 },
  { objectId: 'obj_int_disinfeksi', label: '7. Disinfeksi', x: 613, y: 725, stage: 3 },
  { objectId: 'obj_int_deklorinasi', label: 'Deklorinasi bila perlu', x: 810, y: 730, stage: 3 },
  { objectId: 'obj_int_bak_kontrol', label: '8. Bak Kontrol Akhir', x: 985, y: 720, stage: 3 },
  { objectId: 'obj_int_penampung', label: '9. Bak Penampung Air Olahan', x: 1245, y: 722, stage: 3 },
  { objectId: 'obj_int_taman', label: 'Taman / Tanaman Nonpangan', x: 1565, y: 695, stage: 3 },
  { objectId: 'obj_int_badan_kali', label: 'Badan Kali', x: 1595, y: 775, stage: 3 },
  { objectId: 'obj_int_recycle_r', label: 'Pengembalian Terkendali (R)', x: 1288, y: 798, stage: 3 },
];

interface AlertHighlightBox {
  x: number;
  y: number;
  w: number;
  h: number;
  badgeX: number;
  badgeY: number;
}

// Kotak sorotan & lencana "!" tepat di atas unit penampang_terintegrasi_67fe8078.png
const ALERT_HIGHLIGHT_MAP: Record<string, AlertHighlightBox> = {
  'AL-03': { x: 760, y: 262, w: 195, h: 82, badgeX: 948, badgeY: 266 },
  'AL-17': { x: 816, y: 138, w: 158, h: 88, badgeX: 966, badgeY: 142 },
  'AL-07': { x: 1036, y: 138, w: 178, h: 88, badgeX: 1206, badgeY: 142 },
  'AL-09': { x: 1356, y: 148, w: 282, h: 200, badgeX: 1628, badgeY: 154 },
  'AL-16': { x: 1356, y: 148, w: 282, h: 200, badgeX: 1628, badgeY: 154 },
  'AL-04': { x: 1232, y: 428, w: 382, h: 122, badgeX: 1604, badgeY: 434 },
  'AL-05': { x: 1232, y: 428, w: 382, h: 122, badgeX: 1604, badgeY: 434 },
  'AL-10': { x: 902, y: 428, w: 278, h: 122, badgeX: 1170, badgeY: 434 },
  'AL-20': { x: 774, y: 388, w: 235, h: 42, badgeX: 1002, badgeY: 394 },
  'AL-11': { x: 502, y: 428, w: 336, h: 122, badgeX: 828, badgeY: 434 },
  'AL-12': { x: 178, y: 428, w: 236, h: 134, badgeX: 404, badgeY: 434 },
  'AL-06': { x: 525, y: 584, w: 58, h: 40, badgeX: 580, badgeY: 586 },
  'AL-18': { x: 164, y: 658, w: 232, h: 124, badgeX: 386, badgeY: 664 },
  'AL-13': { x: 478, y: 658, w: 274, h: 124, badgeX: 742, badgeY: 664 },
  'AL-19': { x: 478, y: 658, w: 274, h: 124, badgeX: 742, badgeY: 664 },
  'AL-08': { x: 878, y: 658, w: 220, h: 124, badgeX: 1088, badgeY: 664 },
  'AL-21': { x: 1146, y: 658, w: 196, h: 124, badgeX: 1332, badgeY: 664 },
};

export const IntegratedDiagramCanvas: React.FC<IntegratedDiagramCanvasProps> = ({
  mode,
  activeStage = 'all',
  telemetry,
  activeAlerts = [],
  objects = [],
  onSelectObject,
  openedNarrativeIds,
  isPlaying = true,
  speedMultiplier = 1,
  allowZoom = true,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = isPlaying && !prefersReducedMotion;
  const speed = Math.max(0.5, speedMultiplier || 1);

  const isBlowerActive = mode === 'theory' ? true : telemetry?.blowerActive !== false;
  const isRasActive = mode === 'theory' ? true : telemetry?.rasPumpActive !== false;
  const isGasIsolated = mode === 'simulation' && telemetry?.gasIsolated === true;
  const isRiverValveOpen =
    mode === 'theory' ? true : telemetry?.valveRiverOpen === true;
  const isIrrigationOpen =
    mode === 'theory' ? true : telemetry?.valveIrrigationOpen !== false;

  const dur = (baseSec: number) => `${(baseSec / speed).toFixed(2)}s`;

  const visibleHotspots = HOTSPOT_COORDS.filter((h) => {
    if (mode === 'theory') return false;
    if (activeStage === 'all') return true;
    return h.stage === activeStage;
  }).filter((h) => objects.some((o) => o.id === h.objectId));

  const renderSvgDiagram = (isModal = false) => (
    <div className="relative w-full aspect-[1752/897] bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs select-none">
      {/* Base raster diagram: 1752 × 897 px */}
      <img
        src="/assets/penampang_terintegrasi.png"
        alt="Penampang skematis pengolahan grey water dan black water terintegrasi"
        className="w-full h-full object-fill block"
      />

      {/* Interactive SVG Layer (exact viewBox matching 1752 × 897) */}
      <svg
        viewBox="0 0 1752 897"
        className="absolute inset-0 w-full h-full"
        aria-label="Lapisan penanda aliran dan titik informasi unit"
      >
        <defs>
          {/* 1. Grey Water Liquid Path (#00cfff): Drainase -> Bak Pengambilan -> Saringan -> Pemisah Lemak -> Unit 1 Ekualisasi */}
          <path
            id={`flow_gw_1_${isModal}`}
            d="M 165 196 L 1262 196 L 1262 238 L 1358 238"
          />

          {/* 2. Black Water Sludge/Solids (#ffcc81): Toilet -> Tangki Septik -> Penyedotan Truk -> Bak Penerima */}
          <path
            id={`flow_bw_septic_${isModal}`}
            d="M 155 304 L 420 304 L 560 304"
          />
          <path
            id={`flow_bw_receive_${isModal}`}
            d="M 725 300 L 950 300"
          />

          {/* 3. Black Water Liquid Filtrate (#00cfff): Bak Penerima -> Pemisahan Padatan-Cairan -> Unit 1 Ekualisasi */}
          <path
            id={`flow_bw_filtrat_${isModal}`}
            d="M 950 288 L 1262 288 L 1262 252 L 1358 252"
          />

          {/* 4. Solids to Sludge Treatment L (#ffcc81) */}
          <path
            id={`flow_l_pc_${isModal}`}
            d="M 1032 328 L 1032 365"
          />
          <path
            id={`flow_l_abr_${isModal}`}
            d="M 1560 542 L 1560 578"
          />
          <path
            id={`flow_l_bio_${isModal}`}
            d="M 1012 542 L 1012 578"
          />

          {/* 5. Stage 1 -> Stage 2 Liquid (#00cfff): Bak Ekualisasi -> right pipe -> 2. ABR */}
          <path
            id={`flow_eq_to_abr_${isModal}`}
            d="M 1635 250 L 1672 250 L 1672 486 L 1612 486"
          />

          {/* 6. Stage 2 Biological Chain Liquid (#00cfff, right-to-left) */}
          <path
            id={`flow_abr_to_bio_${isModal}`}
            d="M 1235 480 L 1175 480"
          />
          <path
            id={`flow_bio_to_aer_${isModal}`}
            d="M 905 480 L 835 480"
          />
          <path
            id={`flow_aer_to_clar_${isModal}`}
            d="M 505 480 L 410 480"
          />

          {/* 7. Stage 2 -> Stage 3 Liquid (#00cfff): 5. Pengendap Akhir -> left pipe -> 6. Filter Pasir */}
          <path
            id={`flow_clar_to_sand_${isModal}`}
            d="M 180 465 L 115 465 L 115 715 L 168 715"
          />

          {/* 8. Stage 3 End Chain Liquid (#00cfff): 6 -> 7 -> 8 -> 9 */}
          <path
            id={`flow_end_1_${isModal}`}
            d="M 392 715 L 480 715"
          />
          <path
            id={`flow_end_2_${isModal}`}
            d="M 750 715 L 880 715"
          />
          <path
            id={`flow_end_3_${isModal}`}
            d="M 1095 715 L 1150 715"
          />

          {/* 9. RAS & Excess Sludge to L (#ffcc81): 5. Pengendap Akhir -> RAS -> 4. Bak Aerasi & L */}
          <path
            id={`flow_ras_${isModal}`}
            d="M 295 558 L 295 595 L 495 595 L 495 515 L 505 515"
          />
          <path
            id={`flow_was_l_${isModal}`}
            d="M 495 595 L 548 595 L 548 614"
          />

          {/* 10. Air from Blower Udara to 4. Bak Aerasi (#fb923c) */}
          <path
            id={`flow_air_1_${isModal}`}
            d="M 592 412 L 604 412 L 604 520 L 795 520"
          />
          <path
            id={`flow_air_2_${isModal}`}
            d="M 604 520 L 542 520"
          />

          {/* 11. Biogas (#facc15): 2. ABR & 3. Biofilter -> Pengelolaan Gas */}
          <path
            id={`flow_gas_abr_${isModal}`}
            d="M 1405 430 L 1405 405 L 1005 405"
          />
          <path
            id={`flow_gas_bio_${isModal}`}
            d="M 1043 430 L 1043 405 L 1005 405"
          />

          {/* 12. Irrigation Reuse (#c084fc): 9. Penampung -> Taman / Tanaman Nonpangan */}
          <path
            id={`flow_irigasi_${isModal}`}
            d="M 1338 704 L 1375 692 L 1615 692"
          />

          {/* 13. River Discharge (#00cfff): 9. Penampung -> Badan Kali (hanya saat katup dibuka) */}
          <path
            id={`flow_kali_${isModal}`}
            d="M 1338 748 L 1415 748 L 1490 765"
          />

          {/* 14. Controlled Return R */}
          <path
            id={`flow_r_bottom_${isModal}`}
            d="M 205 778 L 205 800 L 1288 800 L 1288 778"
          />
          <path
            id={`flow_r_top_${isModal}`}
            d="M 1535 128 L 1535 162"
          />
        </defs>

        {/* Stage Dimming Overlays (Inactive stages dimmed with semi-transparent white) */}
        {mode === 'simulation' && activeStage === 1 && (
          <>
            <rect x="0" y="388" width="1752" height="240" fill="rgba(255, 255, 255, 0.72)" />
            <rect x="0" y="628" width="1752" height="190" fill="rgba(255, 255, 255, 0.72)" />
          </>
        )}
        {mode === 'simulation' && activeStage === 2 && (
          <>
            <rect x="0" y="92" width="1752" height="296" fill="rgba(255, 255, 255, 0.72)" />
            <rect x="0" y="628" width="1752" height="190" fill="rgba(255, 255, 255, 0.72)" />
          </>
        )}
        {mode === 'simulation' && activeStage === 3 && (
          <>
            <rect x="0" y="92" width="1752" height="296" fill="rgba(255, 255, 255, 0.72)" />
            <rect x="0" y="388" width="1752" height="240" fill="rgba(255, 255, 255, 0.72)" />
          </>
        )}

        {/* Dashed R (Olah Ulang) emphasis lines */}
        <path
          d="M 205 778 L 205 800 L 1288 800 L 1288 778"
          fill="none"
          stroke="#ea580c"
          strokeWidth="4"
          strokeDasharray="10 8"
          opacity={mode === 'simulation' && activeStage !== 3 ? 0.25 : 0.85}
        />
        <path
          d="M 1535 128 L 1535 162"
          fill="none"
          stroke="#ea580c"
          strokeWidth="4"
          strokeDasharray="8 6"
          opacity={mode === 'simulation' && activeStage === 2 ? 0.25 : 0.85}
        />

        {/* Animated Flow Markers (<animateMotion>) — Direction markers */}
        {shouldAnimate && (
          <g>
            {/* Grey Water Liquid #00cfff */}
            {[0, 1, 2, 3].map((idx) => (
              <circle key={`gw_${idx}`} r="6.5" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
                <animateMotion dur={dur(6.0)} begin={`${(idx * 1.5) / speed}s`} repeatCount="indefinite">
                  <mpath href={`#flow_gw_1_${isModal}`} />
                </animateMotion>
              </circle>
            ))}

            {/* Black Water Solids & Truck #ffcc81 */}
            <circle r="6" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
              <animateMotion dur={dur(3.2)} repeatCount="indefinite">
                <mpath href={`#flow_bw_septic_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="6" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
              <animateMotion dur={dur(2.2)} repeatCount="indefinite">
                <mpath href={`#flow_bw_receive_${isModal}`} />
              </animateMotion>
            </circle>

            {/* Black Water Liquid Filtrate -> Unit 1 Ekualisasi (#00cfff) */}
            {[0, 1].map((idx) => (
              <circle key={`bwf_${idx}`} r="6.5" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
                <animateMotion dur={dur(3.6)} begin={`${(idx * 1.8) / speed}s`} repeatCount="indefinite">
                  <mpath href={`#flow_bw_filtrat_${isModal}`} />
                </animateMotion>
              </circle>
            ))}

            {/* Sludge outlets to L (#ffcc81) */}
            <circle r="5" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
              <animateMotion dur={dur(1.5)} repeatCount="indefinite">
                <mpath href={`#flow_l_pc_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="5" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
              <animateMotion dur={dur(1.5)} repeatCount="indefinite">
                <mpath href={`#flow_l_abr_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="5" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
              <animateMotion dur={dur(1.5)} repeatCount="indefinite">
                <mpath href={`#flow_l_bio_${isModal}`} />
              </animateMotion>
            </circle>

            {/* Unit 1 Ekualisasi -> Unit 2 ABR (#00cfff) */}
            {[0, 1].map((idx) => (
              <circle key={`eq_abr_${idx}`} r="6.5" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
                <animateMotion dur={dur(2.6)} begin={`${(idx * 1.3) / speed}s`} repeatCount="indefinite">
                  <mpath href={`#flow_eq_to_abr_${isModal}`} />
                </animateMotion>
              </circle>
            ))}

            {/* Stage 2 Liquid Chain (#00cfff) */}
            <circle r="6" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
              <animateMotion dur={dur(1.4)} repeatCount="indefinite">
                <mpath href={`#flow_abr_to_bio_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="6" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
              <animateMotion dur={dur(1.4)} repeatCount="indefinite">
                <mpath href={`#flow_bio_to_aer_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="6" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
              <animateMotion dur={dur(1.5)} repeatCount="indefinite">
                <mpath href={`#flow_aer_to_clar_${isModal}`} />
              </animateMotion>
            </circle>

            {/* Stage 2 -> Stage 3 Liquid (#00cfff) */}
            {[0, 1].map((idx) => (
              <circle key={`clar_sand_${idx}`} r="6.5" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
                <animateMotion dur={dur(2.8)} begin={`${(idx * 1.4) / speed}s`} repeatCount="indefinite">
                  <mpath href={`#flow_clar_to_sand_${isModal}`} />
                </animateMotion>
              </circle>
            ))}

            {/* Stage 3 End Chain (#00cfff) */}
            <circle r="6" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
              <animateMotion dur={dur(1.5)} repeatCount="indefinite">
                <mpath href={`#flow_end_1_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="6" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
              <animateMotion dur={dur(1.7)} repeatCount="indefinite">
                <mpath href={`#flow_end_2_${isModal}`} />
              </animateMotion>
            </circle>
            <circle r="6" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
              <animateMotion dur={dur(1.3)} repeatCount="indefinite">
                <mpath href={`#flow_end_3_${isModal}`} />
              </animateMotion>
            </circle>

            {/* RAS (#ffcc81) — Berhenti jika pompa RAS mati */}
            {isRasActive && (
              <circle r="6" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
                <animateMotion dur={dur(2.8)} repeatCount="indefinite">
                  <mpath href={`#flow_ras_${isModal}`} />
                </animateMotion>
              </circle>
            )}
            <circle r="5" fill="#ffcc81" stroke="#92400e" strokeWidth="1.5">
              <animateMotion dur={dur(1.6)} repeatCount="indefinite">
                <mpath href={`#flow_was_l_${isModal}`} />
              </animateMotion>
            </circle>

            {/* Air #fb923c — Berhenti otomatis saat blower mati! */}
            {isBlowerActive && (
              <>
                {[0, 1].map((idx) => (
                  <circle key={`air1_${idx}`} r="6" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5">
                    <animateMotion dur={dur(2.2)} begin={`${(idx * 1.1) / speed}s`} repeatCount="indefinite">
                      <mpath href={`#flow_air_1_${isModal}`} />
                    </animateMotion>
                  </circle>
                ))}
                <circle r="5.5" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5">
                  <animateMotion dur={dur(1.5)} repeatCount="indefinite">
                    <mpath href={`#flow_air_2_${isModal}`} />
                  </animateMotion>
                </circle>
              </>
            )}

            {/* Biogas #facc15 — Berhenti jika saluran gas diisolasi */}
            {!isGasIsolated && (
              <>
                <circle r="6" fill="#facc15" stroke="#854d0e" strokeWidth="1.5">
                  <animateMotion dur={dur(2.8)} repeatCount="indefinite">
                    <mpath href={`#flow_gas_abr_${isModal}`} />
                  </animateMotion>
                </circle>
                <circle r="6" fill="#facc15" stroke="#854d0e" strokeWidth="1.5">
                  <animateMotion dur={dur(1.8)} repeatCount="indefinite">
                    <mpath href={`#flow_gas_bio_${isModal}`} />
                  </animateMotion>
                </circle>
              </>
            )}

            {/* Irrigation #c084fc */}
            {isIrrigationOpen && (
              <circle r="6.5" fill="#c084fc" stroke="#6b21a8" strokeWidth="1.5">
                <animateMotion dur={dur(2.2)} repeatCount="indefinite">
                  <mpath href={`#flow_irigasi_${isModal}`} />
                </animateMotion>
              </circle>
            )}

            {/* River Discharge #00cfff — HANYA muncul bila katup ke badan kali dibuka! */}
            {isRiverValveOpen && (
              <circle r="6.5" fill="#00cfff" stroke="#0369a1" strokeWidth="1.5">
                <animateMotion dur={dur(1.8)} repeatCount="indefinite">
                  <mpath href={`#flow_kali_${isModal}`} />
                </animateMotion>
              </circle>
            )}

            {/* Controlled Olah Ulang R Markers */}
            {[0, 1].map((idx) => (
              <circle key={`rb_${idx}`} r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5">
                <animateMotion dur={dur(5.4)} begin={`${(idx * 2.7) / speed}s`} repeatCount="indefinite">
                  <mpath href={`#flow_r_bottom_${isModal}`} />
                </animateMotion>
              </circle>
            ))}
            <circle r="5.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5">
              <animateMotion dur={dur(1.6)} repeatCount="indefinite">
                <mpath href={`#flow_r_top_${isModal}`} />
              </animateMotion>
            </circle>
          </g>
        )}

        {/* Blower Off Indicator X badge */}
        {!isBlowerActive && (
          <g>
            <circle cx="592" cy="402" r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
            <text x="592" y="407" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">
              ✕
            </text>
          </g>
        )}

        {/* River Valve Closed Badge when closed */}
        {mode === 'simulation' && !isRiverValveOpen && (
          <g>
            <rect x="1352" y="758" width="106" height="22" rx="6" fill="#334155" opacity="0.92" />
            <text x="1405" y="773" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              Katup Kali Tutup
            </text>
          </g>
        )}

        {/* Alert Outlines (Red Kritis / Yellow Peringatan) & "!" Badges */}
        {mode === 'simulation' &&
          activeAlerts.map((alert) => {
            const box = ALERT_HIGHLIGHT_MAP[alert.code];
            if (!box) return null;
            const isCrit = alert.level === 'critical';
            const strokeColor = isCrit ? '#dc2626' : '#eab308';
            return (
              <g key={`alert_box_${alert.id}`}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx="10"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="6"
                />
                <circle
                  cx={box.badgeX}
                  cy={box.badgeY}
                  r="18"
                  fill={strokeColor}
                  stroke="#ffffff"
                  strokeWidth="3"
                />
                <text
                  x={box.badgeX}
                  y={box.badgeY + 6}
                  fill="#ffffff"
                  fontSize="20"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  !
                </text>
              </g>
            );
          })}

        {/* Interactive (i) Hotspots for Unit Narratives */}
        {visibleHotspots.map((hs) => {
          const obj = objects.find((o) => o.id === hs.objectId);
          if (!obj || !onSelectObject) return null;
          const isLearned = openedNarrativeIds?.has(obj.id);
          return (
            <g
              key={hs.objectId}
              className="cursor-pointer group"
              onClick={() => onSelectObject(obj)}
            >
              <circle
                cx={hs.x}
                cy={hs.y}
                r="19"
                fill={isLearned ? '#0d9488' : '#0f766e'}
                stroke="#ffffff"
                strokeWidth="3"
              />
              <text
                x={hs.x}
                y={hs.y + 6}
                fill="#ffffff"
                fontSize="18"
                fontWeight="bold"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                i
              </text>
              <title>{`Klik untuk narasi: ${obj.name}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="space-y-2.5">
      {/* Header bar with Perbesar button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500">
          {mode === 'simulation'
            ? 'Klik ikon (i) pada unit aktif untuk membuka narasi & parameter normal.'
            : 'Penampang skematis aliran terintegrasi (penanda menunjukkan arah aliran, bukan kecepatan).'}
        </span>
        {allowZoom && (
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Perbesar</span>
          </button>
        )}
      </div>

      {/* Main Canvas */}
      {renderSvgDiagram(false)}

      {/* Flow Legend & Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00cfff] border border-sky-700 inline-block" />
            <span>Cairan</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc81] border border-amber-700 inline-block" />
            <span>Lumpur/padatan</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c] border border-orange-700 inline-block" />
            <span>Udara</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-yellow-700 inline-block" />
            <span>Biogas</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc] border border-purple-700 inline-block" />
            <span>Irigasi</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="px-1 rounded bg-orange-600 text-white font-bold text-[10px]">R</span>
            <span>Olah ulang</span>
          </span>
          <span className="text-slate-400">· penanda menunjukkan arah, bukan kecepatan</span>
        </div>
        <span className="text-[10px] text-slate-500 italic">
          Skema konseptual, bukan gambar konstruksi
        </span>
      </div>

      {/* Fullscreen / Enlarge Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-7xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Penampang Skematis Pengolahan Air Limbah Domestik Terintegrasi
                </h3>
                <p className="text-xs text-slate-500">
                  Skema konseptual, bukan gambar konstruksi · Penanda menunjukkan arah aliran
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderSvgDiagram(true)}
          </div>
        </div>
      )}
    </div>
  );
};
