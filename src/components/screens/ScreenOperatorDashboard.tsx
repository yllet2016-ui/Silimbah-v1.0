import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Download,
  Filter,
  Search,
  ExternalLink,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

export const ScreenOperatorDashboard: React.FC = () => {
  const {
    currentUser,
    currentOperator,
    users,
    missions,
    inspectStudent,
    setCurrentScreen,
    kkmThreshold,
    alertLogs,
    getStudentFinalGrade,
    getLevelInfo,
    getTrackMaxXP,
  } = useApp();

  const role = currentUser?.role || 'instruktur';
  const op = currentOperator || {
    id: 'uptd_sukamaju',
    name: 'UPTD PALD Kabupaten Sukamaju',
    type: 'UPTD PALD',
    regency: 'Kabupaten Sukamaju',
    logoText: 'UPTD PALD',
    participantQuota: 50,
    licenseExpiry: '2027-12-31',
    licenseStatus: 'active',
    address: 'Jl. Pemuda No. 45',
  };

  // Filters state
  const [selectedCohort, setSelectedCohort] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Operator-filtered participants
  const operatorStudents = users.filter(
    (u) =>
      u.role === 'peserta' &&
      (role === 'superadmin' ? true : u.operatorId === op.id)
  );

  // Perlu Perhatian: nilai < 75 (misi/post-test/nilai akhir), tidak aktif >= 7 hari, atau gagal >= 3x
  const isStudentNeedingAttention = (s: typeof operatorStudents[number]) => {
    const isInactive = s.lastActive?.includes('8 hari') || s.lastActive?.includes('7 hari');
    const hasMultipleFails = Boolean(
      s.failedAttemptsCount && Object.values(s.failedAttemptsCount).some((v) => v >= 3)
    );
    const grade = getStudentFinalGrade(s);
    const belowKkmPost = s.postTestScore !== undefined && s.postTestScore < kkmThreshold;
    const belowKkmFinal = s.postTestScore !== undefined && grade.finalScore < kkmThreshold;
    const belowKkmMission = grade.avgMissionScore > 0 && grade.avgMissionScore < kkmThreshold;
    return isInactive || hasMultipleFails || belowKkmPost || belowKkmFinal || belowKkmMission;
  };

  const filteredStudents = operatorStudents.filter((s) => {
    if (selectedCohort !== 'all' && s.classCohort !== selectedCohort) return false;
    if (selectedTrack !== 'all' && s.track !== selectedTrack) return false;
    if (selectedStatus === 'lulus' && !s.certificateIssued && !getStudentFinalGrade(s).isEligible) return false;
    if (selectedStatus === 'perlu_perhatian' && !isStudentNeedingAttention(s)) return false;
    if (
      selectedStatus === 'dalam_proses' &&
      (s.certificateIssued || getStudentFinalGrade(s).isEligible || isStudentNeedingAttention(s))
    ) {
      return false;
    }
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // KPI calculations
  const totalStudents = operatorStudents.length;
  const passedKkmCount = operatorStudents.filter((s) => {
    const g = getStudentFinalGrade(s);
    return (s.postTestScore ?? 0) >= kkmThreshold && g.finalScore >= kkmThreshold;
  }).length;
  const graduatedCount = operatorStudents.filter((s) => s.certificateIssued).length;

  const preScores = operatorStudents.filter((s) => s.preTestScore !== undefined).map((s) => s.preTestScore!);
  const avgPre = preScores.length > 0 ? Math.round(preScores.reduce((a, b) => a + b, 0) / preScores.length) : 55;

  const postScores = operatorStudents.filter((s) => s.postTestScore !== undefined).map((s) => s.postTestScore!);
  const avgPost = postScores.length > 0 ? Math.round(postScores.reduce((a, b) => a + b, 0) / postScores.length) : 84;

  const pctKkm = totalStudents > 0 ? Math.round((passedKkmCount / totalStudents) * 100) : 0;
  const pctGraduated = totalStudents > 0 ? Math.round((graduatedCount / totalStudents) * 100) : 0;

  // Watchlist: Perlu Perhatian (< 75, inaktif >= 7 hari, atau gagal >= 3x)
  const studentsNeedingAttention = operatorStudents.filter(isStudentNeedingAttention);

  // Mission Difficulty Analytics
  const missionAnalytics = [
    { id: 'BW-1', name: 'Kenali Black Water', avgScore: 88, passRate: 95 },
    { id: 'BW-2', name: 'Rakit Tangki Septik Kedap', avgScore: 82, passRate: 88 },
    { id: 'BW-3', name: 'Jadwal Penyedotan Lumpur', avgScore: 78, passRate: 80 },
    { id: 'BW-4', name: 'Penerimaan Lumpur Tinja', avgScore: 74, passRate: 72 },
    { id: 'BW-5', name: 'Krisis Lumpur Tinja', avgScore: 68, passRate: 64 },
    { id: 'GW-2', name: 'Saringan & Pemisah Lemak', avgScore: 84, passRate: 90 },
    { id: 'GW-3', name: 'Biofilter Berjalan', avgScore: 80, passRate: 82 },
    { id: 'GW-4', name: 'Aerasi & Pengendap Akhir', avgScore: 76, passRate: 75 },
    { id: 'GW-5', name: 'Pakai Ulang Aman', avgScore: 73, passRate: 71 },
    { id: 'INT-1', name: 'Pendahuluan & Ekualisasi Gabungan', avgScore: 72, passRate: 68 },
    { id: 'INT-2', name: 'Pengolahan Biologis Terpadu', avgScore: 69, passRate: 65 },
    { id: 'INT-3', name: 'Pengolahan Akhir & Pembuangan', avgScore: 66, passRate: 62 },
  ];

  const handleExportCSV = () => {
    const headers = 'ID,Nama,Jalur,Level,Total_XP,Pre_Test,Post_Test,Status_Lulus,Terakhir_Aktif\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.track || 'lengkap'}","${s.levelTitle}",${s.xp},${s.preTestScore ?? 0},${s.postTestScore ?? 0},"${s.certificateIssued ? 'Lulus' : 'Belajar'}","${s.lastActive}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Evaluasi_${op.name.replace(/\s+/g, '_')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Official Operator Header (PRD Hal 18: Nama operator di kepala halaman) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white font-extrabold flex items-center justify-center shadow-md">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {op.type}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {op.regency}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{op.name}</h1>
              <p className="text-xs text-slate-500">
                Dashboard Evaluasi Diklat · Masa Lisensi Aktif s.d.{' '}
                <strong className="text-slate-800 font-mono">{op.licenseExpiry}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Laporan (Excel/CSV)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Cetak Ringkasan</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards (Bagian 7.2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Peserta Terdaftar</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {totalStudents}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">
                / {op.participantQuota} Kuota
              </span>
            </p>
            <span className="text-[11px] text-teal-700 font-medium mt-1 block">
              100% Peserta Aktif
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Rata-rata Pre vs Post</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {avgPre} ➔ {avgPost}
            </p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
              +{(avgPost - avgPre)} Poin Kenaikan
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Mencapai KKM (≥{kkmThreshold})</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {pctKkm}%
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {passedKkmCount} dari {totalStudents} peserta
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Telah Menerima Piagam</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono">
              {pctGraduated}%
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {graduatedCount} piagam diterbitkan
            </span>
          </div>
        </div>

        {/* Watchlist: Peserta Perlu Perhatian (PRD Hal 18: Inaktif >= 7 hari / Gagal >= 3x) */}
        {studentsNeedingAttention.length > 0 && (
          <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-rose-950">
                  Peserta Perlu Perhatian Khusus Instruktur (Watchlist)
                </h3>
              </div>
              <span className="text-xs font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                {studentsNeedingAttention.length} Peserta
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {studentsNeedingAttention.map((s) => {
                const isInactive = s.lastActive?.includes('8 hari') || s.lastActive?.includes('7 hari');
                const grade = getStudentFinalGrade(s);
                const hasBelowKkm =
                  (s.postTestScore !== undefined && s.postTestScore < kkmThreshold) ||
                  (s.postTestScore !== undefined && grade.finalScore < kkmThreshold) ||
                  (grade.avgMissionScore > 0 && grade.avgMissionScore < kkmThreshold);
                return (
                  <div
                    key={s.id}
                    className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {s.classCohort} · Terakhir aktif: <strong className="text-rose-700">{s.lastActive}</strong>
                      </p>
                      <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                        {hasBelowKkm
                          ? `Nilai di bawah KKM (< ${kkmThreshold}): perlu remedial misi/ujian`
                          : isInactive
                          ? 'Perlu kontak tindak lanjut: Tidak aktif ≥ 7 hari'
                          : 'Perlu bimbingan teknis: Gagal ≥ 3x di misi yang sama'}
                      </span>
                    </div>

                    <button
                      onClick={() => inspectStudent(s.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg border border-rose-300 cursor-pointer"
                    >
                      Bantu Peserta
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama peserta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Jalur Belajar</option>
              <option value="black_water">Black Water</option>
              <option value="grey_water">Grey Water</option>
              <option value="lengkap">Jalur Lengkap</option>
            </select>

            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Angkatan / Kelas</option>
              <option value="Angkatan 1 (2026)">Angkatan 1 (2026)</option>
              <option value="Kelas IPLT 2026-A">Kelas IPLT 2026-A</option>
              <option value="Warga Peduli Air 2026">Warga Peduli Air 2026</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="all">Semua Status Kelulusan</option>
              <option value="lulus">Lulus (≥ {kkmThreshold})</option>
              <option value="perlu_perhatian">Perlu Perhatian (&lt; {kkmThreshold} / Remedial)</option>
              <option value="dalam_proses">Dalam Proses</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Menampilkan {filteredStudents.length} peserta
          </span>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Nama Operator / Peserta</th>
                  <th className="px-5 py-3.5">Jalur & Kelas</th>
                  <th className="px-5 py-3.5">Level & Gelar</th>
                  <th className="px-5 py-3.5 text-center">Misi Tuntas</th>
                  <th className="px-5 py-3.5 text-center">Pre-Test</th>
                  <th className="px-5 py-3.5 text-center">Post-Test</th>
                  <th className="px-5 py-3.5 text-center">Status Lulus</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const mDoneCount = Object.keys(student.completedMissions).length;
                  const levelInfo = getLevelInfo(student.xp, student.track);
                  const maxXP = getTrackMaxXP(student.track);
                  const gradeInfo = getStudentFinalGrade(student);
                  const needsAttention = isStudentNeedingAttention(student);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {student.email} · {student.lastActive}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="capitalize font-semibold text-slate-800">
                          {student.track?.replace('_', ' ') || 'Lengkap'}
                        </span>
                        <div className="text-[11px] text-slate-500">{student.classCohort}</div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">
                          Lv {levelInfo.level} · {levelInfo.title}
                        </span>
                        <div className="text-[11px] text-teal-700 font-mono font-bold">
                          {student.xp} / {maxXP} XP
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center font-mono font-bold text-slate-700">
                        {mDoneCount} / {student.track === 'lengkap' || !student.track ? 15 : 7}
                      </td>

                      <td className="px-5 py-4 text-center font-mono text-slate-600">
                        {student.preTestScore ?? '—'}
                      </td>

                      <td className="px-5 py-4 text-center font-mono font-bold">
                        <span
                          className={
                            student.postTestScore === undefined
                              ? 'text-slate-500'
                              : student.postTestScore >= kkmThreshold
                              ? 'text-teal-700'
                              : 'text-rose-600'
                          }
                        >
                          {student.postTestScore ?? '—'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        {student.certificateIssued || gradeInfo.isEligible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Lulus ({gradeInfo.finalScore})
                          </span>
                        ) : needsAttention ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Perlu Perhatian
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Dalam Proses
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => inspectStudent(student.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer"
                        >
                          Detail Riwayat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-Column Split: Mission Difficulty Analytics & Alert Mishandle Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Difficulty */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Analisis Tingkat Kesulitan Misi (PRD Hal 18)
            </h3>
            <p className="text-xs text-slate-500">
              Misi dengan tingkat kelulusan terendah memerlukan pengayaan materi tatap muka.
            </p>

            <div className="space-y-3 pt-2">
              {missionAnalytics.map((m) => (
                <div key={m.id} className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">{m.id} · {m.name}</span>
                    <span className="font-mono text-slate-500">
                      Rerata {m.avgScore} | Lulus: <strong className={m.passRate < kkmThreshold ? 'text-rose-600' : 'text-teal-700'}>{m.passRate}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${m.passRate < kkmThreshold ? 'bg-rose-500' : 'bg-teal-500'}`}
                      style={{ width: `${m.passRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Response Analysis */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Analisis Alert Sering Salah Ditangani
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi kelemahan aksi operator saat simulasi berlangsung.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>AL-01 (Tinggi Lumpur Tangki Septik ≥ 2/3)</span>
                  <span className="text-rose-600 font-mono">35% Salah Aksi</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Kesalahan: Peserta sering menekan clear manual tanpa memesan truk sedot tinja.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>AL-11 (DO Bak Aerasi &lt; 1,0 mg/L)</span>
                  <span className="text-rose-600 font-mono">28% Terlambat Respons</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Rata-rata respons 41 detik (melebihi target 30 detik). Memerlukan drill penyalaan blower cadangan.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>AL-07 (Pemisah Lemak ≥ 25%)</span>
                  <span className="text-teal-700 font-mono">92% Berhasil Tepat</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Pemahaman pembersihan lapisan lemak permukaan sudah sangat baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
