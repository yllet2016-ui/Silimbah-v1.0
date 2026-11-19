import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ALERT_CATALOG } from '../../data/mockData';
import {
  BookOpen,
  Search,
  Printer,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Award,
  Layers,
  Users,
  Compass,
  Cpu,
  FileText,
  Activity,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Info,
  Droplets,
  HelpCircle,
} from 'lucide-react';

interface NarrativeSection {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const ScreenAppNarrative: React.FC = () => {
  const { setCurrentScreen, switchUser, selectMission } = useApp();
  const [activeTab, setActiveTab] = useState<string>('bab1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const rawDocumentMarkdown = `# DOKUMEN NARASI FITUR & PANDUAN PENGGUNAAN APLIKASI SILIMBAH
Platform Pembelajaran Simulasi Gamifikasi Pengelolaan Air Limbah Domestik (Black Water & Grey Water)
Standar Baku Mutu: Permen LHK No. P.68/Menlhk/Setjen/Kum.1/8/2016 & SNI 2398:2017

## 1. PENDAHULUAN & ARSITEKTUR APLIKASI
SiLimbah adalah aplikasi web interaktif bergamifikasi untuk pelatihan teknis operator air limbah domestik Indonesia.
Aplikasi membagi pengolahan air limbah domestik menjadi dua jalur spesifik:
- Black Water (BW): Air limbah dari kloset/tinja manusia (tinggi mikroba patogen dan koli).
- Grey Water (GW): Air limbah dari kamar mandi, dapur, dan cucian (tinggi minyak, lemak, deterjen, fosfat).
- Terpadu (INT): Integrasi pemisahan saluran, ABR, dan kolam bio-indikator.

## 2. JALUR PEMBELAJARAN & MISI (PRD v1.1)
Terdapat 3 pilihan track pembelajaran:
1. Jalur Black Water (Maks 1.500 XP):
   - Pre-Test: Diagnostik awal.
   - BW-1: Kenali Black Water (100 XP).
   - BW-2: Rakit Tangki Septik Kedap SNI 2398:2017 (150 XP).
   - BW-3: Jadwal Penyedotan Lumpur L2T2 (200 XP).
   - BW-4: Penerimaan Lumpur Tinja — Truk tinja, bak penerima, saringan, pemisahan padatan-cairan ke bak ekualisasi (300 XP).
   - BW-5: Krisis Lumpur Tinja — Lonjakan setoran truk, saringan tersumbat, pengolahan lumpur (L) penuh (400 XP).
2. Jalur Grey Water (Maks 1.500 XP):
   - GW-1: Kenali Grey Water (100 XP).
   - GW-2: Saringan & Pemisah Lemak (150 XP).
   - GW-3: Biofilter Berjalan — ABR, biofilter anaerob, pengelolaan gas (200 XP).
   - GW-4: Aerasi & Pengendap Akhir — Bak aerasi aerob, blower udara, pengendap akhir, pompa RAS (300 XP).
   - GW-5: Pakai Ulang Aman — Filter pasir, disinfeksi klorinasi, deklorinasi, bak kontrol akhir nonpangan (400 XP).
3. Jalur Lengkap (Black Water + Grey Water + INT-1 s.d. INT-3, Maks 3.400 XP):
   - Seluruh misi BW dan GW + 3 misi berurutan INT-1 (200 XP), INT-2 (250 XP), INT-3 (300 XP).
   - Post-Test Kelulusan (300 XP): Ujian komprehensif penentu piagam.

## 3. SIMULASI INSTALASI & KANVAS TERINTEGRASI
Setiap misi simulasi dilengkapi diagram teknis interaktif dan kanvas penampang skematis terintegrasi (1752 x 897 px) dengan animasi penanda arah aliran (<animateMotion>), hotspot narasi (i), peredupan tahap non-aktif, sorotan alert merah/kuning, tombol Perbesar, serta submodul Animasi Aliran Terintegrasi di Modul Teori.

## 4. SISTEM ALERT LAPANGAN (AL-01 s/d AL-21)
- AL-01..AL-21 mencakup tinggi lumpur tangki septik, rembesan, setoran truk melebihi kapasitas, BOD efluen > 30 mg/L, pH, bak pengering penuh, lemak pemisah lemak >= 25%, minyak efluen > 5 mg/L, debit puncak, penyumbatan media biofilter, DO bak aerasi < 1,0 mg/L / blower mati, lumpur pengendap akhir >= 1/3, total coliform > 3.000/100 mL, level bak ekualisasi >= 90% (AL-16), saringan tersumbat (AL-17), filter pasir tersumbat (AL-18), sisa klorin di luar 0,2-1,0 mg/L (AL-19), detektor biogas >= 10% LEL / H2S >= 10 ppm (AL-20), dan pelepasan ke badan kali/irigasi saat belum memenuhi mutu (AL-21, penalti -10 poin).

## 5. GAMIFIKASI & FORMULA PENILAIAN
- Formula Skor Misi: (0.4 * Aksi Tepat) + (0.3 * Kecepatan) + (0.3 * Kualitas Efluen) - Penalti
- Formula Nilai Akhir: (40% * Rata-rata Skor Misi) + (60% * Skor Post-Test)
- Syarat Lulus & Piagam (KKM = 75): (a) semua misi di jalur minimal 1 bintang, (b) nilai post-test >= 75, dan (c) Nilai Akhir >= 75 (Pre-test tidak memengaruhi kelulusan).
- Predikat:
  * >= 85,0: Lulus Dengan Pujian
  * 80,0 - 84,9: Lulus Sangat Baik
  * 75,0 - 79,9: Lulus Baik
  * < 75,0 atau post-test < 75: Belum Lulus (Wajib Remedial Misi dan Ujian)
- Baku Mutu Permen LHK P.68/2016: pH 6.0-9.0, BOD <= 30 mg/L, COD <= 100 mg/L, TSS <= 30 mg/L, Minyak & Lemak <= 5 mg/L, Amonia <= 10 mg/L, Total Coliform <= 3.000 CFU/100 mL.
- 5 Jenjang Level Operator (% dari XP maksimum jalur: BW 1.500, GW 1.500, Lengkap 3.400):
  * Level 1 Calon Operator (0-14% · Lengkap: 0-509 XP · BW/GW: 0-224 XP)
  * Level 2 Operator Pratama (15-34% · Lengkap: 510-1.189 XP · BW/GW: 225-524 XP)
  * Level 3 Operator Muda (35-59% · Lengkap: 1.190-2.039 XP · BW/GW: 525-899 XP)
  * Level 4 Operator Madya (60-84% · Lengkap: 2.040-2.889 XP · BW/GW: 900-1.274 XP)
  * Level 5 Operator Utama (85-100% · Lengkap: 2.890-3.400 XP · BW/GW: 1.275-1.500 XP)
- 14 Lencana Keahlian (Badges).

## 6. MULTI-ROLE & 10 AKUN DEMO PRD
1. Peserta:
   - peserta.lengkap (UPTD PALD Kabupaten Sukamaju · Misi BW-4 aktif alert)
   - peserta.lulus (UPTD PALD Kabupaten Sukamaju · Lulus 100%, Nilai Akhir 91,2, siap cetak piagam)
   - peserta.bw (UPTD PALD Kabupaten Sukamaju · Jalur Black Water baru)
   - peserta.gw (IPAL Komunal RW 05 Mekarsari · Menguji reaktor anaerob bersekat (ABR) dan biofilter anaerob di GW-3)
2. Instruktur: instruktur.uptd (UPTD PALD Kabupaten Sukamaju), instruktur.iplt (IPLT Tirta Lestari Kota Sukamaju) — Evaluasi kelas, ekspor CSV, bank soal.
3. Admin Operator: admin.uptd (UPTD PALD Kabupaten Sukamaju), admin.ipal (IPAL Komunal RW 05 Mekarsari) — Kelola akun, kelas/angkatan, fasilitas IPAL/IPLT.
4. Pimpinan UPTD: pimpinan.uptd (Kepala UPTD PALD Kabupaten Sukamaju) — Laporan eksekutif, rekap kelulusan, ringkasan kepatuhan baku mutu.
5. Superadmin: superadmin (Multi-tenant operator UPTD PALD/IPLT, lisensi kuota).
Password default seluruh akun: SiLimbah#2026

## 7. CARA MENGGUNAKAN APLIKASI
- Sebagai Peserta: Login -> Pilih Jalur -> Selesaikan Misi -> Ikuti Briefing -> Pelajari Teori -> Lakukan Simulasi & Atasi Alert -> Selesaikan Kuis & Post-Test (target minimal 75,0) -> Unduh Piagam Kelulusan Pelatihan.
- Sebagai Instruktur: Buka Evaluasi Kelas -> Pantau Siswa Perlu Perhatian (< 75) -> Ekspor Laporan CSV -> Atur Soal Kuis.
- Sebagai Admin Operator: Kelola akun operator dan pantau status fasilitas tangki/truk.
- Sebagai Pimpinan / Publik: Verifikasi keaslian piagam via nomor sertifikat atau QR Code.
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawDocumentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sections: NarrativeSection[] = useMemo(() => [
    {
      id: 'bab1',
      title: 'Bab 1: Gambaran Umum & Arsitektur',
      shortDesc: 'Tujuan platform, pemisahan Black Water vs Grey Water, dan arsitektur sistem.',
      icon: <Droplets className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="space-y-6">
          <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 text-sm text-teal-900 leading-relaxed">
            <h4 className="font-bold text-teal-950 flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-teal-700" />
              Tujuan & Latar Belakang SiLimbah
            </h4>
            <p>
              <strong>SiLimbah</strong> dirancang sebagai media pembelajaran simulasi teknis bergamifikasi interaktif untuk operator air limbah domestik di Indonesia (UPTD PALD, IPLT, dan IPAL Komunal). Platform ini mentransformasikan panduan teknis Ditjen Cipta Karya Kementerian PUPR dan standar baku mutu <strong>Permen LHK No. P.68/2016</strong> menjadi lingkungan pelatihan praktis dengan umpan balik langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                Jalur Black Water (BW)
              </span>
              <h5 className="font-bold text-slate-900 mt-2 text-base">Air Limbah Hitam (Feses & Urin)</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Berasal eksklusif dari kloset dan peturasan. Karakteristik utama adalah konsentrasi mikroba patogen yang sangat tinggi (Total Coliform &gt; 1.000.000 CFU/100 mL), potensi gas beracun (H₂S, CH₄), serta akumulasi lumpur tinja padat yang memerlukan tangki septik SNI dan pengurasan berkala ke IPLT.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Standar SNI 2398:2017</span>
                <span className="text-teal-700">5 Misi Pembelajaran</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded uppercase tracking-wider">
                Jalur Grey Water (GW)
              </span>
              <h5 className="font-bold text-slate-900 mt-2 text-base">Air Limbah Abu-Abu (Non-Kloset)</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Berasal dari air bekas cucian piring (dapur), cucian pakaian, dan kamar mandi. Karakteristik utama adalah kandungan minyak &amp; lemak tinggi, surfaktan deterjen, fosfat, dan padatan tersuspensi (TSS). Membutuhkan saringan, pemisah lemak, ABR, biofilter anaerob, bak aerasi aerob dengan blower, pengendap akhir, filter pasir, disinfeksi, serta pemanfaatan ulang aman nonpangan.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Biologis, Aerasi &amp; Reuse</span>
                <span className="text-teal-700">5 Misi Pembelajaran</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-900 mb-2 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              16 Layar Antarmuka Lengkap di SiLimbah
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                '1. Login & Persona',
                '2. Pemilihan Jalur',
                '3. Peta Misi Gamifikasi',
                '4. Briefing & Panduan Ahli',
                '5. Modul Teori & Standar',
                '6. Simulasi & Diagram Animasi',
                '7. Kuis & Ujian Evaluasi',
                '8. Debriefing & Rekap Nilai',
                '9. Dashboard Peserta & XP',
                '10. Piagam Kelulusan Pelatihan',
                '11. Evaluasi Kelas Instruktur',
                '12. Detail Evaluasi Siswa',
                '13. Kelola Akun & Kelas',
                '14. Konten & Bank Soal',
                '15. Data Fasilitas IPAL/IPLT',
                '16. Superadmin & Lisensi',
              ].map((scr, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 font-medium text-slate-700">
                  {scr}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bab2',
      title: 'Bab 2: Jalur Misi & Kurikulum Teknis',
      shortDesc: 'Detail kurikulum BW-1 s/d BW-5, GW-1 s/d GW-5, serta INT-1, INT-2, dan INT-3.',
      icon: <Compass className="w-4 h-4 text-emerald-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Kurikulum SiLimbah tersusun dalam struktur berjenjang (*progression curve*). Jalur Lengkap berjumlah 15 misi (Pre-Test, 10 misi kolom BW &amp; GW, 3 misi integrasi berurutan INT-1 → INT-2 → INT-3, serta Post-Test) dengan total maksimum <strong>3.400 XP</strong>.
          </p>

          <div className="space-y-3">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Rangkaian Misi Jalur Black Water
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-amber-700">BW-1 · Level 1 (100 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Kenali Black Water</p>
                <p className="text-slate-600 mt-1">
                  Mempelajari risiko bakteri patogen, parameter BOD/COD kotoran manusia, serta ketentuan batas aman Permen LHK 68/2016.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-amber-700">BW-2 · Level 2 (150 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Rakit Tangki Septik Kedap (SNI 2398:2017)</p>
                <p className="text-slate-600 mt-1">
                  Merakit 8 komponen kunci: Pipa Inlet T, Ruang Lumpur, Ruang Endapan, Sekat Baffle, Pipa Outlet T, Resapan Kerikil, Pipa Ven T, dan Manhole Kontrol.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-amber-700">BW-3 · Level 3 (200 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Jadwal Penyedotan Lumpur</p>
                <p className="text-slate-600 mt-1">
                  Prosedur pengukuran ketebalan lumpur dengan batas kritis 2/3 kedalaman, penggunaan APD gas H₂S, dan penjadwalan truk tinja L2T2.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-amber-700">BW-4 · Level 4 (300 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Penerimaan Lumpur Tinja</p>
                <p className="text-slate-600 mt-1">
                  Simulasi penerimaan truk tinja, bak penerima lumpur tinja dan saringan, pemisahan padatan–cairan; cairan dialirkan ke bak ekualisasi dan padatan ke pengolahan lumpur (L).
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 md:col-span-2">
                <span className="font-mono font-bold text-amber-700">BW-5 · Level 5 (400 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Krisis Lumpur Tinja</p>
                <p className="text-slate-600 mt-1">
                  Menghadapi lonjakan setoran truk harian, saringan tersumbat, dan unit pengolahan lumpur (penebalan, stabilisasi, pengeringan) penuh dengan beberapa alert serentak.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              Rangkaian Misi Jalur Grey Water
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-teal-700">GW-1 · Level 1 (100 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Kenali Grey Water</p>
                <p className="text-slate-600 mt-1">
                  Mengenal kandungan minyak &amp; lemak sisa penggorengan dapur, surfaktan deterjen kamar mandi, dan dampak eutrofikasi perairan.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-teal-700">GW-2 · Level 2 (150 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Saringan &amp; Pemisah Lemak</p>
                <p className="text-slate-600 mt-1">
                  Mengoperasikan drainase lingkungan, bak pengambilan, saringan sampah, dan pemisah lemak dengan batas ketebalan minyak 25%.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-teal-700">GW-3 · Level 3 (200 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Biofilter Berjalan</p>
                <p className="text-slate-600 mt-1">
                  Mengelola reaktor anaerob bersekat (ABR) dan biofilter anaerob: debit masuk, pencucian penyumbatan media, pengelolaan gas, dan kualitas efluen.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-teal-700">GW-4 · Level 4 (300 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Aerasi &amp; Pengendap Akhir</p>
                <p className="text-slate-600 mt-1">
                  Mengoperasikan bak aerasi aerob dengan blower udara (target DO 1,5–3,0 mg/L), pengendap akhir, dan pompa lumpur balik (RAS).
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 md:col-span-2">
                <span className="font-mono font-bold text-teal-700">GW-5 · Level 5 (400 XP)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Pakai Ulang Aman</p>
                <p className="text-slate-600 mt-1">
                  Filter pasir, disinfeksi (klorinasi; deklorinasi bila sisa klorin &gt; 1,0 mg/L), bak kontrol akhir, dan pakai ulang khusus taman/tanaman nonpangan setelah memenuhi mutu.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
              <span className="font-mono font-bold text-indigo-700">INT-1 · 200 XP</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Pendahuluan &amp; Ekualisasi Gabungan</p>
              <p className="text-slate-700 mt-1">Tahap 1 terintegrasi: kendali drainase hujan, saringan, pemisah lemak, truk tinja, dan bak ekualisasi.</p>
            </div>
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
              <span className="font-mono font-bold text-indigo-700">INT-2 · 250 XP</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Pengolahan Biologis Terpadu</p>
              <p className="text-slate-700 mt-1">Tahap 2 terintegrasi: ABR, biofilter anaerob, blower aerasi aerob, pengendap akhir RAS, dan detektor biogas.</p>
            </div>
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
              <span className="font-mono font-bold text-indigo-700">INT-3 · 300 XP</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Pengolahan Akhir &amp; Pembuangan</p>
              <p className="text-slate-700 mt-1">Tahap 3 terintegrasi: filter pasir, klorinasi/deklorinasi, bak kontrol akhir, irigasi/badan kali, atau olah ulang (R).</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bab3',
      title: 'Bab 3: Simulasi Instalasi & Diagram Animasi',
      shortDesc: 'Penjelasan visual kanvas simulasi potongan melintang dan animasi fluida aktif.',
      icon: <Activity className="w-4 h-4 text-sky-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Fitur <strong>Simulasi Instalasi (Layar 6)</strong> menyajikan diagram potongan melintang (*cutaway technical SVG*) dengan komponen visual berstandar teknik sanitasi dan animasi pergerakan fluida yang dinamis:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Tangki Septik SNI (BW-2 &amp; BW-3)
              </h5>
              <ul className="mt-2 space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Dua kompartemen: Ruang pengendapan (2/3 volume) &amp; ruang lumpur (1/3 volume).</li>
                <li>Pipa ven berbentuk T dengan kawat kasa anti-serangga di bagian atas tanah.</li>
                <li>Indikator ketebalan lumpur interaktif dengan garis peringatan merah pada 2/3 kedalaman.</li>
                <li>Truk vakum tinja dengan selang hisap beranimasi cairan saat tombol pengurasan ditekan.</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                Penerimaan Lumpur Tinja (BW-4 &amp; BW-5)
              </h5>
              <ul className="mt-2 space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Kedatangan truk sedot tinja dan penjadwalan antrean harian.</li>
                <li>Bak penerima lumpur tinja dengan saringan kasar pencegah penyumbatan.</li>
                <li>Pemisahan padatan–cairan: cairan ke bak ekualisasi, padatan ke pengolahan lumpur (L).</li>
                <li>Penanganan multi-alert saat lonjakan ritase dan kapasitas pengeringan lumpur penuh.</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-600"></span>
                Saringan &amp; Pemisah Lemak (GW-2)
              </h5>
              <ul className="mt-2 space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Drainase lingkungan dan bak pengambilan awal untuk grey water rumah tangga.</li>
                <li>Saringan kasar dengan pantauan beda muka air hulu–hilir (&lt; 15 cm).</li>
                <li>Pemisah lemak dengan sekat penahan minyak terapung (ambang batas 25% volume bak).</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Biologis, Aerasi &amp; Kanvas Terintegrasi (GW-3..5 &amp; INT-1..3)
              </h5>
              <ul className="mt-2 space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Reaktor ABR dan biofilter anaerob dengan pengelolaan gas (CH₄ / H₂S).</li>
                <li>Bak aerasi aerob dengan blower udara (DO 1,5–3,0 mg/L), pengendap akhir, dan pompa RAS.</li>
                <li>Filter pasir, disinfeksi klorinasi, deklorinasi, bak kontrol akhir, irigasi/badan kali, serta jalur olah ulang (R).</li>
                <li>Kanvas penampang terintegrasi menampilkan penanda arah aliran dan peredupan tahap non-aktif.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <h5 className="font-bold text-slate-900 mb-1">Mekanisme Kontrol Interaktif pada Kanvas</h5>
            <p className="text-slate-600 leading-relaxed">
              Peserta mengklik aksi kontekstual sesuai tahap aktif (mis. <strong>"Kendalikan Pintu Drainase"</strong>, <strong>"Nyalakan Blower Cadangan"</strong>, <strong>"Jalankan Pompa Lumpur Balik"</strong>, <strong>"Isolasi Saluran Gas"</strong>, <strong>"Backwash Filter Pasir"</strong>, dan <strong>"Alihkan ke Olah Ulang (R)"</strong>) yang langsung memperbarui parameter operasi live.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'bab4',
      title: 'Bab 4: Sistem Alert Lapangan (AL-01 s/d AL-21)',
      shortDesc: 'Daftar lengkap kode alert malfungsi lapangan dan SOP tindakan penyelesaian PRD v1.1.',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Sistem simulasi memicu alarm lapangan otomatis sesuai kondisi operasional. Setiap alert memiliki tombol <strong>&ldquo;Kenapa ini terjadi?&rdquo;</strong> serta aturan clear otomatis setelah parameter pulih selama 1 siklus:
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-16">Kode</th>
                  <th className="p-3 w-24">Tingkat</th>
                  <th className="p-3">Kondisi Lapangan</th>
                  <th className="p-3">SOP Tindakan Perbaikan Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALERT_CATALOG.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-slate-800">{alert.code}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        alert.level === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : alert.level === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}>
                        {alert.level === 'critical' ? 'Kritis' : alert.level === 'warning' ? 'Peringatan' : 'Info'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-800 font-medium">{alert.triggerCondition}</td>
                    <td className="p-3 text-slate-600">{alert.correctAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'bab5',
      title: 'Bab 5: Gamifikasi & Standar Regulasi',
      shortDesc: 'Rumus penilaian misi, formula nilai akhir, sistem level XP, dan Permen LHK 68/2016.',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h5 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Formula Penilaian &amp; Kelulusan SiLimbah (KKM 75)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-800 block text-xs uppercase tracking-wide">
                  1. Formula Skor Misi Individu
                </span>
                <code className="block mt-2 font-mono text-slate-900 bg-white p-2.5 rounded-lg border border-slate-300 text-[11px]">
                  Skor = (0.4 × Aksi) + (0.3 × Waktu) + (0.3 × Efluen) - Penalti
                </code>
                <ul className="mt-2 space-y-1 text-slate-600 list-disc list-inside">
                  <li><strong>Aksi Tepat (40%)</strong>: Ketepatan menyelesaikan SOP instalasi.</li>
                  <li><strong>Kecepatan (30%)</strong>: Selesai di bawah target waktu misi.</li>
                  <li><strong>Kualitas Efluen (30%)</strong>: Kepatuhan baku mutu air buangan.</li>
                  <li><strong>Penalti</strong>: Penggunaan tombol petunjuk (-5 poin) &amp; salah SOP.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-800 block text-xs uppercase tracking-wide">
                  2. Formula Nilai Akhir &amp; Syarat Kelulusan
                </span>
                <code className="block mt-2 font-mono text-slate-900 bg-white p-2.5 rounded-lg border border-slate-300 text-[11px]">
                  Nilai Akhir = (40% × Rata-rata Misi) + (60% × Post-Test)
                </code>
                <p className="text-[11px] text-slate-600 mt-2">
                  Syarat lulus: semua misi minimal 1★, Post-Test ≥ 75, dan Nilai Akhir ≥ 75 (Pre-Test tidak memengaruhi kelulusan).
                </p>
                <ul className="mt-2 space-y-1 text-slate-600 list-disc list-inside">
                  <li><strong>≥ 85,0</strong>: Lulus Dengan Pujian</li>
                  <li><strong>80,0 – 84,9</strong>: Lulus Sangat Baik</li>
                  <li><strong>75,0 – 79,9</strong>: Lulus Baik</li>
                  <li><strong>&lt; 75,0 atau Post-Test &lt; 75</strong>: Belum Lulus (Wajib Remedial Misi &amp; Ujian)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-xs">
            <h5 className="font-bold text-slate-900 text-sm mb-3">
              Standar Baku Mutu Air Limbah Domestik (Permen LHK No. P.68/2016)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
              {[
                { param: 'pH', limit: '6.0 - 9.0', unit: '-' },
                { param: 'BOD', limit: '≤ 30', unit: 'mg/L' },
                { param: 'COD', limit: '≤ 100', unit: 'mg/L' },
                { param: 'TSS', limit: '≤ 30', unit: 'mg/L' },
                { param: 'Minyak & Lemak', limit: '≤ 5', unit: 'mg/L' },
                { param: 'Amonia', limit: '≤ 10', unit: 'mg/L' },
                { param: 'Total Coliform', limit: '≤ 3.000', unit: 'CFU/100 mL' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-semibold block">{item.param}</span>
                  <span className="font-mono font-bold text-teal-800 text-sm mt-1 block">{item.limit}</span>
                  <span className="text-[10px] text-slate-400">{item.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-xs">
            <h5 className="font-bold text-slate-900 text-sm mb-1">
              5 Jenjang Level Operator (% XP Maksimum Jalur)
            </h5>
            <p className="text-[11px] text-slate-500 mb-3">
              XP maksimum jalur: Lengkap = 3.400 XP · Black Water / Grey Water = 1.500 XP.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                { lvl: 'Level 1', name: 'Calon Operator', pct: '0–14%', rangeLengkap: '0–509 XP', rangeShort: 'BW/GW: 0–224 XP' },
                { lvl: 'Level 2', name: 'Operator Pratama', pct: '15–34%', rangeLengkap: '510–1.189 XP', rangeShort: 'BW/GW: 225–524 XP' },
                { lvl: 'Level 3', name: 'Operator Muda', pct: '35–59%', rangeLengkap: '1.190–2.039 XP', rangeShort: 'BW/GW: 525–899 XP' },
                { lvl: 'Level 4', name: 'Operator Madya', pct: '60–84%', rangeLengkap: '2.040–2.889 XP', rangeShort: 'BW/GW: 900–1.274 XP' },
                { lvl: 'Level 5', name: 'Operator Utama', pct: '85–100%', rangeLengkap: '2.890–3.400 XP', rangeShort: 'BW/GW: 1.275–1.500 XP' },
              ].map((lvl, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="font-mono text-[11px] font-bold text-teal-700">{lvl.lvl} ({lvl.pct})</span>
                  <p className="font-bold text-slate-800 mt-0.5">{lvl.name}</p>
                  <p className="text-[10px] font-mono text-slate-700 mt-1">{lvl.rangeLengkap}</p>
                  <p className="text-[10px] text-slate-400">{lvl.rangeShort}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bab6',
      title: 'Bab 6: Multi-Role & 10 Akun Demo PRD',
      shortDesc: 'Struktur hak akses 5 peran dan 10 akun demo untuk pengujian lengkap tanpa mendaftar.',
      icon: <Users className="w-4 h-4 text-purple-600" />,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-slate-600 leading-relaxed">
            Aplikasi menyediakan 10 akun demo siap uji (PRD Hal 20) yang mencakup seluruh peran operasional. Semua akun menggunakan password default: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700 font-mono font-bold">SiLimbah#2026</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                user: 'peserta.lengkap',
                role: 'Peserta (Jalur Lengkap)',
                org: 'UPTD PALD Kabupaten Sukamaju',
                state: 'Sedang di Misi BW-4 (Ada Alert Lapangan Aktif)',
                desc: 'Cocok untuk menguji simulasi penerimaan lumpur tinja dan penanganan alert secara langsung.',
              },
              {
                user: 'peserta.lulus',
                role: 'Peserta (Lulus)',
                org: 'UPTD PALD Kabupaten Sukamaju',
                state: 'Lulus 100% · Nilai Akhir 91,2 (Lulus Dengan Pujian)',
                desc: 'Cocok untuk langsung membuka & mencetak Piagam Kelulusan Pelatihan dan cek verifikasi QR.',
              },
              {
                user: 'peserta.bw',
                role: 'Peserta (Black Water)',
                org: 'UPTD PALD Kabupaten Sukamaju',
                state: 'Baru menyelesaikan BW-1',
                desc: 'Cocok untuk menguji perakitan tangki septik SNI (BW-2) dari awal.',
              },
              {
                user: 'peserta.gw',
                role: 'Peserta (Grey Water)',
                org: 'IPAL Komunal RW 05 Mekarsari',
                state: 'Sedang di Misi GW-3',
                desc: 'Cocok untuk menguji reaktor anaerob bersekat (ABR) dan biofilter anaerob di GW-3.',
              },
              {
                user: 'instruktur.uptd',
                role: 'Instruktur',
                org: 'UPTD PALD Kabupaten Sukamaju',
                state: 'Pengampu 24 Peserta Angkatan I',
                desc: 'Bisa membuka Evaluasi Kelas, melihat siswa remedial (< 75), dan ekspor data CSV.',
              },
              {
                user: 'instruktur.iplt',
                role: 'Instruktur',
                org: 'IPLT Tirta Lestari Kota Sukamaju',
                state: 'Pengampu 18 Peserta',
                desc: 'Bisa mengedit bank soal kuis dan menambahkan skenario simulasi baru.',
              },
              {
                user: 'admin.uptd',
                role: 'Admin Operator',
                org: 'UPTD PALD Kabupaten Sukamaju',
                state: 'Administrator Wilayah',
                desc: 'Bisa mengelola akun operator, membuat angkatan/kelas baru, dan monitoring kuota.',
              },
              {
                user: 'admin.ipal',
                role: 'Admin Operator',
                org: 'IPAL Komunal RW 05 Mekarsari',
                state: 'Administrator IPAL',
                desc: 'Memantau inventaris armada truk tinja dan data operasional IPAL Komunal.',
              },
              {
                user: 'pimpinan.uptd',
                role: 'Pimpinan Operator',
                org: 'Kepala UPTD PALD Kabupaten Sukamaju',
                state: 'Pengawas Eksekutif',
                desc: 'Melihat rangkuman kepatuhan baku mutu lingkungan dan rekapitulasi kelulusan.',
              },
              {
                user: 'superadmin',
                role: 'Superadmin Pusat',
                org: 'Kementerian / Pengelola Sistem',
                state: 'Akses Penuh Multi-Tenant',
                desc: 'Mengelola lisensi UPTD/IPLT se-Indonesia, menambah institusi, dan bank soal induk.',
              },
            ].map((acc, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">@{acc.user}</span>
                  <button
                    onClick={() => switchUser(acc.user)}
                    className="text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Beralih ke Akun Ini
                  </button>
                </div>
                <p className="text-slate-500 mt-0.5">{acc.role} · {acc.org}</p>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                    {acc.state}
                  </span>
                  <p className="text-slate-600 text-[11px] mt-1">{acc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'bab7',
      title: 'Bab 7: Panduan Penggunaan Langkah demi Langkah',
      shortDesc: 'Panduan praktis pengoperasian untuk Peserta, Instruktur, Admin, dan Verifikator.',
      icon: <HelpCircle className="w-4 h-4 text-teal-600" />,
      content: (
        <div className="space-y-6 text-xs">
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs">1</span>
              Panduan untuk Peserta Pelatihan (Operator)
            </h5>
            <ol className="list-decimal list-inside space-y-2 bg-white p-4 rounded-xl border border-slate-200 text-slate-700">
              <li>
                <strong>Pilih Jalur Belajar:</strong> Setelah login, buka <em>Peta Misi</em> dan tentukan jalur (Black Water, Grey Water, atau Lengkap).
              </li>
              <li>
                <strong>Kerjakan Pre-Test:</strong> Buka Misi Pre-Test untuk mengukur kompetensi dasar Anda (tidak mempengaruhi kelulusan akhir).
              </li>
              <li>
                <strong>Ikuti Briefing &amp; Modul Teori:</strong> Baca instruksi teknis dari mentor virtual (Pak Joko) serta pelajari rumus dan studi kasus lapangan.
              </li>
              <li>
                <strong>Lakukan Simulasi Instalasi:</strong> Buka kanvas simulasi. Pasang atau kendalikan komponen (misal: jalankan aerasi, buang lumpur, bersihkan kisi saringan).
              </li>
              <li>
                <strong>Selesaikan Kuis Evaluasi Misi:</strong> Jawab 5 soal pemahaman untuk mendapatkan bintang (★) dan bonus XP.
              </li>
              <li>
                <strong>Tuntaskan Post-Test:</strong> Setelah semua level terbuka, selesaikan ujian komprehensif 20 soal dengan target nilai minimal 75,0 dan Nilai Akhir ≥ 75,0.
              </li>
              <li>
                <strong>Cetak Piagam Kelulusan:</strong> Kunjungi menu <em>Piagam</em> untuk mengunduh piagam kelulusan pelatihan yang dilengkapi nomor registrasi dan kode QR verifikasi.
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs">2</span>
              Panduan untuk Instruktur &amp; Penguji Kelas
            </h5>
            <ol className="list-decimal list-inside space-y-2 bg-white p-4 rounded-xl border border-slate-200 text-slate-700">
              <li>
                <strong>Buka Menu Evaluasi Kelas:</strong> Pantau grafik statistik rata-rata kelas, tingkat kelulusan, dan persentase kepatuhan baku mutu.
              </li>
              <li>
                <strong>Identifikasi Peserta Berisiko:</strong> Filter tabel siswa pada kategori <em>Perlu Perhatian</em> (&lt; 75) untuk memberikan bimbingan khusus.
              </li>
              <li>
                <strong>Ekspor Data ke CSV:</strong> Klik tombol <em>Ekspor Rekap CSV</em> untuk arsip nilai dan pelaporan ke dinas terkait.
              </li>
              <li>
                <strong>Kelola Bank Soal:</strong> Di menu <em>Konten &amp; Bank Soal</em>, sesuaikan kunci jawaban dan tingkat kesulitan materi.
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">3</span>
              Panduan untuk Verifikasi Publik Piagam
            </h5>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 space-y-2">
              <p>
                Siapa pun (dinas, atasan, atau verifikator independen) dapat memverifikasi keabsahan piagam dengan membuka menu <strong>Cek Piagam / Verifikasi Publik</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Masukkan nomor sertifikat (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">SLB-2026-BWGW-001</code>).</li>
                <li>Sistem menampilkan status keaslian: <strong>Terverifikasi Sah</strong>, nama peserta, UPTD penerbit, nilai akhir, predikat, dan tanggal terbit.</li>
                <li>Scan QR Code pada piagam fisik/PDF langsung mengarahkan ke halaman verifikasi ini.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ], [switchUser]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q)
      );
    });
  }, [sections, searchQuery]);

  const currentSection = useMemo(() => {
    return sections.find((s) => s.id === activeTab) || sections[0];
  }, [sections, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <BookOpen className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Dokumen Panduan Aplikasi
            </span>
            <span className="text-slate-400 text-xs">Versi 1.1 · Magister Pradita 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dokumen Narasi Fitur &amp; Panduan Penggunaan SiLimbah
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Panduan komprehensif yang merangkum seluruh fitur nyata, kurikulum teknis Black Water &amp; Grey Water, diagram animasi instalasi, katalog alert lapangan (AL-01 s/d AL-21), sistem penilaian pelatihan, serta panduan pengoperasian langkah demi langkah untuk setiap peran.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              Cetak Dokumen / Simpan PDF
            </button>

            <button
              onClick={copyToClipboard}
              className="bg-teal-700/80 hover:bg-teal-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer border border-teal-500/40"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Teks Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-teal-200" />
                  Salin Seluruh Teks Narasi
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentScreen('simulation')}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              Buka Simulasi Langsung
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari fitur, alert, rumus, atau SOP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveTab(sec.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === sec.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {sec.icon}
              {sec.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Table of Contents */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
              Daftar Bab Narasi
            </h4>
            <div className="space-y-1">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                    activeTab === sec.id
                      ? 'bg-teal-50 text-teal-900 border border-teal-200 font-bold'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">{sec.icon}</span>
                  <div>
                    <p className="leading-tight">{sec.title}</p>
                    <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                      {sec.shortDesc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 text-xs space-y-3">
            <h5 className="font-bold flex items-center gap-1.5 text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              Akses Cepat Pengujian
            </h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Ingin langsung menguji fitur tertentu tanpa membaca seluruh bab?
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  switchUser('peserta.lengkap');
                  setCurrentScreen('simulation');
                }}
                className="w-full text-left p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center justify-between cursor-pointer"
              >
                <span>Uji Alert IPLT (BW-4)</span>
                <ArrowRight className="w-3 h-3 text-teal-400" />
              </button>
              <button
                onClick={() => {
                  switchUser('peserta.lulus');
                  setCurrentScreen('certificate_view');
                }}
                className="w-full text-left p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center justify-between cursor-pointer"
              >
                <span>Lihat Piagam Kelulusan</span>
                <ArrowRight className="w-3 h-3 text-teal-400" />
              </button>
              <button
                onClick={() => {
                  switchUser('instruktur.uptd');
                  setCurrentScreen('operator_dashboard');
                }}
                className="w-full text-left p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center justify-between cursor-pointer"
              >
                <span>Buka Evaluasi Kelas</span>
                <ArrowRight className="w-3 h-3 text-teal-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-1">
                {currentSection.icon}
                <span>{currentSection.title.split(':')[0]}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentSection.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentSection.shortDesc}
              </p>
            </div>

            {currentSection.content}

            {/* Bottom Next/Prev Pagination */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {(() => {
                const currentIndex = sections.findIndex((s) => s.id === activeTab);
                const prev = sections[currentIndex - 1];
                const next = sections[currentIndex + 1];

                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => setActiveTab(prev.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        ← {prev.title.split(':')[0]}
                      </button>
                    ) : <div />}

                    {next ? (
                      <button
                        onClick={() => setActiveTab(next.id)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        {next.title.split(':')[0]} →
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
