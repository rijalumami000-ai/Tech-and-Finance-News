export type InstitutionalPageId =
  | 'tentang-kami'
  | 'hubungi-kami'
  | 'kode-etik'
  | 'redaksi'
  | 'pedoman-media-siber'
  | 'disclaimer'
  | 'info-iklan'
  | 'karir';

const PAGE_TITLES: Record<InstitutionalPageId, { id: string; en: string }> = {
  'tentang-kami': { id: 'Tentang Kami', en: 'About Us' },
  'hubungi-kami': { id: 'Hubungi Kami', en: 'Contact Us' },
  'kode-etik': { id: 'Kode Etik Jurnalistik', en: 'Code of Ethics' },
  'redaksi': { id: 'Susunan Redaksi', en: 'Editorial Board' },
  'pedoman-media-siber': { id: 'Pedoman Media Siber', en: 'Cyber Media Guidelines' },
  'disclaimer': { id: 'Disclaimer', en: 'Disclaimer' },
  'info-iklan': { id: 'Info Iklan & Kemitraan', en: 'Advertising & Partnerships' },
  'karir': { id: 'Karir & Magang', en: 'Careers & Internships' },
};

// ──────────────────────────────────────────────
// Shared UI Helpers
// ──────────────────────────────────────────────

function sectionTitle(text: string): string {
  return `<h3 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin:0 0 1rem 0; text-transform:uppercase; letter-spacing:0.04em; display:flex; align-items:center; gap:0.5rem;">
    <span style="width:4px; height:1.4rem; background:var(--accent-cyan); border-radius:2px; flex-shrink:0;"></span>${text}</h3>`;
}

function infoCard(label: string, value: string, accent: string = 'var(--accent-cyan)'): string {
  return `<div style="background:var(--bg-tertiary); padding:1rem 1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color); border-left:3px solid ${accent};">
    <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:0.3rem;">${label}</span>
    <strong style="font-size:0.92rem; color:var(--text-primary); display:block;">${value}</strong>
  </div>`;
}

function staffCard(role: string, name: string, desc: string): string {
  return `<div style="background:var(--bg-tertiary); padding:1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color); transition:transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
    <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, var(--accent-cyan), var(--accent-violet)); display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff; font-size:1.1rem; margin-bottom:0.75rem;">${name.charAt(0)}</div>
    <span style="font-size:0.68rem; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.08em; font-weight:700; display:block; margin-bottom:0.25rem;">${role}</span>
    <strong style="font-size:0.95rem; color:var(--text-primary); display:block; margin-bottom:0.3rem;">${name}</strong>
    <span style="font-size:0.82rem; color:var(--text-muted); line-height:1.45;">${desc}</span>
  </div>`;
}

function ethicsArticle(num: number, title: string, body: string, accent: string): string {
  return `<div style="padding:1.15rem; background:var(--bg-tertiary); border-left:3px solid ${accent}; border-radius:0 var(--radius-md) var(--radius-md) 0;">
    <strong style="display:block; color:var(--text-primary); margin-bottom:0.35rem; font-size:0.95rem;">Pasal ${num}: ${title}</strong>
    <span style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">${body}</span>
  </div>`;
}

function jobCard(title: string, type: string, location: string, desc: string): string {
  return `<div style="background:var(--bg-tertiary); padding:1.35rem; border-radius:var(--radius-md); border:1px solid var(--border-color); transition:transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 28px rgba(0,0,0,0.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
    <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.75rem; flex-wrap:wrap;">
      <h4 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin:0;">${title}</h4>
      <span style="font-size:0.65rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:100px; background:rgba(0,242,254,0.12); color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.06em;">${type}</span>
    </div>
    <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.6rem; display:flex; align-items:center; gap:0.35rem;">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${location}
    </div>
    <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.55; margin:0 0 1rem 0;">${desc}</p>
    <a href="mailto:karir@byteindonesia.id?subject=Lamaran: ${title}" style="font-size:0.8rem; font-weight:700; color:var(--accent-cyan); text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.7'" onmouseleave="this.style.opacity='1'">Lamar Posisi Ini →</a>
  </div>`;
}


// ──────────────────────────────────────────────
// Page Content Generators
// ──────────────────────────────────────────────

function renderTentangKami(): string {
  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">

      <!-- Hero Quote -->
      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.08), rgba(124,58,237,0.08)); padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <p style="font-size:1.1rem; color:var(--text-secondary); line-height:1.75; border-left:3px solid var(--accent-cyan); padding-left:1.25rem; font-style:italic;">
          "ByteIndonesia merupakan portal berita teknologi dan informasi digital nasional di bawah naungan <strong style="color:var(--text-primary);">PT Byte Media Nusantara</strong>. Kami menyajikan jurnalisme teknologi yang kredibel, akurat, dan berwawasan luas untuk mendukung transformasi digital Indonesia."
        </p>
      </div>

      <!-- Visi & Misi -->
      ${sectionTitle('Visi & Misi')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
        <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <div style="font-size:1.5rem; margin-bottom:0.5rem;">🔭</div>
          <h4 style="font-size:0.95rem; font-weight:800; color:var(--accent-cyan); margin-bottom:0.5rem; text-transform:uppercase;">Visi</h4>
          <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">Menjadi media teknologi paling terpercaya dan inovatif di Asia Tenggara yang mampu memberikan informasi terkini, analisis mendalam, dan wawasan strategis bagi pemangku kepentingan digital Indonesia.</p>
        </div>
        <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <div style="font-size:1.5rem; margin-bottom:0.5rem;">🎯</div>
          <h4 style="font-size:0.95rem; font-weight:800; color:var(--accent-violet); margin-bottom:0.5rem; text-transform:uppercase;">Misi</h4>
          <ul style="font-size:0.9rem; color:var(--text-secondary); line-height:1.65; padding-left:1.15rem; margin:0; display:flex; flex-direction:column; gap:0.4rem;">
            <li>Menyajikan berita teknologi yang akurat, terverifikasi, dan independen.</li>
            <li>Mendorong literasi digital masyarakat Indonesia melalui konten edukatif.</li>
            <li>Menjadi jembatan informasi antara pelaku industri teknologi dan masyarakat luas.</li>
            <li>Menerapkan standar jurnalisme tertinggi dengan prinsip transparansi penuh.</li>
          </ul>
        </div>
      </div>

      <!-- Sejarah Pendirian -->
      ${sectionTitle('Sejarah & Latar Belakang')}
      <div style="font-size:0.92rem; color:var(--text-secondary); line-height:1.7; display:flex; flex-direction:column; gap:0.85rem;">
        <p>ByteIndonesia didirikan pada <strong style="color:var(--text-primary);">Maret 2025</strong> oleh sekelompok jurnalis teknologi dan insinyur perangkat lunak yang melihat kebutuhan mendesak akan media teknologi berbahasa Indonesia yang kredibel dan mendalam. Di tengah maraknya misinformasi digital, ByteIndonesia hadir dengan komitmen kuat terhadap akurasi data dan independensi editorial.</p>
        <p>Dalam kurun waktu satu tahun sejak peluncuran, ByteIndonesia telah menjadi rujukan utama bagi pelaku startup, investor ventura, pengambil kebijakan publik, dan masyarakat umum yang ingin memahami perkembangan teknologi terkini di Indonesia dan dunia. Redaksi kami terdiri dari jurnalis berpengalaman di bidang AI, cybersecurity, fintech, dan infrastruktur digital.</p>
      </div>

      <!-- Tiga Pilar -->
      ${sectionTitle('Tiga Pilar Jurnalisme ByteIndonesia')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
        <div style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🛡️</div>
          <strong style="display:block; font-size:0.9rem; color:var(--text-primary); margin-bottom:0.4rem;">Independensi</strong>
          <span style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">Tanpa afiliasi politik maupun korporasi. Redaksi beroperasi sepenuhnya terpisah dari divisi bisnis dan iklan.</span>
        </div>
        <div style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🔬</div>
          <strong style="display:block; font-size:0.9rem; color:var(--text-primary); margin-bottom:0.4rem;">Ketajaman Analisis</strong>
          <span style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">Jurnalisme investigatif berbasis data dengan standar verifikasi multi-sumber dan peer-review internal.</span>
        </div>
        <div style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">📚</div>
          <strong style="display:block; font-size:0.9rem; color:var(--text-primary); margin-bottom:0.4rem;">Edukasi Nasional</strong>
          <span style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">Mendukung agenda transformasi digital nasional melalui konten literasi teknologi yang mudah dipahami.</span>
        </div>
      </div>

      <!-- Legalitas -->
      ${sectionTitle('Legalitas & Registrasi')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
        ${infoCard('Badan Hukum', 'PT Byte Media Nusantara')}
        ${infoCard('No. Akta Pendirian', 'AHU-0091240.AH.01.01.TAHUN 2025', 'var(--accent-violet)')}
        ${infoCard('Terdaftar Dewan Pers', 'ID-2910-BIMN (Verifikasi Administrasi & Faktual)', 'var(--accent-emerald)')}
        ${infoCard('NPWP Perusahaan', '09.321.456.7-012.000')}
        ${infoCard('Domisili Hukum', 'DKI Jakarta, Indonesia', 'var(--accent-violet)')}
        ${infoCard('Tahun Berdiri', '2025', 'var(--accent-emerald)')}
      </div>
    </section>
  `;
}


function renderHubungiKami(): string {
  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">

      <!-- Kantor Pusat -->
      ${sectionTitle('Kantor Pusat Redaksi')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
        <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem; display:flex; align-items:center; gap:0.4rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Alamat
          </h4>
          <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.65; margin:0;">
            <strong style="color:var(--text-primary);">Wisma Nugra Santana, Lantai 12</strong><br/>
            Jl. Jend. Sudirman Kav. 7-8<br/>
            Jakarta Pusat 10220<br/>
            DKI Jakarta, Indonesia
          </p>
        </div>
        <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">📞 Kontak Langsung</h4>
          <div style="display:flex; flex-direction:column; gap:0.65rem; font-size:0.9rem; color:var(--text-secondary);">
            <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Telepon Kantor</strong><br/><span style="color:var(--text-primary);">+62 21 5790 1234</span></div>
            <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">WhatsApp Redaksi</strong><br/><span style="color:var(--text-primary);">+62 812-7093-9344</span></div>
            <div><strong style="color:var(--text-muted); font-size:0.75rem; text-transform:uppercase;">Jam Operasional</strong><br/><span style="color:var(--text-primary);">Senin – Jumat, 08.00 – 17.00 WIB</span></div>
          </div>
        </div>
      </div>

      <!-- Email Per Divisi -->
      ${sectionTitle('Email Per Divisi')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        ${infoCard('Redaksi & Newsroom', 'redaksi@byteindonesia.id')}
        ${infoCard('Iklan & Kemitraan Bisnis', 'iklan@byteindonesia.id', 'var(--accent-violet)')}
        ${infoCard('Humas & Media Relations', 'humas@byteindonesia.id', 'var(--accent-emerald)')}
        ${infoCard('Teknologi & Pengembangan', 'tech@byteindonesia.id')}
        ${infoCard('Ombudsman & Pengaduan', 'ombudsman@byteindonesia.id', 'var(--accent-violet)')}
        ${infoCard('Karir & Rekrutmen', 'karir@byteindonesia.id', 'var(--accent-emerald)')}
      </div>

      <!-- Biro Daerah -->
      ${sectionTitle('Jaringan Biro Daerah')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
        ${infoCard('Biro Jawa Barat', 'Bandung Digital Valley, Jl. Asia Afrika No. 65')}
        ${infoCard('Biro Jawa Timur', 'Surabaya Tech Hub, Jl. Pemuda No. 31', 'var(--accent-violet)')}
        ${infoCard('Biro Bali & Nusa Tenggara', 'Denpasar Innovation Center, Jl. Teuku Umar No. 12', 'var(--accent-emerald)')}
        ${infoCard('Biro Kalimantan (IKN)', 'IKN Media Center, Penajam Paser Utara')}
      </div>

      <!-- Media Sosial -->
      ${sectionTitle('Media Sosial Resmi')}
      <div style="display:flex; flex-wrap:wrap; gap:0.85rem;">
        ${['X (Twitter): @ByteIndonesia', 'Instagram: @byteindonesia.id', 'LinkedIn: ByteIndonesia', 'YouTube: ByteIndonesia Official', 'TikTok: @byteindonesia', 'Facebook: ByteIndonesia'].map(s => {
          const [platform, handle] = s.split(': ');
          return `<div style="background:var(--bg-tertiary); padding:0.65rem 1rem; border-radius:100px; border:1px solid var(--border-color); font-size:0.82rem;"><strong style="color:var(--text-primary);">${platform}:</strong> <span style="color:var(--accent-cyan);">${handle}</span></div>`;
        }).join('')}
      </div>

      <!-- Formulir Kontak -->
      ${sectionTitle('Formulir Kontak')}
      <form id="institutional-contact-form" style="display:flex; flex-direction:column; gap:1rem; max-width:560px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
          <div>
            <label style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.35rem;">Nama Lengkap</label>
            <input type="text" required style="width:100%; padding:0.7rem 1rem; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.9rem; outline:none; box-sizing:border-box;" />
          </div>
          <div>
            <label style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.35rem;">Email</label>
            <input type="email" required style="width:100%; padding:0.7rem 1rem; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.9rem; outline:none; box-sizing:border-box;" />
          </div>
        </div>
        <div>
          <label style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.35rem;">Subjek</label>
          <select style="width:100%; padding:0.7rem 1rem; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.9rem; outline:none; box-sizing:border-box;">
            <option>Umum</option>
            <option>Hak Jawab / Klarifikasi Berita</option>
            <option>Kerjasama Iklan & Sponsorship</option>
            <option>Laporan Kesalahan Teknis</option>
            <option>Pertanyaan Karir & Magang</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.35rem;">Pesan</label>
          <textarea rows="5" required style="width:100%; padding:0.7rem 1rem; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.9rem; outline:none; resize:vertical; box-sizing:border-box;"></textarea>
        </div>
        <button type="submit" style="align-self:flex-start; padding:0.75rem 2rem; background:var(--gradient-brand); border:none; border-radius:var(--radius-md); color:#000; font-weight:800; font-size:0.88rem; cursor:pointer; transition:transform 0.2s, opacity 0.2s;" onmouseenter="this.style.transform='translateY(-1px)'" onmouseleave="this.style.transform=''">Kirim Pesan</button>
      </form>
    </section>
  `;
}


function renderKodeEtik(): string {
  const articles = [
    { title: 'Independensi', body: 'Wartawan Indonesia bersikap independen, menghasilkan berita yang akurat, berimbang, dan tidak beritikad buruk. Redaksi ByteIndonesia memastikan seluruh jurnalis tidak menerima suap, gratifikasi, maupun tekanan dari pihak manapun dalam proses produksi berita.' },
    { title: 'Metode Profesional', body: 'Wartawan Indonesia menempuh cara-cara yang profesional dalam melaksanakan tugas jurnalistik. ByteIndonesia menerapkan SOP liputan digital yang meliputi verifikasi sumber elektronik, pengecekan metadata konten, dan cross-referencing database publik.' },
    { title: 'Uji Informasi', body: 'Wartawan Indonesia selalu menguji informasi, memberitakan secara berimbang, tidak mencampurkan fakta dan opini yang menghakimi, serta menerapkan asas praduga tak bersalah. Setiap berita yang dipublikasikan ByteIndonesia wajib diverifikasi ke minimal tiga sumber independen.' },
    { title: 'Larangan Membuat Berita Bohong', body: 'Wartawan Indonesia tidak membuat berita bohong, fitnah, sadis, dan cabul. Redaksi menerapkan sistem deteksi AI untuk menandai konten yang berpotensi menyesatkan sebelum dipublikasikan.' },
    { title: 'Hak Tolak', body: 'Wartawan Indonesia tidak menyebutkan dan menyiarkan identitas korban kejahatan susila dan tidak menyebutkan identitas anak yang menjadi pelaku kejahatan. Prinsip perlindungan identitas diterapkan secara ketat.' },
    { title: 'Hak Jawab & Koreksi', body: 'Wartawan Indonesia tidak menyalahgunakan profesi dan tidak menerima suap. ByteIndonesia menyediakan mekanisme hak jawab digital yang dapat diakses narasumber dalam 1x24 jam melalui email ombudsman@byteindonesia.id.' },
    { title: 'Melindungi Sumber Informasi', body: 'Wartawan Indonesia memiliki hak tolak untuk melindungi narasumber yang tidak bersedia diketahui identitas maupun keberadaannya dengan alasan keamanan. Enkripsi end-to-end diterapkan pada seluruh komunikasi sumber rahasia.' },
    { title: 'Embargo & Pencabutan Informasi', body: 'Wartawan Indonesia menghormati embargo informasi dan segera mengoreksi berita yang keliru dengan mekanisme ralat dan pencabutan berita yang transparan. ByteIndonesia mencantumkan stempel waktu koreksi pada setiap revisi artikel.' },
    { title: 'Larangan Plagiarisme', body: 'Wartawan Indonesia menjunjung tinggi orisinalitas konten. Sistem anti-plagiarisme otomatis memindai kesamaan konten sebelum artikel dipublikasikan. Setiap kutipan wajib menyertakan atribusi sumber yang jelas.' },
    { title: 'Transparansi Kecerdasan Buatan', body: 'Khusus untuk media digital, ByteIndonesia mewajibkan setiap konten yang dibantu atau dihasilkan oleh teknologi AI harus dilabeli secara eksplisit, termasuk gambar ilustrasi AI (berlabel watermark "AI Generated") dan ringkasan berita buatan AI yang ditandai badge khusus.' },
    { title: 'Pertanggungjawaban', body: 'Wartawan Indonesia yang melanggar kode etik berhak mendapatkan sanksi dari organisasi profesi wartawan. ByteIndonesia memiliki Dewan Etik Internal yang terdiri dari Pemimpin Redaksi, Penasihat Hukum, dan perwakilan jurnalis senior untuk menangani pelanggaran etik.' },
  ];

  const accentColors = ['var(--accent-cyan)', 'var(--accent-violet)', 'var(--accent-emerald)'];

  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">
      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.08), rgba(124,58,237,0.08)); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0;">
          Setiap konten, infografis, dan ulasan yang disajikan oleh ByteIndonesia wajib menaati <strong style="color:var(--text-primary);">Kode Etik Jurnalistik Dewan Pers Republik Indonesia</strong> sebagaimana ditetapkan dalam Peraturan Dewan Pers Nomor 6/Peraturan-DP/V/2008 tentang Pengesahan Surat Keputusan Dewan Pers, serta seluruh peraturan perundang-undangan yang berlaku.
        </p>
      </div>

      ${sectionTitle('11 Pasal Kode Etik Jurnalistik & Kebijakan Editorial')}
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        ${articles.map((a, i) => ethicsArticle(i + 1, a.title, a.body, accentColors[i % 3])).join('')}
      </div>

      ${sectionTitle('Prosedur Pengaduan')}
      <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.9rem; color:var(--text-secondary); line-height:1.7;">
        <p style="margin:0 0 0.75rem 0;">Kritik, saran, maupun hak jawab atas pemberitaan dapat disampaikan melalui:</p>
        <ul style="padding-left:1.15rem; display:flex; flex-direction:column; gap:0.4rem; margin:0;">
          <li>Email: <code style="color:var(--accent-cyan); font-weight:700;">ombudsman@byteindonesia.id</code></li>
          <li>WhatsApp: <code style="color:var(--accent-cyan); font-weight:700;">+62 812-7093-9344</code> (Jam Kerja)</li>
          <li>Surat Resmi ke Alamat Kantor Redaksi (u.p. Dewan Etik Internal)</li>
        </ul>
        <p style="margin:0.75rem 0 0 0;">Dewan Etik Internal wajib merespons setiap pengaduan dalam waktu <strong style="color:var(--text-primary);">maksimal 7 (tujuh) hari kerja</strong> sejak pengaduan diterima.</p>
      </div>
    </section>
  `;
}


function renderRedaksi(): string {
  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">

      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.08), rgba(124,58,237,0.08)); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0;">
          Susunan redaksi ByteIndonesia disusun berdasarkan <strong style="color:var(--text-primary);">UU Pers No. 40 Tahun 1999</strong> dan Standar Perusahaan Pers yang ditetapkan oleh Dewan Pers Republik Indonesia. Seluruh personel redaksi telah memenuhi kualifikasi kompetensi jurnalistik sesuai ketentuan yang berlaku.
        </p>
      </div>

      <!-- Pimpinan Utama -->
      ${sectionTitle('Pimpinan & Penanggung Jawab')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        ${staffCard('Direktur Utama / CEO', 'Rijal Umami', 'Pendiri ByteIndonesia. Lulusan Teknik Informatika dengan pengalaman 12 tahun di industri media digital dan teknologi.')}
        ${staffCard('Pemimpin Redaksi', 'Dian Prasetyo, M.T.', 'Mantan Redaktur Senior di TechScape. 15 tahun pengalaman jurnalisme teknologi investigatif.')}
        ${staffCard('Wakil Pemimpin Redaksi', 'Sari Wulandari, M.Kom.', 'Spesialis liputan AI & Big Data. Fellow Knight-Wallace Journalism, University of Michigan 2023.')}
      </div>

      <!-- Dewan Redaksi & Penasihat -->
      ${sectionTitle('Dewan Redaksi & Penasihat')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        ${staffCard('Dewan Penasihat AI', 'Prof. Dr. Irwan Hakim', 'Guru Besar Ilmu Komputer UI. Pakar kecerdasan buatan dan etika teknologi.')}
        ${staffCard('Penasihat Hukum Media', 'Dr. Hendra Kurniawan, S.H., M.H.', 'Advokat senior spesialis hukum media dan siber. Partner di KHK Law Firm.')}
        ${staffCard('Penasihat Keamanan Siber', 'Ir. Teguh Aprianto, CISSP', 'Praktisi keamanan siber nasional. Mantan Deputi BSSN bidang Proteksi Data.')}
      </div>

      <!-- Redaktur Desk -->
      ${sectionTitle('Redaktur Pelaksana & Koordinator Desk')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
        ${staffCard('Redaktur Pelaksana', 'Ahmad Fauzi', 'Mengelola alur produksi berita harian. 10 tahun pengalaman di newsroom digital.')}
        ${staffCard('Koordinator Desk AI & Data', 'Rina Maharani, M.Sc.', 'Lulusan Data Science ETH Zürich. Spesialis liputan machine learning & LLM.')}
        ${staffCard('Koordinator Desk Gadget & Hardware', 'Bayu Setiawan', 'Reviewer teknologi dengan 8 tahun pengalaman. Sertifikasi CompTIA A+.')}
        ${staffCard('Koordinator Desk Fintech & Blockchain', 'Dewi Anggraeni, MBA', 'Mantan analis di OJK. Mendalami regulasi fintech dan aset kripto.')}
        ${staffCard('Koordinator Desk Cybersecurity', 'Fajar Nugroho, CEH', 'Ethical hacker bersertifikat. Investigator kebocoran data dan ancaman siber.')}
        ${staffCard('Koordinator Desk Startup & Venture Capital', 'Laras Permata', '7 tahun meliput ekosistem startup Asia Tenggara. Kontributor tetap TechCrunch SEA.')}
      </div>

      <!-- Tim Pendukung -->
      ${sectionTitle('Tim Reporter & Multimedia')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
        ${staffCard('Reporter Senior', 'Adi Nurcahyo', 'Desk AI & Infrastruktur Digital. Lulusan Jurnalistik UNPAD.')}
        ${staffCard('Reporter Senior', 'Maya Kartika', 'Desk Gadget & Consumer Tech. Penulis kolom teknologi terpopuler 2025.')}
        ${staffCard('Reporter', 'Rizky Pratama', 'Desk Startup & Ekonomi Digital. Spesialis liputan pendanaan venture.')}
        ${staffCard('Reporter', 'Nadia Safitri', 'Desk Telekomunikasi & Infrastruktur. Lulusan Teknik Telekomunikasi ITB.')}
        ${staffCard('Video Journalist', 'Bima Aditya', 'Produser konten video & multimedia. 6 tahun pengalaman visual storytelling.')}
        ${staffCard('Data Journalist', 'Citra Ramadhani, M.Stat.', 'Spesialis visualisasi data & infografis interaktif. Lulusan Statistika IPB.')}
      </div>

      <!-- Tim Teknologi -->
      ${sectionTitle('Tim Teknologi & Pengembangan')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
        ${staffCard('CTO / Lead Engineer', 'Hasan Maulana', 'Full-stack engineer. Arsitektur platform ByteIndonesia dari nol. 10 tahun pengalaman.')}
        ${staffCard('Backend Engineer', 'Arif Hidayat', 'Spesialis Go, PostgreSQL, dan infrastruktur cloud-native.')}
        ${staffCard('Frontend Engineer', 'Putri Ayu', 'Spesialis TypeScript, React, dan performa web. Core Web Vitals expert.')}
        ${staffCard('UI/UX Designer', 'Galih Pramono', 'Desainer antarmuka dengan pendekatan human-centered design. Lulusan HCI Stanford.')}
        ${staffCard('DevOps & SRE', 'Eko Prasetyo', 'Mengelola infrastruktur cloud, CI/CD, dan monitoring sistem redaksi.')}
        ${staffCard('AI/ML Engineer', 'Lestari Handayani, Ph.D.', 'Mengembangkan fitur AI summarization dan sentiment analysis untuk platform.')}
      </div>
    </section>
  `;
}


function renderPedomanMediaSiber(): string {
  const babs = [
    { title: 'Ruang Lingkup', content: 'Pedoman ini mencakup seluruh aktivitas pemberitaan media siber ByteIndonesia yang didistribusikan melalui situs web, aplikasi mobile, platform media sosial, dan layanan push notification. Media siber didefinisikan sebagai media yang menyelenggarakan kegiatan jurnalistik dan memenuhi persyaratan UU Pers serta Standar Perusahaan Pers.' },
    { title: 'Verifikasi & Keberimbangan Berita', content: 'Pada prinsipnya, setiap berita harus melalui mekanisme verifikasi dan berimbang. Berita yang dapat merugikan pihak lain memerlukan verifikasi pada berita yang sama untuk memenuhi prinsip akurasi dan keberimbangan. Ketentuan ini dikecualikan untuk berita yang bersifat mendesak (breaking news) dengan syarat: (a) berita utama memuat informasi terbatas; (b) berita dikembangkan sesegera mungkin; (c) setiap perkembangan ditautkan pada berita sebelumnya.' },
    { title: 'Isi Buatan Pengguna (UGC)', content: 'Media siber wajib memiliki dan menerapkan mekanisme moderasi yang efektif untuk mengelola Isi Buatan Pengguna (User Generated Content). ByteIndonesia menerapkan: (a) moderasi komentar berbasis AI sentiment filter; (b) pelaporan konten oleh pengguna lain; (c) penghapusan konten yang melanggar hukum dalam waktu 2x24 jam; (d) kebijakan larangan ujaran kebencian, pornografi, dan disinformasi.' },
    { title: 'Ralat, Koreksi, & Hak Jawab', content: 'Ralat, koreksi, dan hak jawab mengacu pada UU Pers. Media siber yang melakukan kesalahan dalam pemberitaan wajib: (a) memberikan ralat secara jelas dan terlihat di lokasi yang sama dengan berita yang diralat; (b) mencantumkan waktu ralat dan alasan secara transparan; (c) berita asli tetap dapat diakses publik beserta catatan koreksi. ByteIndonesia mencantumkan badge "✏️ DIKOREKSI" pada setiap artikel yang telah direvisi.' },
    { title: 'Pencabutan Berita', content: 'Pencabutan berita hanya dilakukan apabila terdapat putusan pengadilan yang berkekuatan hukum tetap (inkracht), atau atas permintaan Dewan Pers. Berita yang dicabut digantikan dengan halaman pemberitahuan yang menjelaskan alasan pencabutan disertai nomor putusan pengadilan terkait. URL asli tidak dialihkan ke halaman lain.' },
    { title: 'Iklan & Konten Bersponsor', content: 'Media siber wajib membedakan secara tegas antara konten jurnalistik dan iklan. ByteIndonesia menerapkan: (a) label "SPONSORED" atau "ADVERTORIAL" yang terlihat jelas; (b) konten berbayar tidak boleh menggunakan format yang menyerupai berita tanpa label; (c) tim redaksi terpisah dari tim bisnis/iklan; (d) kebijakan penolakan iklan yang bertentangan dengan kode etik jurnalistik.' },
    { title: 'Hak Cipta & Kekayaan Intelektual', content: 'Seluruh konten yang dipublikasikan di ByteIndonesia dilindungi oleh UU Hak Cipta No. 28 Tahun 2014. Pengutipan diperbolehkan dengan batasan: (a) maksimal 30% dari total isi berita; (b) wajib menyertakan tautan balik (backlink) ke artikel asli; (c) dilarang menggunakan konten untuk tujuan komersial tanpa izin tertulis; (d) gambar dan infografis dilindungi oleh lisensi CC BY-NC-ND 4.0 kecuali dinyatakan lain.' },
    { title: 'Sengketa & Penyelesaian', content: 'Seluruh sengketa terkait pemberitaan yang melibatkan ByteIndonesia diselesaikan melalui mekanisme: (a) mediasi internal melalui Dewan Etik ByteIndonesia; (b) jika tidak tercapai kesepakatan, sengketa dirujuk ke Dewan Pers; (c) jalur hukum melalui pengadilan hanya ditempuh setelah mekanisme mediasi gagal, sesuai dengan amanat UU Pers Pasal 18.' },
    { title: 'Perlindungan Data Pribadi', content: 'ByteIndonesia tunduk pada UU Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022. Kebijakan kami meliputi: (a) pengumpulan data pengguna seminimal mungkin (data minimization); (b) enkripsi data pribadi dengan standar AES-256; (c) hak pengguna untuk mengakses, mengoreksi, dan menghapus data pribadi; (d) penunjukan Data Protection Officer (DPO) yang bertanggung jawab langsung kepada direksi.' },
  ];

  const accentColors = ['var(--accent-cyan)', 'var(--accent-violet)', 'var(--accent-emerald)'];

  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">
      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.08), rgba(124,58,237,0.08)); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0;">
          Pedoman ini disusun berdasarkan <strong style="color:var(--text-primary);">Pedoman Pemberitaan Media Siber</strong> yang ditetapkan oleh Dewan Pers pada 3 Februari 2012 dan telah diamandemen sesuai perkembangan teknologi digital terkini. ByteIndonesia berkomitmen menjalankan seluruh ketentuan pedoman ini secara konsisten.
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${babs.map((bab, i) => `
          <div style="background:var(--bg-tertiary); padding:1.35rem; border-radius:var(--radius-md); border:1px solid var(--border-color); border-left:3px solid ${accentColors[i % 3]};">
            <h4 style="font-size:0.98rem; font-weight:800; color:var(--text-primary); margin:0 0 0.65rem 0; display:flex; align-items:center; gap:0.5rem;">
              <span style="background:${accentColors[i % 3]}; color:#000; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:800; flex-shrink:0;">${i + 1}</span>
              ${bab.title}
            </h4>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.65; margin:0;">${bab.content}</p>
          </div>
        `).join('')}
      </div>

      <div style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.82rem; color:var(--text-muted); line-height:1.6; font-family:var(--font-mono);">
        <strong style="color:var(--text-primary); display:block; margin-bottom:0.35rem;">Referensi Regulasi:</strong>
        UU No. 40 Tahun 1999 tentang Pers • UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016 tentang ITE • UU No. 27 Tahun 2022 tentang PDP • Peraturan Dewan Pers No. 1/Peraturan-DP/III/2012 tentang Pedoman Pemberitaan Media Siber • UU No. 28 Tahun 2014 tentang Hak Cipta
      </div>
    </section>
  `;
}


function renderDisclaimer(): string {
  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">

      ${sectionTitle('Batasan Tanggung Jawab')}
      <div style="font-size:0.92rem; color:var(--text-secondary); line-height:1.7; display:flex; flex-direction:column; gap:0.85rem;">
        <p>Seluruh informasi yang disajikan di portal ByteIndonesia (<code style="color:var(--accent-cyan);">byteindonesia.id</code>) disediakan <strong style="color:var(--text-primary);">"sebagaimana adanya" (as-is)</strong> untuk tujuan informasi umum. Meskipun redaksi berupaya keras memastikan keakuratan dan kekinian informasi, ByteIndonesia tidak memberikan jaminan dalam bentuk apapun, baik tersurat maupun tersirat, mengenai kelengkapan, keakuratan, keandalan, kesesuaian, atau ketersediaan situs web maupun informasi di dalamnya.</p>
        <p>Segala tindakan yang Anda ambil berdasarkan informasi di situs ini sepenuhnya menjadi risiko Anda sendiri. ByteIndonesia tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, konsekuensial, atau punitif yang timbul dari penggunaan situs web ini.</p>
      </div>

      ${sectionTitle('Ketentuan Penggunaan Situs')}
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        ${[
          { t: 'Konten Non-Nasihat Profesional', d: 'Informasi teknologi, keuangan, dan data pasar yang ditampilkan bersifat informatif dan BUKAN merupakan nasihat investasi, finansial, hukum, atau profesional. Konsultasikan keputusan penting Anda dengan profesional berlisensi.' },
          { t: 'Tautan Eksternal', d: 'Situs ini dapat memuat tautan ke situs web pihak ketiga. ByteIndonesia tidak memiliki kendali atas konten, kebijakan privasi, atau praktik situs pihak ketiga dan tidak bertanggung jawab atas isinya.' },
          { t: 'Perubahan Konten', d: 'ByteIndonesia berhak mengubah, memperbarui, atau menghapus konten kapan saja tanpa pemberitahuan terlebih dahulu. Perubahan material pada konten berita akan dicatat dalam sistem revisi editorial.' },
          { t: 'Ketersediaan Layanan', d: 'ByteIndonesia tidak menjamin bahwa situs akan selalu tersedia atau bebas dari gangguan teknis. Pemeliharaan terjadwal akan diumumkan melalui kanal media sosial resmi.' },
        ].map((item, i) => ethicsArticle(i + 1, item.t, item.d, ['var(--accent-cyan)', 'var(--accent-violet)', 'var(--accent-emerald)', 'var(--accent-cyan)'][i])).join('')}
      </div>

      ${sectionTitle('Hak Kekayaan Intelektual')}
      <div style="background:var(--bg-tertiary); padding:1.35rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.9rem; color:var(--text-secondary); line-height:1.7;">
        <p style="margin:0 0 0.75rem 0;">Seluruh konten di ByteIndonesia — termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar, klip audio/video, kompilasi data, dan perangkat lunak — merupakan kekayaan intelektual PT Byte Media Nusantara dan dilindungi oleh:</p>
        <ul style="padding-left:1.15rem; display:flex; flex-direction:column; gap:0.35rem; margin:0;">
          <li><strong style="color:var(--text-primary);">UU Hak Cipta No. 28 Tahun 2014</strong> — Perlindungan karya tulis dan multimedia</li>
          <li><strong style="color:var(--text-primary);">UU Merek dan Indikasi Geografis No. 20 Tahun 2016</strong> — Perlindungan merek "ByteIndonesia"</li>
          <li><strong style="color:var(--text-primary);">Konvensi Berne</strong> — Perlindungan hak cipta internasional</li>
        </ul>
      </div>

      ${sectionTitle('Kebijakan Privasi Data')}
      <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.7; display:flex; flex-direction:column; gap:0.85rem;">
        <p>ByteIndonesia mengumpulkan dan memproses data pribadi sesuai dengan <strong style="color:var(--text-primary);">UU Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022</strong>. Data yang kami kumpulkan meliputi:</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;">
          ${infoCard('Data Analitik', 'Alamat IP (dianonimkan), tipe browser, halaman yang dikunjungi')}
          ${infoCard('Data Langganan', 'Alamat email untuk newsletter (atas persetujuan pengguna)', 'var(--accent-violet)')}
          ${infoCard('Cookie', 'Preferensi tema, bahasa, dan riwayat baca (localStorage)', 'var(--accent-emerald)')}
        </div>
        <p>Anda berhak untuk: (a) mengakses data pribadi Anda; (b) meminta koreksi data yang tidak akurat; (c) meminta penghapusan data; (d) menarik persetujuan pemrosesan data. Permintaan dapat dikirim ke <code style="color:var(--accent-cyan); font-weight:700;">dpo@byteindonesia.id</code>.</p>
      </div>

      ${sectionTitle('Pernyataan Non-Afiliasi')}
      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.06), rgba(124,58,237,0.06)); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.9rem; color:var(--text-secondary); line-height:1.7;">
        <p style="margin:0;">ByteIndonesia merupakan media independen yang <strong style="color:var(--text-primary);">TIDAK terafiliasi</strong> dengan partai politik, lembaga pemerintah, konglomerasi bisnis, maupun organisasi ideologis manapun. Seluruh kebijakan editorial ditentukan secara independen oleh Dewan Redaksi tanpa intervensi dari pemegang saham, pengiklan, atau pihak eksternal lainnya. Independensi ini dijamin oleh Piagam Redaksi Internal yang diperbarui setiap tahun.</p>
      </div>

      <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.8rem; color:var(--text-muted); text-align:center; font-family:var(--font-mono);">
        Terakhir diperbarui: 1 Agustus 2026 • Berlaku sejak: 1 Maret 2025
      </div>
    </section>
  `;
}


function renderInfoIklan(): string {
  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">

      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.08), rgba(124,58,237,0.08)); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0;">
          Jangkau <strong style="color:var(--text-primary);">audiens teknologi premium Indonesia</strong> melalui platform ByteIndonesia. Kami menyediakan berbagai format iklan dan kemitraan konten yang dirancang untuk memberikan dampak maksimal bagi brand Anda.
        </p>
      </div>

      <!-- Statistik Audiens -->
      ${sectionTitle('Profil & Statistik Audiens')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1rem;">
        ${infoCard('Monthly Unique Visitors', '2.8 Juta+')}
        ${infoCard('Monthly Pageviews', '12.5 Juta+', 'var(--accent-violet)')}
        ${infoCard('Newsletter Subscribers', '185.000+', 'var(--accent-emerald)')}
        ${infoCard('Rata-Rata Durasi Sesi', '4 menit 32 detik')}
        ${infoCard('Engagement Rate Sosmed', '6.2%', 'var(--accent-violet)')}
        ${infoCard('Followers Gabungan', '920.000+', 'var(--accent-emerald)')}
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
        ${infoCard('Demografi Usia', '65% berusia 25–44 tahun (decision makers)')}
        ${infoCard('Profesi Audiens', 'IT Professional, Startup Founder, C-Level Executive, Investor', 'var(--accent-violet)')}
        ${infoCard('Distribusi Geografis', 'Jabodetabek 42%, Jawa 28%, Sumatera 14%, Sisanya 16%', 'var(--accent-emerald)')}
      </div>

      <!-- Paket Iklan -->
      ${sectionTitle('Format & Paket Iklan')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
        ${[
          { name: 'Banner Display Ads', price: 'Mulai Rp 15 Juta / bulan', items: ['Leaderboard (728×90)', 'Medium Rectangle (300×250)', 'Billboard (970×250)', 'Sticky Footer (320×50 mobile)', 'Programmatic & Direct Buy tersedia'] },
          { name: 'Native Article / Advertorial', price: 'Mulai Rp 25 Juta / artikel', items: ['Artikel ditulis oleh tim konten ByteIndonesia', 'Distribusi ke newsletter & sosial media', 'Label "SPONSORED" transparan', 'SEO-optimized dengan internal linking', 'Termasuk 1x revisi'] },
          { name: 'Sponsored Content Series', price: 'Mulai Rp 85 Juta / 4 artikel', items: ['Seri konten mendalam (4 artikel)', 'Dedicated landing page brand', 'Amplifikasi sosial media premium', 'Laporan performa & analytics', 'Brand integration di newsletter'] },
          { name: 'Video Pre-Roll & Mid-Roll', price: 'Mulai Rp 35 Juta / bulan', items: ['Pre-roll 15 detik (skippable)', 'Mid-roll 30 detik pada video editorial', 'Companion banner bersamaan', 'Targeting berdasarkan kategori konten', 'Format MP4/WebM responsif'] },
        ].map((pkg, i) => {
          const accent = ['var(--accent-cyan)', 'var(--accent-violet)', 'var(--accent-emerald)', 'var(--accent-cyan)'][i];
          return `<div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); border-top:3px solid ${accent}; display:flex; flex-direction:column;">
            <h4 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin:0 0 0.35rem 0;">${pkg.name}</h4>
            <span style="font-size:0.82rem; font-weight:700; color:${accent}; font-family:var(--font-mono); margin-bottom:1rem;">${pkg.price}</span>
            <ul style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; padding-left:1.1rem; margin:0; flex:1; display:flex; flex-direction:column; gap:0.3rem;">
              ${pkg.items.map(it => `<li>${it}</li>`).join('')}
            </ul>
          </div>`;
        }).join('')}
      </div>

      <!-- Syarat & Ketentuan -->
      ${sectionTitle('Syarat & Ketentuan Iklan')}
      <div style="background:var(--bg-tertiary); padding:1.35rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.88rem; color:var(--text-secondary); line-height:1.65;">
        <ul style="padding-left:1.15rem; display:flex; flex-direction:column; gap:0.5rem; margin:0;">
          <li>Seluruh materi iklan wajib mematuhi regulasi Otoritas Jasa Keuangan (OJK), BPOM, dan peraturan perundang-undangan yang berlaku di Indonesia.</li>
          <li>ByteIndonesia berhak menolak iklan yang mengandung unsur SARA, pornografi, perjudian, penipuan, atau bertentangan dengan kode etik jurnalistik.</li>
          <li>Konten bersponsor (advertorial) wajib dilabeli secara jelas dan tidak boleh ditulis dengan format yang menyesatkan pembaca sebagai berita independen.</li>
          <li>Pembayaran dilakukan di muka (prepaid) dengan invoice resmi dari PT Byte Media Nusantara. Faktur pajak tersedia.</li>
          <li>Pembatalan setelah materi tayang dikenakan biaya penuh. Pembatalan sebelum tayang dikenakan biaya administrasi 20%.</li>
        </ul>
      </div>

      <!-- Kontak -->
      ${sectionTitle('Hubungi Tim Bisnis & Iklan')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        ${infoCard('Email Iklan', 'iklan@byteindonesia.id')}
        ${infoCard('WhatsApp Bisnis', '+62 813-2000-8899', 'var(--accent-violet)')}
        ${infoCard('Jadwal Konsultasi', 'Senin–Jumat, 09.00–16.00 WIB', 'var(--accent-emerald)')}
      </div>
    </section>
  `;
}


function renderKarir(): string {
  return `
    <section style="display:flex; flex-direction:column; gap:2rem;">

      <div style="background:linear-gradient(135deg, rgba(0,242,254,0.08), rgba(124,58,237,0.08)); padding:1.75rem; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
        <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0;">
          Bergabunglah dengan tim ByteIndonesia dan jadilah bagian dari revolusi media teknologi Indonesia. Kami mencari individu yang <strong style="color:var(--text-primary);">passionate terhadap teknologi, memiliki integritas tinggi, dan siap berkontribusi</strong> dalam menyajikan jurnalisme teknologi terbaik untuk bangsa.
        </p>
      </div>

      <!-- Budaya Kerja -->
      ${sectionTitle('Budaya & Nilai Kerja')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
        ${[
          { icon: '🚀', title: 'Innovation First', desc: 'Kami mendorong eksperimen dan ide-ide baru. Setiap anggota tim bebas mengusulkan inisiatif dan proyek inovatif.' },
          { icon: '🤝', title: 'Kolaborasi Terbuka', desc: 'Struktur organisasi datar. Ide terbaik menang, bukan senioritas. Komunikasi transparan di semua level.' },
          { icon: '📈', title: 'Growth Mindset', desc: 'Budget pengembangan diri tahunan untuk kursus, konferensi, dan sertifikasi. Mentoring dari senior leader.' },
          { icon: '⚖️', title: 'Work-Life Balance', desc: 'Kebijakan remote-friendly, jam kerja fleksibel, dan cuti yang kompetitif. Kesehatan mental adalah prioritas.' },
        ].map(v => `<div style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">${v.icon}</div>
          <strong style="display:block; font-size:0.9rem; color:var(--text-primary); margin-bottom:0.4rem;">${v.title}</strong>
          <span style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">${v.desc}</span>
        </div>`).join('')}
      </div>

      <!-- Lowongan Aktif -->
      ${sectionTitle('Lowongan Aktif')}
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${jobCard('Reporter Teknologi Senior', 'Full-Time', 'Jakarta / Remote', 'Meliput perkembangan terkini di bidang AI, cloud computing, dan transformasi digital Indonesia. Minimal 3 tahun pengalaman jurnalisme teknologi. Kemampuan menulis longform dan analisis mendalam. Jaringan narasumber di ekosistem startup Indonesia menjadi nilai plus.')}
        ${jobCard('Data Journalist', 'Full-Time', 'Jakarta', 'Mengolah data publik menjadi visualisasi dan infografis interaktif untuk mendukung konten editorial. Menguasai Python, R, D3.js, atau Tableau. Pengalaman minimal 2 tahun di bidang data storytelling atau jurnalisme data.')}
        ${jobCard('UI/UX Designer', 'Full-Time', 'Jakarta / Remote', 'Merancang antarmuka platform ByteIndonesia (web & mobile). Menguasai Figma, menerapkan design system, dan melakukan user research. Portofolio wajib disertakan. Pengalaman di media/publishing industry menjadi nilai plus.')}
        ${jobCard('Backend Engineer (Go)', 'Full-Time', 'Jakarta / Remote', 'Mengembangkan dan memelihara arsitektur backend platform berita. Menguasai Go, PostgreSQL, Redis, dan Docker. Pengalaman dengan microservices architecture dan high-traffic systems minimal 3 tahun.')}
        ${jobCard('Content Strategist', 'Full-Time', 'Jakarta', 'Merancang strategi konten editorial dan distribusi multi-platform. Menganalisis performa konten dan tren audiens. Pengalaman minimal 4 tahun di digital media atau content marketing. Menguasai SEO dan analytics.')}
        ${jobCard('Video Producer & Editor', 'Full-Time', 'Jakarta', 'Memproduksi konten video pendek (Shorts/Reels) dan video editorial panjang. Menguasai Adobe Premiere Pro, After Effects, dan DaVinci Resolve. Pengalaman storytelling visual minimal 2 tahun.')}
      </div>

      <!-- Program Magang -->
      ${sectionTitle('Program Magang (Internship)')}
      <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <h4 style="font-size:0.98rem; font-weight:800; color:var(--text-primary); margin:0 0 0.85rem 0;">📚 ByteInternship Program — Batch 2026</h4>
        <div style="font-size:0.9rem; color:var(--text-secondary); line-height:1.7; display:flex; flex-direction:column; gap:0.6rem;">
          <p style="margin:0;">Program magang ByteIndonesia berdurasi <strong style="color:var(--text-primary);">6 bulan</strong> (Januari–Juni atau Juli–Desember) dan terbuka untuk mahasiswa semester 5+ atau fresh graduate dari seluruh universitas di Indonesia.</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-top:0.5rem;">
            ${infoCard('Desk Tersedia', 'Editorial, Data, Desain, Engineering')}
            ${infoCard('Benefit', 'Stipend bulanan, sertifikat, mentor 1-on-1', 'var(--accent-violet)')}
            ${infoCard('Pendaftaran', 'Rolling basis, kirim CV ke karir@byteindonesia.id', 'var(--accent-emerald)')}
          </div>
        </div>
      </div>

      <!-- Benefit -->
      ${sectionTitle('Benefit & Fasilitas')}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        ${[
          { icon: '💰', title: 'Kompensasi Kompetitif', desc: 'Gaji di atas rata-rata industri media. Review kinerja & kenaikan berkala setiap 6 bulan.' },
          { icon: '🏥', title: 'Asuransi Kesehatan', desc: 'BPJS Kesehatan & Ketenagakerjaan + asuransi swasta premium untuk karyawan dan keluarga inti.' },
          { icon: '💻', title: 'Peralatan Kerja', desc: 'MacBook Pro/ThinkPad terbaru, monitor 4K, dan aksesoris lengkap disediakan sejak hari pertama.' },
          { icon: '📚', title: 'Learning Budget', desc: 'Rp 10 juta/tahun untuk kursus online, konferensi, buku, dan sertifikasi profesional.' },
          { icon: '🏖️', title: 'Cuti Generous', desc: '18 hari cuti tahunan + cuti sakit + cuti melahirkan/paternity sesuai regulasi.' },
          { icon: '🍔', title: 'Makan & Transportasi', desc: 'Tunjangan makan harian dan transportasi. Snack & kopi tersedia di kantor.' },
        ].map(b => `<div style="background:var(--bg-tertiary); padding:1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <div style="font-size:1.3rem; margin-bottom:0.4rem;">${b.icon}</div>
          <strong style="display:block; font-size:0.88rem; color:var(--text-primary); margin-bottom:0.3rem;">${b.title}</strong>
          <span style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">${b.desc}</span>
        </div>`).join('')}
      </div>

      <!-- Cara Melamar -->
      ${sectionTitle('Cara Melamar')}
      <div style="background:var(--bg-tertiary); padding:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-size:0.9rem; color:var(--text-secondary); line-height:1.7;">
        <ol style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem; margin:0;">
          <li>Kirimkan <strong style="color:var(--text-primary);">CV, portofolio, dan surat lamaran</strong> ke <code style="color:var(--accent-cyan); font-weight:700;">karir@byteindonesia.id</code></li>
          <li>Format subjek email: <code style="color:var(--accent-cyan);">[Posisi] — Nama Lengkap</code> (contoh: <em>[Reporter Senior] — Budi Santoso</em>)</li>
          <li>Tim HR akan menghubungi kandidat terpilih dalam <strong style="color:var(--text-primary);">7–14 hari kerja</strong></li>
          <li>Proses seleksi: <em>Screening CV → Tes Tertulis → Wawancara HR → Wawancara User → Offering</em></li>
        </ol>
      </div>
    </section>
  `;
}


// ──────────────────────────────────────────────
// Main Exported Class
// ──────────────────────────────────────────────

export class InstitutionalPages {

  public static getPageTitle(pageId: InstitutionalPageId, lang: 'id' | 'en'): string {
    return PAGE_TITLES[pageId]?.[lang] ?? pageId;
  }

  public static renderPage(pageId: InstitutionalPageId, lang: 'id' | 'en'): string {
    const title = this.getPageTitle(pageId, lang);
    const homeLabel = lang === 'en' ? 'Home' : 'Beranda';
    const backLabel = lang === 'en' ? '← Back to Home' : '← Kembali ke Beranda';

    let contentHTML = '';
    switch (pageId) {
      case 'tentang-kami': contentHTML = renderTentangKami(); break;
      case 'hubungi-kami': contentHTML = renderHubungiKami(); break;
      case 'kode-etik': contentHTML = renderKodeEtik(); break;
      case 'redaksi': contentHTML = renderRedaksi(); break;
      case 'pedoman-media-siber': contentHTML = renderPedomanMediaSiber(); break;
      case 'disclaimer': contentHTML = renderDisclaimer(); break;
      case 'info-iklan': contentHTML = renderInfoIklan(); break;
      case 'karir': contentHTML = renderKarir(); break;
    }

    return `
      <div style="max-width:860px; margin:0 auto; padding:2rem 1rem 4rem 1rem;">
        <!-- Breadcrumb & Back Button -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
          <nav style="font-size:0.8rem; color:var(--text-muted); display:flex; align-items:center; gap:0.35rem;">
            <a href="#" style="color:var(--accent-cyan); text-decoration:none; font-weight:600; transition:opacity 0.2s;" onmouseenter="this.style.opacity='0.7'" onmouseleave="this.style.opacity='1'">${homeLabel}</a>
            <span>›</span>
            <span style="color:var(--text-primary); font-weight:600;">${title}</span>
          </nav>
          <a href="#" class="inst-back-btn" style="font-size:0.82rem; font-weight:700; color:var(--accent-cyan); text-decoration:none; display:flex; align-items:center; gap:0.3rem; padding:0.45rem 1rem; background:rgba(0,242,254,0.08); border:1px solid rgba(0,242,254,0.2); border-radius:100px; transition:all 0.2s;" onmouseenter="this.style.background='rgba(0,242,254,0.15)'" onmouseleave="this.style.background='rgba(0,242,254,0.08)'">${backLabel}</a>
        </div>

        <!-- Page Hero Header -->
        <div style="background:linear-gradient(135deg, rgba(0,242,254,0.12), rgba(124,58,237,0.12)); padding:2.5rem 2rem; border-radius:var(--radius-lg); border:1px solid var(--border-color); margin-bottom:2.5rem; position:relative; overflow:hidden;">
          <div style="position:absolute; top:-20px; right:-20px; width:120px; height:120px; background:radial-gradient(circle, rgba(0,242,254,0.15), transparent); border-radius:50%;"></div>
          <div style="position:absolute; bottom:-30px; left:-30px; width:100px; height:100px; background:radial-gradient(circle, rgba(124,58,237,0.1), transparent); border-radius:50%;"></div>
          <span style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--accent-cyan); letter-spacing:0.15em; display:block; margin-bottom:0.4rem; position:relative; z-index:1; font-family:var(--font-mono);">BYTEINDONESIA.ID</span>
          <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin:0; position:relative; z-index:1; line-height:1.3;">${title}</h1>
        </div>

        <!-- Page Content -->
        ${contentHTML}
      </div>
    `;
  }

  public static isValidPageId(id: string): id is InstitutionalPageId {
    return id in PAGE_TITLES;
  }
}
