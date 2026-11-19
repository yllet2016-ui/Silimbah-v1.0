const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = '/app/applet/public/mockups';

// Helper for window chrome & top navbar
function getHeader(url = 'https://silimbah.id', activeMenu = 'Peta Misi') {
  return `
  <!-- Window Chrome Header -->
  <rect width="1376" height="42" fill="#0b1329"/>
  <circle cx="24" cy="21" r="6" fill="#ef4444"/>
  <circle cx="44" cy="21" r="6" fill="#f59e0b"/>
  <circle cx="64" cy="21" r="6" fill="#10b981"/>
  <rect x="250" y="8" width="876" height="26" rx="6" fill="#17223b"/>
  <text x="688" y="25" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" text-anchor="middle">${url}</text>

  <!-- Top App Navigation -->
  <rect y="42" width="1376" height="70" fill="#0d162d" stroke="#1e293b" stroke-width="1"/>
  
  <!-- Logo SiLimbah Resmi Identik Prototipe -->
  <g transform="translate(32, 52)">
    <rect width="48" height="48" rx="14" fill="url(#logoGrad)"/>
    <!-- Twin Droplets Icon (Lucide Droplets exact shape) -->
    <path d="M15 31c4 0 7-3.3 7-7.3 0-2.1-1-4.1-3.1-5.7S15.5 13.7 15 11c-.5 2.6-2 5.1-4.1 6.8S7 21.6 7 23.7C7 27.7 10.2 31 15 31z" fill="#ffffff"/>
    <path d="M25 13.5a19 19 0 0 0 2.5-6.5c.9 4.5 3.6 8.8 7.2 11.7s5.4 6.3 5.4 9.9a12.5 12.5 0 0 1-21.4 8.9" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    
    <text x="60" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800">SiLimbah</text>
    <text x="60" y="42" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600">Air Limbah Domestik · Standar Permen LHK No. 68/2016</text>
  </g>

  <!-- Operator Info Badge -->
  <g transform="translate(620, 56)">
    <rect width="280" height="42" rx="21" fill="#17223b" stroke="#334155"/>
    <circle cx="21" cy="21" r="14" fill="#0d9488"/>
    <text x="21" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">AS</text>
    <text x="44" y="19" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">Agus Santoso</text>
    <text x="44" y="33" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Teknisi Pratama · UPTD Sukamaju</text>
    <rect x="200" y="10" width="68" height="22" rx="11" fill="#065f46"/>
    <text x="234" y="25" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">480 XP</text>
  </g>

  <!-- Navigation Links -->
  <g transform="translate(980, 68)">
    <text x="0" y="0" fill="${activeMenu === 'Peta Misi' ? '#34d399' : '#94a3b8'}" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="${activeMenu === 'Peta Misi' ? 'bold' : 'normal'}">Peta Misi</text>
    <text x="90" y="0" fill="${activeMenu === 'Modul Teori' ? '#34d399' : '#94a3b8'}" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="${activeMenu === 'Modul Teori' ? 'bold' : 'normal'}">Modul Teori</text>
    <text x="195" y="0" fill="${activeMenu === 'Simulasi SCADA' ? '#34d399' : '#94a3b8'}" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="${activeMenu === 'Simulasi SCADA' ? 'bold' : 'normal'}">Simulasi SCADA</text>
    <text x="320" y="0" fill="${activeMenu === 'Piagam' ? '#34d399' : '#94a3b8'}" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="${activeMenu === 'Piagam' ? 'bold' : 'normal'}">Piagam</text>
  </g>
`;
}

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0f1d"/>
      <stop offset="100%" stop-color="#070b16"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#17223b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="cardHighlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#131c31"/>
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
  </defs>
`;

// 1. MOCKUP 01: Master Blueprint Alur Belajar
function genMockup01() {
  return `<svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <rect width="1376" height="768" fill="url(#bg)"/>
    ${getHeader('https://silimbah.id/blueprint-arsitektur', 'Peta Misi')}
    
    <g transform="translate(60, 140)">
      <text x="0" y="24" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800">Master Blueprint: 5 Siklus Alur Belajar &amp; Penggunaan Aplikasi SiLimbah</text>
      <text x="0" y="48" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">Arsitektur alur kompetensi operator dari registrasi akun hingga penerbitan piagam digital QR berstandar PRD</text>

      <!-- Connecting line behind 5 steps -->
      <line x1="100" y1="160" x2="1150" y2="160" stroke="#0d9488" stroke-width="8" stroke-linecap="round"/>

      <!-- STEP 1 -->
      <g transform="translate(20, 100)">
        <rect width="220" height="260" rx="16" fill="url(#cardGrad)" stroke="#10b981" stroke-width="2"/>
        <circle cx="110" cy="40" r="26" fill="#065f46" stroke="#10b981" stroke-width="3"/>
        <text x="110" y="47" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" text-anchor="middle">01</text>
        <text x="110" y="92" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Gerbang Autentikasi</text>
        <text x="110" y="112" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">10 Akun Demo PRD</text>
        <line x1="30" y1="126" x2="190" y2="126" stroke="#1e293b"/>
        <text x="30" y="148" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Login Multi-Role (RBAC)</text>
        <text x="30" y="168" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Persona Operator &amp; UPTD</text>
        <text x="30" y="188" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Pilih Jalur Spesialisasi:</text>
        <text x="40" y="206" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Black / Grey / Terpadu</text>
        <text x="30" y="234" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Standar PRD Halaman 20</text>
      </g>

      <!-- STEP 2 -->
      <g transform="translate(270, 100)">
        <rect width="220" height="260" rx="16" fill="url(#cardGrad)" stroke="#10b981" stroke-width="2"/>
        <circle cx="110" cy="40" r="26" fill="#065f46" stroke="#10b981" stroke-width="3"/>
        <text x="110" y="47" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" text-anchor="middle">02</text>
        <text x="110" y="92" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Pre-Test Diagnostik</text>
        <text x="110" y="112" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Uji Kompetensi Awal</text>
        <line x1="30" y1="126" x2="190" y2="126" stroke="#1e293b"/>
        <text x="30" y="148" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• 5 Soal Pilihan Ganda Acak</text>
        <text x="30" y="168" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Timer Hitung Mundur 10:00</text>
        <text x="30" y="188" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Opsi Petunjuk (Hint -5)</text>
        <text x="30" y="208" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Skor 100 ➔ 3 Bintang (★★★)</text>
        <text x="30" y="234" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Kunci Pembuka Peta Misi</text>
      </g>

      <!-- STEP 3 -->
      <g transform="translate(520, 100)">
        <rect width="220" height="260" rx="16" fill="url(#cardGrad)" stroke="#10b981" stroke-width="2"/>
        <circle cx="110" cy="40" r="26" fill="#065f46" stroke="#10b981" stroke-width="3"/>
        <text x="110" y="47" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" text-anchor="middle">03</text>
        <text x="110" y="92" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Peta Misi Gamifikasi</text>
        <text x="110" y="112" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">11 Simpul Pipa Terstruktur</text>
        <line x1="30" y1="126" x2="190" y2="126" stroke="#1e293b"/>
        <text x="30" y="148" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• 5 Misi Black Water (BW 1-5)</text>
        <text x="30" y="168" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• 5 Misi Grey Water (GW 1-5)</text>
        <text x="30" y="188" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• 1 Capstone Terpadu (INT-1)</text>
        <text x="30" y="208" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Syarat Ketuntasan KKM 75</text>
        <text x="30" y="234" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Drawer Briefing &amp; SOP</text>
      </g>

      <!-- STEP 4 -->
      <g transform="translate(770, 100)">
        <rect width="220" height="260" rx="16" fill="url(#cardGrad)" stroke="#10b981" stroke-width="2"/>
        <circle cx="110" cy="40" r="26" fill="#065f46" stroke="#10b981" stroke-width="3"/>
        <text x="110" y="47" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" text-anchor="middle">04</text>
        <text x="110" y="92" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Ruang Kendali SCADA</text>
        <text x="110" y="112" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">3-Zona Simulasi Fisik</text>
        <line x1="30" y1="126" x2="190" y2="126" stroke="#1e293b"/>
        <text x="30" y="148" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Zona 1: Skema Tangki Fisik</text>
        <text x="30" y="168" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Zona 2: Telemetri BOD/COD</text>
        <text x="30" y="188" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Zona 3: Mitigasi Alarm SOP</text>
        <text x="30" y="208" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• 15 Skenario Darurat AL 1-15</text>
        <text x="30" y="234" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Standar Permen LHK 68/2016</text>
      </g>

      <!-- STEP 5 -->
      <g transform="translate(1020, 100)">
        <rect width="220" height="260" rx="16" fill="url(#cardGrad)" stroke="#10b981" stroke-width="2"/>
        <circle cx="110" cy="40" r="26" fill="#065f46" stroke="#10b981" stroke-width="3"/>
        <text x="110" y="47" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" text-anchor="middle">05</text>
        <text x="110" y="92" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Evaluasi &amp; Sertifikasi</text>
        <text x="110" y="112" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Piagam Digital QR Code</text>
        <line x1="30" y1="126" x2="190" y2="126" stroke="#1e293b"/>
        <text x="30" y="148" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Formula Bobot 40/30/30</text>
        <text x="30" y="168" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Uji Post-Test &amp; N-Gain</text>
        <text x="30" y="188" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Piagam Stempel Resmi UPTD</text>
        <text x="30" y="208" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">• Portal Verifikasi Publik QR</text>
        <text x="30" y="234" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10">Validasi Sertifikat Daring</text>
      </g>

      <!-- Bottom Compliance Banner -->
      <rect y="390" width="1220" height="150" rx="16" fill="#131c31" stroke="#293d66"/>
      <text x="30" y="424" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="bold">Landasan Hukum &amp; Kepatuhan Regulasi Nasional:</text>
      
      <g transform="translate(30, 444)">
        <rect width="360" height="74" rx="10" fill="#0d1527"/>
        <text x="20" y="28" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold">1. Permen LHK No. 68 Tahun 2016</text>
        <text x="20" y="48" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Baku Mutu Air Limbah Domestik: pH (6-9), BOD (30 mg/L), COD (100 mg/L), TSS (30 mg/L), Minyak Lemak (5 mg/L), Coliform (3000).</text>
      </g>

      <g transform="translate(420, 444)">
        <rect width="360" height="74" rx="10" fill="#0d1527"/>
        <text x="20" y="28" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold">2. SNI 2398:2017 (Black Water)</text>
        <text x="20" y="48" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Tata cara perencanaan tangki septik dengan pengolahan lanjutan: sekat kompartemen, ventilasi gas metana, dan resapan air aman.</text>
      </g>

      <g transform="translate(810, 444)">
        <rect width="380" height="74" rx="10" fill="#0d1527"/>
        <text x="20" y="28" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold">3. SNI 8153:2015 (Grey Water)</text>
        <text x="20" y="48" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Sistem plambing air buangan non-kakus: perangkap lemak dapur (grease trap), biofilter anaerob-aerob, dan pemanfaatan kembali.</text>
      </g>

    </g>
  </svg>`;
}

// 2. MOCKUP 02: Autentikasi & Multi-Role
function genMockup02() {
  return `<svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <rect width="1376" height="768" fill="url(#bg)"/>
    ${getHeader('https://silimbah.id/login', 'Peta Misi')}

    <g transform="translate(320, 130)">
      <!-- Main Login Card -->
      <rect width="736" height="570" rx="20" fill="url(#cardGrad)" stroke="#223254" stroke-width="1.5"/>

      <!-- Header inside card -->
      <g transform="translate(40, 36)">
        <text x="328" y="24" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" text-anchor="middle">Masuk ke Platform Simulasi SiLimbah</text>
        <text x="328" y="46" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" text-anchor="middle">Sistem Pelatihan &amp; Evaluasi Kompetensi Pengolahan Air Limbah Domestik</text>
      </g>

      <!-- Standard Login Inputs -->
      <g transform="translate(80, 110)">
        <text x="0" y="16" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">Alamat Surel / Email Dinas</text>
        <rect y="26" width="576" height="42" rx="10" fill="#0d1527" stroke="#334155"/>
        <text x="16" y="52" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">agus.santoso@limbah.gov.id</text>

        <text x="0" y="96" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold">Kata Sandi</text>
        <rect y="106" width="576" height="42" rx="10" fill="#0d1527" stroke="#334155"/>
        <text x="16" y="132" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14">••••••••••••</text>

        <rect y="164" width="576" height="44" rx="12" fill="url(#emeraldGrad)"/>
        <text x="288" y="191" fill="#022c22" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Masuk ke Akun Operator</text>
      </g>

      <!-- Quick Switcher Divider -->
      <g transform="translate(80, 340)">
        <line x1="0" y1="0" x2="210" y2="0" stroke="#334155"/>
        <text x="288" y="5" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">PILIH DARI 10 AKUN DEMO RESMI PRD</text>
        <line x1="366" y1="0" x2="576" y2="0" stroke="#334155"/>
        <text x="288" y="24" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" text-anchor="middle">1-Klik Masuk Langsung Tanpa Perlu Registrasi (PRD Halaman 20)</text>
      </g>

      <!-- 3 Quick Cards -->
      <g transform="translate(60, 380)">
        <!-- Card 1: Operator -->
        <g transform="translate(0, 0)">
          <rect width="190" height="150" rx="14" fill="#0d1527" stroke="#10b981" stroke-width="2"/>
          <circle cx="95" cy="38" r="20" fill="#065f46"/>
          <text x="95" y="44" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OP</text>
          <text x="95" y="76" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Agus Santoso</text>
          <text x="95" y="92" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Operator Pengumpul Data</text>
          <text x="95" y="108" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">UPTD Kab. Sukamaju</text>
          <rect x="25" y="118" width="140" height="24" rx="8" fill="#10b981"/>
          <text x="95" y="134" fill="#022c22" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Masuk Sebagai Operator</text>
        </g>

        <!-- Card 2: Supervisor -->
        <g transform="translate(212, 0)">
          <rect width="190" height="150" rx="14" fill="#0d1527" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="95" cy="38" r="20" fill="#0369a1"/>
          <text x="95" y="44" fill="#7dd3fc" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">SP</text>
          <text x="95" y="76" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Drs. Budi Santoso</text>
          <text x="95" y="92" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Supervisor Kepala UPTD</text>
          <text x="95" y="108" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">Wilayah Kab. Sukamaju</text>
          <rect x="25" y="118" width="140" height="24" rx="8" fill="#0284c7"/>
          <text x="95" y="134" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Masuk Sebagai Supervisor</text>
        </g>

        <!-- Card 3: Super Admin -->
        <g transform="translate(424, 0)">
          <rect width="190" height="150" rx="14" fill="#0d1527" stroke="#a855f7" stroke-width="1.5"/>
          <circle cx="95" cy="38" r="20" fill="#581c87"/>
          <text x="95" y="44" fill="#d8b4fe" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">SA</text>
          <text x="95" y="76" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Admin Pusat</text>
          <text x="95" y="92" fill="#c084fc" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Super Administrator</text>
          <text x="95" y="108" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">Multi-Tenant Nasional</text>
          <rect x="25" y="118" width="140" height="24" rx="8" fill="#9333ea"/>
          <text x="95" y="134" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Masuk Sebagai Admin</text>
        </g>
      </g>

    </g>
  </svg>`;
}

// 3. MOCKUP 03: Pemilihan Jalur Belajar Spesialisasi
function genMockup03() {
  return `<svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <rect width="1376" height="768" fill="url(#bg)"/>
    ${getHeader('https://silimbah.id/jalur-belajar', 'Peta Misi')}

    <g transform="translate(68, 140)">
      <text x="620" y="28" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="26" font-weight="800" text-anchor="middle">Pilih Jalur Belajar Spesialisasi</text>
      <text x="620" y="54" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" text-anchor="middle">Kurikulum pelatihan mandiri disesuaikan dengan sumber fisik air limbah dan standar teknis nasional</text>

      <g transform="translate(20, 90)">
        <!-- KARTU 1: BLACK WATER -->
        <g transform="translate(0, 0)">
          <rect width="380" height="460" rx="20" fill="url(#cardGrad)" stroke="#10b981" stroke-width="2.5"/>
          <rect x="30" y="24" width="140" height="26" rx="13" fill="#065f46"/>
          <text x="100" y="41" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SNI 2398:2017</text>
          
          <text x="30" y="86" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="19" font-weight="800">Jalur Black Water</text>
          <text x="30" y="108" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600">Toilet &amp; Tangki Septik Komunal</text>

          <!-- Schematic Box -->
          <rect x="30" y="128" width="320" height="130" rx="12" fill="#0b1329" stroke="#1e293b"/>
          <rect x="50" y="150" width="120" height="80" rx="6" fill="#1e293b" stroke="#0d9488"/>
          <rect x="190" y="150" width="140" height="80" rx="6" fill="#1e293b" stroke="#0d9488"/>
          <line x1="170" y1="180" x2="190" y2="180" stroke="#38bdf8" stroke-width="6"/>
          <text x="110" y="196" fill="#f59e0b" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Ruang 1 (Lumpur)</text>
          <text x="260" y="196" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Ruang 2 (Anaerob)</text>

          <!-- Key points -->
          <text x="30" y="284" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Karakteristik: Beban organik tinja pekat &amp; patogen</text>
          <text x="30" y="308" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Penanganan endapan lumpur &amp; buih (scum)</text>
          <text x="30" y="332" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Ventilasi pelepasan gas metana (CH4 &amp; H2S)</text>
          <text x="30" y="356" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Layanan Lumpur Tinja Terjadwal (L2T2)</text>

          <!-- Button -->
          <rect x="30" y="386" width="320" height="46" rx="12" fill="url(#emeraldGrad)"/>
          <text x="190" y="414" fill="#022c22" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Pilih Jalur Black Water</text>
        </g>

        <!-- KARTU 2: GREY WATER -->
        <g transform="translate(410, 0)">
          <rect width="380" height="460" rx="20" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="2"/>
          <rect x="30" y="24" width="140" height="26" rx="13" fill="#0c4a6e"/>
          <text x="100" y="41" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">SNI 8153:2015</text>
          
          <text x="30" y="86" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="19" font-weight="800">Jalur Grey Water</text>
          <text x="30" y="108" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600">Dapur, Biofilter &amp; Lahan Basah</text>

          <!-- Schematic Box -->
          <rect x="30" y="128" width="320" height="130" rx="12" fill="#0b1329" stroke="#1e293b"/>
          <rect x="50" y="150" width="80" height="80" rx="6" fill="#1e293b" stroke="#eab308"/>
          <rect x="150" y="150" width="100" height="80" rx="6" fill="#1e293b" stroke="#06b6d4"/>
          <rect x="270" y="150" width="70" height="80" rx="6" fill="#1e293b" stroke="#22c55e"/>
          <text x="90" y="196" fill="#eab308" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">Grease Trap</text>
          <text x="200" y="196" fill="#06b6d4" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">Biofilter</text>
          <text x="305" y="196" fill="#22c55e" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" text-anchor="middle">Wetland</text>

          <!-- Key points -->
          <text x="30" y="284" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Karakteristik: Minyak lemak dapur &amp; deterjen fosfat</text>
          <text x="30" y="308" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Pemisahan fisik lemak padat (Grease Trap)</text>
          <text x="30" y="332" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Biofilter media sarang tawon anaerob-aerob</text>
          <text x="30" y="356" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Filtrasi tanaman air &amp; pakai ulang siram taman</text>

          <!-- Button -->
          <rect x="30" y="386" width="320" height="46" rx="12" fill="#0284c7"/>
          <text x="190" y="414" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Pilih Jalur Grey Water</text>
        </g>

        <!-- KARTU 3: TERPADU & IPLT -->
        <g transform="translate(820, 0)">
          <rect width="380" height="460" rx="20" fill="url(#cardGrad)" stroke="#a855f7" stroke-width="2"/>
          <rect x="30" y="24" width="180" height="26" rx="13" fill="#3b0764"/>
          <text x="120" y="41" fill="#c084fc" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">PERMEN LHK 68/2016</text>
          
          <text x="30" y="86" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="19" font-weight="800">Jalur Terpadu &amp; IPLT</text>
          <text x="30" y="108" fill="#c084fc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600">Skala Kawasan &amp; Instalasi Perkotaan</text>

          <!-- Schematic Box -->
          <rect x="30" y="128" width="320" height="130" rx="12" fill="#0b1329" stroke="#1e293b"/>
          <circle cx="100" cy="190" r="40" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
          <rect x="170" y="150" width="160" height="80" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
          <text x="100" y="194" fill="#d8b4fe" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Reaktor Kolam</text>
          <text x="250" y="194" fill="#d8b4fe" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" text-anchor="middle">Bak Pengering Lumpur</text>

          <!-- Key points -->
          <text x="30" y="284" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Pengolahan terpusat lumpur tinja truk tinja</text>
          <text x="30" y="308" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Kolam fakultatif, maturasi, &amp; sludge drying bed</text>
          <text x="30" y="332" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Pemenuhan ketat baku mutu sebelum buang sungai</text>
          <text x="30" y="356" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="12">• Bio-indikator kolam ikan uji toksisitas efluen</text>

          <!-- Button -->
          <rect x="30" y="386" width="320" height="46" rx="12" fill="#9333ea"/>
          <text x="190" y="414" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle">Pilih Jalur Terpadu</text>
        </g>
      </g>
    </g>
  </svg>`;
}

// 4. MOCKUP 04: Pre-Test Evaluasi Diagnostik Awal
function genMockup04() {
  return `<svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <rect width="1376" height="768" fill="url(#bg)"/>
    ${getHeader('https://silimbah.id/pre-test', 'Peta Misi')}

    <g transform="translate(248, 130)">
      <!-- Assessment Container Card -->
      <rect width="880" height="570" rx="20" fill="url(#cardGrad)" stroke="#223254" stroke-width="1.5"/>

      <!-- Header Examination Bar -->
      <g transform="translate(36, 28)">
        <rect width="808" height="60" rx="12" fill="#0d1527" stroke="#1e293b"/>
        
        <text x="24" y="36" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800">Pre-Test Evaluasi Diagnostik Awal</text>
        
        <g transform="translate(420, 20)">
          <text x="0" y="16" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Sisa Waktu Ujian:</text>
          <text x="110" y="16" fill="#f59e0b" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold">09:45</text>
        </g>

        <g transform="translate(620, 20)">
          <text x="0" y="16" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Progres Soal:</text>
          <text x="80" y="16" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold">2 dari 5 (40%)</text>
        </g>
      </g>

      <!-- Question Card -->
      <g transform="translate(36, 108)">
        <rect width="808" height="380" rx="14" fill="#0d1527" stroke="#1e293b"/>
        
        <text x="28" y="34" fill="#38bdf8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold">SOAL NOMOR 2 · STANDAR BAKU MUTU REGULASI NASIONAL</text>
        
        <text x="28" y="70" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700">Berdasarkan Permen LHK No. 68 Tahun 2016 tentang Baku Mutu Air Limbah Domestik,</text>
        <text x="28" y="94" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700">berapa batas maksimum parameter BOD5 dan TSS yang diperbolehkan dibuang</text>
        <text x="28" y="118" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700">ke badan air dari pengolahan air limbah domestik skala kawasan permukiman?</text>

        <!-- Options -->
        <!-- Option A (Correct Selected) -->
        <g transform="translate(28, 144)">
          <rect width="752" height="42" rx="10" fill="#065f46" stroke="#10b981" stroke-width="2"/>
          <circle cx="24" cy="21" r="10" fill="#10b981"/>
          <text x="24" y="25" fill="#022c22" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">A</text>
          <text x="50" y="26" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="bold">BOD: 30 mg/L dan TSS: 30 mg/L (Sesuai Lampiran I Permen LHK 68/2016)</text>
          <circle cx="725" cy="21" r="8" fill="#10b981"/>
        </g>

        <!-- Option B -->
        <g transform="translate(28, 196)">
          <rect width="752" height="42" rx="10" fill="#17223b" stroke="#334155"/>
          <circle cx="24" cy="21" r="10" fill="#1e293b" stroke="#64748b"/>
          <text x="24" y="25" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">B</text>
          <text x="50" y="26" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">BOD: 50 mg/L dan TSS: 50 mg/L</text>
        </g>

        <!-- Option C -->
        <g transform="translate(28, 248)">
          <rect width="752" height="42" rx="10" fill="#17223b" stroke="#334155"/>
          <circle cx="24" cy="21" r="10" fill="#1e293b" stroke="#64748b"/>
          <text x="24" y="25" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">C</text>
          <text x="50" y="26" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">BOD: 20 mg/L dan TSS: 15 mg/L</text>
        </g>

        <!-- Option D -->
        <g transform="translate(28, 300)">
          <rect width="752" height="42" rx="10" fill="#17223b" stroke="#334155"/>
          <circle cx="24" cy="21" r="10" fill="#1e293b" stroke="#64748b"/>
          <text x="24" y="25" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">D</text>
          <text x="50" y="26" fill="#cbd5e1" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">BOD: 45 mg/L dan TSS: 40 mg/L</text>
        </g>

        <!-- Hint bar -->
        <g transform="translate(28, 350)">
          <text x="0" y="16" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Catatan Skor:</text>
          <text x="80" y="16" fill="#34d399" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="bold">Mencapai nilai 100/100 langsung menganugerahkan 3 Bintang Emas Penuh (★★★)</text>
        </g>
      </g>

      <!-- Bottom Action Buttons -->
      <g transform="translate(36, 506)">
        <rect width="240" height="42" rx="10" fill="#1e293b" stroke="#eab308"/>
        <text x="120" y="26" fill="#fde047" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Gunakan Petunjuk (-5 Poin)</text>

        <rect x="568" y="0" width="240" height="42" rx="10" fill="url(#emeraldGrad)"/>
        <text x="688" y="26" fill="#022c22" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" text-anchor="middle">Lanjut ke Soal Berikutnya ➔</text>
      </g>
    </g>
  </svg>`;
}

console.log('Template generator loaded successfully!');
EOF
