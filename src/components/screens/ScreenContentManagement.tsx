import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuizQuestion } from '../../types';
import {
  Plus,
  Upload,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  Eye,
} from 'lucide-react';

const MISSION_OPTIONS = [
  { id: 'BW-1', label: 'BW-1 · Kenali Black Water', track: 'black_water' as const },
  { id: 'BW-2', label: 'BW-2 · Rakit Tangki Septik Kedap', track: 'black_water' as const },
  { id: 'BW-3', label: 'BW-3 · Jadwal Penyedotan Lumpur', track: 'black_water' as const },
  { id: 'BW-4', label: 'BW-4 · Penerimaan Lumpur Tinja', track: 'black_water' as const },
  { id: 'BW-5', label: 'BW-5 · Krisis Lumpur Tinja', track: 'black_water' as const },
  { id: 'GW-1', label: 'GW-1 · Kenali Grey Water', track: 'grey_water' as const },
  { id: 'GW-2', label: 'GW-2 · Saringan & Pemisah Lemak', track: 'grey_water' as const },
  { id: 'GW-3', label: 'GW-3 · Biofilter Berjalan', track: 'grey_water' as const },
  { id: 'GW-4', label: 'GW-4 · Aerasi & Pengendap Akhir', track: 'grey_water' as const },
  { id: 'GW-5', label: 'GW-5 · Pakai Ulang Aman', track: 'grey_water' as const },
  { id: 'INT-1', label: 'INT-1 · Pendahuluan & Ekualisasi Gabungan', track: 'lengkap' as const },
  { id: 'INT-2', label: 'INT-2 · Pengolahan Biologis Terpadu', track: 'lengkap' as const },
  { id: 'INT-3', label: 'INT-3 · Pengolahan Akhir & Pembuangan', track: 'lengkap' as const },
];

const SET_LABELS: Record<'quiz' | 'pre' | 'post', string> = {
  quiz: 'Kuis Misi',
  pre: 'Pre-test',
  post: 'Post-test',
};

const TRACK_LABELS: Record<QuizQuestion['track'], string> = {
  all: 'Semua Jalur (all)',
  black_water: 'Black Water',
  grey_water: 'Grey Water',
  lengkap: 'Lengkap (INT)',
};

export const ScreenContentManagement: React.FC = () => {
  const { questions, addQuestion, importQuestions } = useApp();
  const [activeTab, setActiveTab] = useState<'soal' | 'narasi_objek' | 'studi_kasus'>('soal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [previewQuestionId, setPreviewQuestionId] = useState<string | number | null>(null);

  // Filters for Bank Soal Table
  const [filterSet, setFilterSet] = useState<'all' | 'quiz' | 'pre' | 'post'>('all');
  const [filterMission, setFilterMission] = useState<string>('all');

  // New Question Form State
  const [newSet, setNewSet] = useState<'quiz' | 'pre' | 'post'>('quiz');
  const [newMissionId, setNewMissionId] = useState<string>('BW-1');
  const [newTrack, setNewTrack] = useState<QuizQuestion['track']>('black_water');
  const [newIncludeInLengkap, setNewIncludeInLengkap] = useState<boolean>(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  // Import File Form State
  const [importSet, setImportSet] = useState<'quiz' | 'pre' | 'post'>('quiz');
  const [importMissionId, setImportMissionId] = useState<string>('BW-1');
  const [importTrack, setImportTrack] = useState<QuizQuestion['track']>('black_water');
  const [importIncludeInLengkap, setImportIncludeInLengkap] = useState<boolean>(false);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importFileContent, setImportFileContent] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleNewSetChange = (val: 'quiz' | 'pre' | 'post') => {
    setNewSet(val);
    if (val === 'quiz') {
      const m = MISSION_OPTIONS.find((opt) => opt.id === newMissionId) || MISSION_OPTIONS[0];
      setNewMissionId(m.id);
      setNewTrack(m.track);
      setNewIncludeInLengkap(false);
    } else {
      if (newTrack === 'lengkap') {
        setNewTrack('all');
      }
      if (newTrack === 'all') {
        setNewIncludeInLengkap(false);
      }
    }
  };

  const handleNewMissionChange = (mId: string) => {
    setNewMissionId(mId);
    const found = MISSION_OPTIONS.find((m) => m.id === mId);
    if (found) {
      setNewTrack(found.track);
    }
  };

  const handleImportSetChange = (val: 'quiz' | 'pre' | 'post') => {
    setImportSet(val);
    if (val === 'quiz') {
      const m = MISSION_OPTIONS.find((opt) => opt.id === importMissionId) || MISSION_OPTIONS[0];
      setImportMissionId(m.id);
      setImportTrack(m.track);
      setImportIncludeInLengkap(false);
    } else {
      if (importTrack === 'lengkap') {
        setImportTrack('all');
      }
      if (importTrack === 'all') {
        setImportIncludeInLengkap(false);
      }
    }
  };

  const handleImportMissionChange = (mId: string) => {
    setImportMissionId(mId);
    const found = MISSION_OPTIONS.find((m) => m.id === mId);
    if (found) {
      setImportTrack(found.track);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterSet !== 'all' && q.set !== filterSet) return false;
      if (filterMission === 'none' && q.missionId) return false;
      if (filterMission !== 'all' && filterMission !== 'none' && q.missionId !== filterMission) {
        return false;
      }
      return true;
    });
  }, [questions, filterSet, filterMission]);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newOptionA.trim()) return;

    const prefix =
      newSet === 'quiz'
        ? `Q-${newMissionId.replace('-', '')}`
        : newSet === 'pre'
        ? 'PRE-ADD'
        : 'POST-ADD';

    const isPrePostBwGw =
      (newSet === 'pre' || newSet === 'post') &&
      (newTrack === 'black_water' || newTrack === 'grey_water');

    const newQ: QuizQuestion = {
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      set: newSet,
      ...(newSet === 'quiz' ? { missionId: newMissionId } : {}),
      track: newTrack,
      ...(isPrePostBwGw ? { includeInLengkap: newIncludeInLengkap } : {}),
      question: newQuestionText.trim(),
      options: [
        newOptionA.trim(),
        newOptionB.trim(),
        newOptionC.trim(),
        newOptionD.trim(),
      ],
      correctIndex: newCorrectIndex,
      explanation:
        newExplanation.trim() ||
        'Kunci jawaban mengacu pada regulasi baku mutu Permen LHK P.68/2016.',
    };

    addQuestion(newQ);
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewCorrectIndex(0);
    setNewExplanation('');
    setNewIncludeInLengkap(false);
    setShowAddModal(false);
    showToast(`Butir soal ${newQ.id} (${SET_LABELS[newSet]}) berhasil ditambahkan ke bank soal.`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImportFileContent(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);

    const isPrePostBwGw =
      (importSet === 'pre' || importSet === 'post') &&
      (importTrack === 'black_water' || importTrack === 'grey_water');

    if (importFileContent.trim()) {
      const trimmed = importFileContent.trim();
      try {
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          const parsedRaw = JSON.parse(trimmed);
          const arr = Array.isArray(parsedRaw) ? parsedRaw : [parsedRaw];
          const validItems: QuizQuestion[] = arr
            .filter(
              (item) =>
                item &&
                typeof item.question === 'string' &&
                Array.isArray(item.options) &&
                item.options.length === 4
            )
            .map((item, idx) => {
              const itemSet: 'quiz' | 'pre' | 'post' =
                item.set === 'quiz' || item.set === 'pre' || item.set === 'post'
                  ? item.set
                  : importSet;
              const itemTrack: QuizQuestion['track'] =
                item.track === 'black_water' ||
                item.track === 'grey_water' ||
                item.track === 'lengkap' ||
                item.track === 'all'
                  ? item.track
                  : importTrack;
              const itemMissionId =
                itemSet === 'quiz' ? item.missionId || importMissionId : undefined;
              const itemIncludeLengkap =
                (itemSet === 'pre' || itemSet === 'post') &&
                (itemTrack === 'black_water' || itemTrack === 'grey_water')
                  ? typeof item.includeInLengkap === 'boolean'
                    ? item.includeInLengkap
                    : importIncludeInLengkap
                  : undefined;

              return {
                id: item.id || `IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
                set: itemSet,
                ...(itemMissionId ? { missionId: itemMissionId } : {}),
                track: itemTrack,
                ...(itemIncludeLengkap !== undefined
                  ? { includeInLengkap: itemIncludeLengkap }
                  : {}),
                question: String(item.question),
                options: [
                  String(item.options[0]),
                  String(item.options[1]),
                  String(item.options[2]),
                  String(item.options[3]),
                ],
                correctIndex:
                  typeof item.correctIndex === 'number' &&
                  item.correctIndex >= 0 &&
                  item.correctIndex <= 3
                    ? item.correctIndex
                    : 0,
                explanation: String(
                  item.explanation || 'Mengacu pada standar teknis SiLimbah.'
                ),
              };
            });

          if (validItems.length === 0) {
            setImportError('Tidak ada butir soal valid di dalam berkas JSON.');
            return;
          }
          importQuestions(validItems);
          setShowExcelModal(false);
          setImportFileName('');
          setImportFileContent('');
          showToast(`${validItems.length} butir soal dari ${importFileName} berhasil diimpor.`);
          return;
        }

        // CSV / TSV fallback: Soal;A;B;C;D;Kunci(0-3 atau A-D);Penjelasan
        const lines = trimmed
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        const delimiter = lines[0]?.includes(';') ? ';' : ',';
        const parsedCsv: QuizQuestion[] = [];
        lines.forEach((line, idx) => {
          const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
          if (idx === 0 && cols[0]?.toLowerCase().includes('soal')) return;
          if (cols.length < 6) return;
          const keyRaw = cols[5]?.toUpperCase();
          const keyMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '0': 0, '1': 1, '2': 2, '3': 3 };
          const correctIndex = keyMap[keyRaw] ?? 0;
          parsedCsv.push({
            id: `IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
            set: importSet,
            ...(importSet === 'quiz' ? { missionId: importMissionId } : {}),
            track: importTrack,
            ...(isPrePostBwGw ? { includeInLengkap: importIncludeInLengkap } : {}),
            question: cols[0],
            options: [cols[1], cols[2], cols[3], cols[4]],
            correctIndex,
            explanation: cols[6] || 'Mengacu pada standar teknis SiLimbah.',
          });
        });

        if (parsedCsv.length === 0) {
          setImportError('Format CSV tidak dikenali. Gunakan kolom: Soal, Opsi A, B, C, D, Kunci, Penjelasan.');
          return;
        }
        importQuestions(parsedCsv);
        setShowExcelModal(false);
        setImportFileName('');
        setImportFileContent('');
        showToast(`${parsedCsv.length} butir soal dari ${importFileName} berhasil diimpor (${SET_LABELS[importSet]}).`);
        return;
      } catch {
        setImportError('Gagal membaca berkas. Pastikan format JSON atau CSV valid.');
        return;
      }
    }

    // Demo sample import when no file uploaded
    const sampleQuestion: QuizQuestion = {
      id: `IMP-${Date.now().toString().slice(-4)}`,
      set: importSet,
      ...(importSet === 'quiz' ? { missionId: importMissionId } : {}),
      track: importTrack,
      ...(isPrePostBwGw ? { includeInLengkap: importIncludeInLengkap } : {}),
      question: `Contoh butir impor (${SET_LABELS[importSet]}${importSet === 'quiz' ? ` · ${importMissionId}` : ''}): Parameter baku mutu BOD domestik menurut Permen LHK P.68/2016 adalah ...`,
      options: ['10 mg/L', '30 mg/L', '100 mg/L', '300 mg/L'],
      correctIndex: 1,
      explanation: 'Berdasarkan Lampiran I Permen LHK No. P.68/2016, kadar maksimum BOD adalah 30 mg/L.',
    };
    importQuestions([sampleQuestion]);
    setShowExcelModal(false);
    showToast(`1 butir soal contoh berhasil diimpor ke set ${SET_LABELS[importSet]}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Feedback banner */}
        {feedbackMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Layar 14 · Kelola Konten &amp; Bank Soal (Instruktur)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pusat Kurikulum &amp; Bank Soal Sanitasi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola materi, narasi objek instalasi, studi kasus lokal, dan bank soal evaluasi ({questions.length} butir aktif).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExcelModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Impor Berkas Soal (FR-33)</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Butir Soal</span>
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center gap-2">
          <button
            onClick={() => setActiveTab('soal')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'soal'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Soal Evaluasi ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('narasi_objek')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'narasi_objek'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Narasi Objek Pop-up (FR-25)
          </button>
          <button
            onClick={() => setActiveTab('studi_kasus')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'studi_kasus'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Studi Kasus &amp; Data Lapangan Lokal
          </button>
        </div>

        {/* Tab 1: Bank Soal */}
        {activeTab === 'soal' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-700 inline-flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-teal-700" />
                  Filter Bank Soal:
                </span>

                <select
                  aria-label="Filter Set Soal"
                  value={filterSet}
                  onChange={(e) => {
                    const val = e.target.value as 'all' | 'quiz' | 'pre' | 'post';
                    setFilterSet(val);
                    if (val === 'pre' || val === 'post') {
                      setFilterMission('all');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium"
                >
                  <option value="all">Semua Set ({questions.length})</option>
                  <option value="quiz">Kuis Misi</option>
                  <option value="pre">Pre-test</option>
                  <option value="post">Post-test</option>
                </select>

                <select
                  aria-label="Filter Misi Soal"
                  value={filterMission}
                  onChange={(e) => setFilterMission(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium"
                >
                  <option value="all">Semua Misi</option>
                  <option value="none">Tanpa Misi (Pre/Post-test)</option>
                  {MISSION_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {(filterSet !== 'all' || filterMission !== 'all') && (
                  <button
                    onClick={() => {
                      setFilterSet('all');
                      setFilterMission('all');
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 font-medium cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <span className="text-slate-500 font-mono">
                Menampilkan <strong>{filteredQuestions.length}</strong> / {questions.length} butir
              </span>
            </div>

            {/* Question Bank Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4 w-28">No / ID</th>
                    <th className="py-3 px-3 w-28">Set</th>
                    <th className="py-3 px-3 w-28">Misi</th>
                    <th className="py-3 px-3 w-32">Jalur</th>
                    <th className="py-3 px-4">Pertanyaan, Pilihan &amp; Pembahasan</th>
                    <th className="py-3 px-4 w-28 text-right">Kunci</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.map((q, idx) => {
                    const isPreviewOpen = previewQuestionId === q.id;
                    return (
                      <tr key={q.id} className="hover:bg-slate-50/70 align-top">
                        <td className="py-4 px-4 font-mono">
                          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded inline-block">
                            #{idx + 1}
                          </span>
                          <div className="text-[11px] text-slate-500 mt-1">{q.id}</div>
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              q.set === 'quiz'
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : q.set === 'pre'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            {SET_LABELS[q.set]}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          {q.missionId ? (
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {q.missionId}
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="text-slate-400">—</span>
                              {q.includeInLengkap && (
                                <span className="block text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded w-fit">
                                  Masuk Lengkap
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-3 text-slate-600 font-medium">
                          {TRACK_LABELS[q.track]}
                        </td>
                        <td className="py-4 px-4 space-y-2.5">
                          <p className="font-semibold text-slate-900 text-xs sm:text-sm leading-relaxed">
                            {q.question}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 ${
                                  optIdx === q.correctIndex
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className="font-mono font-bold w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                  {['A', 'B', 'C', 'D'][optIdx]}
                                </span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                          {isPreviewOpen && (
                            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-[11px] text-teal-950">
                              <strong>Kunci [{['A', 'B', 'C', 'D'][q.correctIndex]}]:</strong>{' '}
                              {q.explanation}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() =>
                              setPreviewQuestionId(isPreviewOpen ? null : q.id)
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isPreviewOpen ? 'Tutup' : 'Pembahasan'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredQuestions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        Tidak ada butir soal yang sesuai dengan filter Set dan Misi saat ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Narasi Objek */}
        {activeTab === 'narasi_objek' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Narasi Pop-up: Tangki Septik Kedap (SNI 2398:2017)
              </h3>
              <p className="text-xs text-slate-500">
                Dapat diedit oleh instruktur untuk menyelaraskan dengan konteks lokal daerah (FR-25).
              </p>
              <textarea
                rows={5}
                defaultValue="Tangki septik berfungsi mengendapkan padatan tinja secara anaerobik. Dinding wajib kedap air untuk mencegah pencemaran bakteri Coliform ke sumur warga."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
              />
              <button
                onClick={() => showToast('Narasi objek Tangki Septik Kedap berhasil diperbarui.')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Simpan Narasi Tangki
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Narasi Pop-up: Pemisah Lemak Dapur
              </h3>
              <p className="text-xs text-slate-500">
                Peringatan wajib pembersihan saat lapisan minyak mencapai 25% kapasitas.
              </p>
              <textarea
                rows={5}
                defaultValue="Pemisah lemak menahan lapisan minyak dan lemak agar tidak membeku di pipa pembuangan dan tidak menyumbat media biofilter anaerob."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
              />
              <button
                onClick={() => showToast('Narasi Pemisah Lemak berhasil disimpan.')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Simpan Narasi Pemisah Lemak
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Studi Kasus */}
        {activeTab === 'studi_kasus' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Studi Kasus Lapangan: Optimalisasi Kapasitas IPLT Terjadwal (L2T2)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Data riil membuktikan bahwa tanpa integrasi penjadwalan penyedotan (L2T2), fasilitas pengolahan lumpur tinja yang bernilai miliaran rupiah seringkali hanya beroperasi di bawah 15% dari kapasitas desain.
            </p>
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900">
              Instruktur dapat mengunggah lembar studi kasus lokal tambahan untuk memperkaya skenario misi BW-5 dan GW-5.
            </div>
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Tambah Butir Soal Baru ke Bank Soal
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              {/* Set, Misi, Jalur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Set Soal:
                  </label>
                  <select
                    value={newSet}
                    onChange={(e) => handleNewSetChange(e.target.value as 'quiz' | 'pre' | 'post')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="quiz">Kuis Misi</option>
                    <option value="pre">Pre-test</option>
                    <option value="post">Post-test</option>
                  </select>
                </div>

                {newSet === 'quiz' ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Misi (khusus Kuis Misi):
                    </label>
                    <select
                      value={newMissionId}
                      onChange={(e) => handleNewMissionChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      {MISSION_OPTIONS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Jalur Materi:
                    </label>
                    <select
                      value={newTrack}
                      onChange={(e) => {
                        const val = e.target.value as QuizQuestion['track'];
                        setNewTrack(val);
                        if (val === 'all') setNewIncludeInLengkap(false);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      <option value="all">Semua Jalur (Umum / 6 soal)</option>
                      <option value="black_water">Black Water</option>
                      <option value="grey_water">Grey Water</option>
                    </select>
                  </div>
                )}
              </div>

              {newSet === 'quiz' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jalur Materi:
                  </label>
                  <select
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value as QuizQuestion['track'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="black_water">Black Water (BW-1 s.d. BW-5)</option>
                    <option value="grey_water">Grey Water (GW-1 s.d. GW-5)</option>
                    <option value="lengkap">Lengkap (INT-1 s.d. INT-3)</option>
                  </select>
                </div>
              )}

              {(newSet === 'pre' || newSet === 'post') &&
                (newTrack === 'black_water' || newTrack === 'grey_water') && (
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIncludeInLengkap}
                      onChange={(e) => setNewIncludeInLengkap(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 rounded"
                    />
                    <span>Masuk jalur Lengkap</span>
                  </label>
                )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pertanyaan:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Tuliskan teks soal pilihan ganda..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan A:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionA}
                    onChange={(e) => setNewOptionA(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan B:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionB}
                    onChange={(e) => setNewOptionB(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan C:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionC}
                    onChange={(e) => setNewOptionC(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pilihan D:
                  </label>
                  <input
                    type="text"
                    required
                    value={newOptionD}
                    onChange={(e) => setNewOptionD(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kunci Jawaban Benar:
                  </label>
                  <select
                    value={newCorrectIndex}
                    onChange={(e) => setNewCorrectIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Penjelasan / Pembahasan:
                  </label>
                  <input
                    type="text"
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    placeholder="Rujukan regulasi Permen LHK 68/2016..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Bank Soal Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleImportSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Impor Berkas Bank Soal (FR-33)
              </h3>
              <p className="text-slate-500">
                Unggah berkas JSON (.json) atau CSV (.csv) berisi soal, pilihan A–D, kunci jawaban, dan pembahasan. Tentukan Set, Misi, dan Jalur bawaan untuk soal yang diimpor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Set Soal:
                </label>
                <select
                  value={importSet}
                  onChange={(e) => handleImportSetChange(e.target.value as 'quiz' | 'pre' | 'post')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="quiz">Kuis Misi</option>
                  <option value="pre">Pre-test</option>
                  <option value="post">Post-test</option>
                </select>
              </div>

              {importSet === 'quiz' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Misi (bila Kuis Misi):
                  </label>
                  <select
                    value={importMissionId}
                    onChange={(e) => handleImportMissionChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {MISSION_OPTIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jalur Materi:
                  </label>
                  <select
                    value={importTrack}
                    onChange={(e) => {
                      const val = e.target.value as QuizQuestion['track'];
                      setImportTrack(val);
                      if (val === 'all') setImportIncludeInLengkap(false);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="all">Semua Jalur (Umum)</option>
                    <option value="black_water">Black Water</option>
                    <option value="grey_water">Grey Water</option>
                  </select>
                </div>
              )}
            </div>

            {importSet === 'quiz' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jalur Materi:
                </label>
                <select
                  value={importTrack}
                  onChange={(e) => setImportTrack(e.target.value as QuizQuestion['track'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="black_water">Black Water</option>
                  <option value="grey_water">Grey Water</option>
                  <option value="lengkap">Lengkap (INT)</option>
                </select>
              </div>
            )}

            {(importSet === 'pre' || importSet === 'post') &&
              (importTrack === 'black_water' || importTrack === 'grey_water') && (
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importIncludeInLengkap}
                    onChange={(e) => setImportIncludeInLengkap(e.target.checked)}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                  <span>Masuk jalur Lengkap</span>
                </label>
              )}

            <label className="block p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <input
                type="file"
                accept=".json,.csv,.txt"
                onChange={handleFileChange}
                className="sr-only"
              />
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1" />
              <span className="font-semibold text-slate-700 block">
                {importFileName || 'Pilih berkas bank_soal (.json / .csv)'}
              </span>
              <span className="text-[10px] text-slate-400">
                Opsional: kosongkan untuk menguji impor 1 butir contoh sesuai Set &amp; Jalur di atas
              </span>
            </label>

            {importError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
                {importError}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setImportError(null);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Mulai Impor Soal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
