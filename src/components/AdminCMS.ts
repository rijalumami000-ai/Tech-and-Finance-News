import type { Article, CategoryId } from '../types/news';
import { ARTICLES, CATEGORIES } from '../data/mockNews';
import { AuthService } from '../services/authService';
import { Toast } from '../utils/toast';

export class AdminCMS {
  private articles: Article[];
  private onArticlesChange: () => void;
  private searchKeyword: string = '';
  private activeTab: 'articles' | 'analytics' | 'settings' = 'articles';

  constructor(onArticlesChange: () => void) {
    this.articles = ARTICLES;
    this.onArticlesChange = onArticlesChange;
  }

  public renderAdminModalHTML(): string {
    const user = AuthService.getCurrentUser();

    // If not logged in, render Encrypted Login View
    if (!user) {
      return this.renderLoginViewHTML();
    }

    // If logged in, render Professional Fullscreen CMS Dashboard Workspace View
    return this.renderFullscreenDashboardHTML(user);
  }

  // Login View HTML
  private renderLoginViewHTML(): string {
    return `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: var(--bg-primary);">
        <div class="modal-header-bar" style="background: var(--bg-tertiary);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.2rem; height: 2.2rem; background: var(--gradient-brand); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 800;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <h3 style="font-weight: 800; font-size: 1.1rem;">Otentikasi Redaksi ByteIndonesia</h3>
              <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: var(--font-mono);">Encrypted 256-Bit SSL Guard</span>
            </div>
          </div>
          <button class="btn-close" id="admin-modal-close-btn" aria-label="Close CMS">✕</button>
        </div>

        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem;">
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 3rem 2.5rem; max-width: 460px; width: 100%; box-shadow: var(--shadow-lg);">
            <div style="text-align: center; margin-bottom: 2rem;">
              <div style="width: 4.5rem; height: 4.5rem; background: var(--gradient-ai); border: 1px solid var(--border-active); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--accent-cyan); box-shadow: var(--shadow-glow);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">Masuk Portal CMS Redaksi</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Sistem terlindungi khusus untuk jurnalis & editor terverifikasi ByteIndonesia.</p>
            </div>

            <div id="login-error-alert" style="display: none; background: rgba(244, 63, 94, 0.15); border: 1px solid var(--accent-rose); color: var(--accent-rose); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.25rem; font-weight: 600; text-align: center;"></div>

            <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-secondary);">Username Redaksi</label>
                <input type="text" id="login-username" required placeholder="Masukkan username..." value="Rijalumami" style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.9rem; font-weight: 600;" />
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-secondary);">Password Terenkripsi</label>
                <input type="password" id="login-password" required placeholder="••••••••" value="Rijalumami1002" style="width: 100%; padding: 0.75rem 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.9rem;" />
              </div>

              <button type="submit" style="padding: 0.85rem; background: var(--gradient-brand); color: #000; font-weight: 800; border-radius: var(--radius-full); font-size: 0.95rem; margin-top: 0.5rem; box-shadow: var(--shadow-glow); cursor: pointer;">
                Masuk Sistem Redaksi
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // Professional Fullscreen CMS Dashboard Workspace
  private renderFullscreenDashboardHTML(user: ReturnType<typeof AuthService.getCurrentUser>): string {
    const totalViews = this.articles.reduce((acc, a) => acc + a.viewsCount, 0);
    const totalLikes = this.articles.reduce((acc, a) => acc + a.likesCount, 0);
    const featuredCount = this.articles.filter(a => a.isFeatured).length;

    return `
      <div style="width: 100vw; height: 100vh; display: flex; background: var(--bg-primary); color: var(--text-primary); overflow: hidden;">
        
        <!-- Left Navigation Sidebar Rail -->
        <aside style="width: 260px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem 1rem;">
          <div>
            <!-- Brand CMS Header -->
            <div style="display: flex; align-items: center; gap: 0.75rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem;">
              <div style="width: 2.4rem; height: 2.4rem; background: var(--gradient-brand); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 800; box-shadow: var(--shadow-glow);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <h3 style="font-weight: 800; font-size: 1.1rem; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ByteIndonesia</h3>
                <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-cyan);">EDITORIAL CMS</span>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav style="display: flex; flex-direction: column; gap: 0.4rem;">
              <button class="nav-sidebar-link ${this.activeTab === 'articles' ? 'active' : ''}" data-tab="articles">
                Manajer Berita
              </button>
              <button class="nav-sidebar-link ${this.activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
                Analitik Redaksi
              </button>
              <button class="nav-sidebar-link ${this.activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
                Pengaturan CMS
              </button>
            </nav>
          </div>

          <!-- User Profile Card & Actions -->
          <div style="padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <img src="${user?.avatar}" alt="${user?.fullName}" style="width: 2.2rem; height: 2.2rem; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--accent-cyan);" />
              <div style="overflow: hidden;">
                <div style="font-weight: 700; font-size: 0.85rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${user?.fullName}</div>
                <div style="font-size: 0.7rem; color: var(--accent-cyan); font-family: var(--font-mono);">${user?.role}</div>
              </div>
            </div>

            <button id="btn-logout-cms" style="width: 100%; padding: 0.6rem; background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: var(--radius-md); color: var(--accent-rose); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              Keluar (Logout)
            </button>
          </div>
        </aside>

        <!-- Right Main Workspace Content Area -->
        <main style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          
          <!-- Top Header Bar -->
          <header style="height: 4.25rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1rem; flex: 1; max-width: 450px;">
              <input type="text" id="admin-search-input" value="${this.searchKeyword}" placeholder="Cari judul berita, kata kunci..." style="width: 100%; padding: 0.6rem 1.25rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-full); color: var(--text-primary); font-size: 0.875rem;" />
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-size: 0.78rem; color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); padding: 0.3rem 0.75rem; border-radius: var(--radius-full); border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 600;">Server Go & PostgreSQL Online</span>
              
              <button id="btn-create-article" style="padding: 0.6rem 1.35rem; background: var(--gradient-brand); color: #000; font-weight: 800; border-radius: var(--radius-full); font-size: 0.875rem; display: flex; align-items: center; gap: 0.4rem; box-shadow: var(--shadow-glow); cursor: pointer;">
                Tulis Berita Studio
              </button>

              <button class="btn-close" id="admin-modal-close-btn" title="Tutup & Kembali ke Portal Publik" aria-label="Close CMS">✕</button>
            </div>
          </header>

          <!-- Main Scrollable Dashboard Content -->
          <div style="flex: 1; padding: 2rem; overflow-y: auto;">
            
            ${this.activeTab === 'analytics' ? this.renderAnalyticsTabHTML() : `
              <!-- Analytics Top Summary Cards -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem;">
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Berita</div>
                  <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-cyan); margin-top: 0.2rem;">${this.articles.length} Artikel</div>
                </div>
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Pembaca (Views)</div>
                  <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-violet); margin-top: 0.2rem;">${(totalViews / 1000).toFixed(1)}k</div>
                </div>
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Interaksi (Likes)</div>
                  <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-emerald); margin-top: 0.2rem;">${totalLikes.toLocaleString('id-ID')} Menyukai</div>
                </div>
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-md);">
                  <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Headline Utama (Featured)</div>
                  <div style="font-size: 1.85rem; font-weight: 800; color: var(--accent-amber); margin-top: 0.2rem;">${featuredCount} Artikel</div>
                </div>
              </div>

              <!-- Content Manager Table Section -->
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h3 style="font-size: 1.1rem; font-weight: 800;">Daftar Artikel & Berita Redaksi</h3>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Kelola publikasi, status headline, dan sunting naskah berita.</p>
                  </div>
                </div>

                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                    <thead>
                      <tr style="background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">
                        <th style="padding: 1rem 1.25rem;">Berita & Judul Utama</th>
                        <th style="padding: 1rem 1.25rem;">Kategori</th>
                        <th style="padding: 1rem 1.25rem;">Penulis</th>
                        <th style="padding: 1rem 1.25rem;">Statistik</th>
                        <th style="padding: 1rem 1.25rem;">Status Highlight</th>
                        <th style="padding: 1rem 1.25rem; text-align: right;">Aksi Redaksi</th>
                      </tr>
                    </thead>
                    <tbody id="cms-table-body">
                      ${this.renderTableRowsHTML()}
                    </tbody>
                  </table>
                </div>
              </div>
            `}

          </div>
        </main>
      </div>
    `;
  }

  // Analytics Tab View
  private renderAnalyticsTabHTML(): string {
    return `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        <h2 style="font-size: 1.4rem; font-weight: 800;">Laporan Analitik Redaksi & Pertumbuhan Pembaca</h2>

        <!-- Bar Chart Daily Visitors -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem;">Tren Pembaca Harian (Minggu Ini)</h3>
          
          <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 180px; gap: 1rem; padding-top: 1rem; border-bottom: 1px solid var(--border-color);">
            ${[
              { day: 'Sen', val: 12400, h: '45%' },
              { day: 'Sel', val: 18200, h: '65%' },
              { day: 'Rab', val: 24500, h: '85%' },
              { day: 'Kam', val: 21100, h: '75%' },
              { day: 'Jum', val: 28900, h: '95%' },
              { day: 'Sab', val: 34200, h: '100%' },
              { day: 'Min', val: 19800, h: '70%' }
            ].map(bar => `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--accent-cyan);">${(bar.val/1000).toFixed(1)}k</span>
                <div style="width: 100%; max-width: 42px; height: ${bar.h}; background: var(--gradient-brand); border-radius: 6px 6px 0 0; box-shadow: var(--shadow-glow);"></div>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${bar.day}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Leaderboard Table Jurnalis -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Performa Tim Redaksi ByteIndonesia</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">
                <th style="padding: 0.75rem 0; text-align: left;">Jurnalis / Editor</th>
                <th style="padding: 0.75rem 0; text-align: center;">Jumlah Berita</th>
                <th style="padding: 0.75rem 0; text-align: center;">Total Pembaca</th>
                <th style="padding: 0.75rem 0; text-align: right;">Rata-rata Interaksi</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.85rem 0; font-weight: 700;">Rijal Umami (Editor in Chief)</td>
                <td style="padding: 0.85rem 0; text-align: center;">18 Artikel</td>
                <td style="padding: 0.85rem 0; text-align: center; color: var(--accent-cyan); font-weight: 700;">142.8rb</td>
                <td style="padding: 0.85rem 0; text-align: right; color: var(--accent-emerald); font-weight: 700;">94.2%</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.85rem 0; font-weight: 700;">Dimas Prasetyo (AI Analyst)</td>
                <td style="padding: 0.85rem 0; text-align: center;">12 Artikel</td>
                <td style="padding: 0.85rem 0; text-align: center; color: var(--accent-cyan); font-weight: 700;">88.5rb</td>
                <td style="padding: 0.85rem 0; text-align: right; color: var(--accent-emerald); font-weight: 700;">89.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private renderTableRowsHTML(): string {
    const filtered = this.articles.filter(a => 
      this.searchKeyword === '' || a.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );

    if (filtered.length === 0) {
      return `<tr><td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">Tidak ada artikel ditemukan.</td></tr>`;
    }

    return filtered.map(art => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 1rem 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <img src="${art.imageUrl}" alt="${art.title}" style="width: 60px; height: 42px; border-radius: 8px; object-fit: cover;" />
            <div style="max-width: 320px;">
              <div style="font-weight: 700; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${art.title}</div>
              <span style="font-size: 0.72rem; color: var(--text-muted);">ID: ${art.id}</span>
            </div>
          </div>
        </td>
        <td style="padding: 1rem 1.25rem;">
          <span class="tag-badge" style="font-size: 0.7rem;">${art.category.toUpperCase()}</span>
        </td>
        <td style="padding: 1rem 1.25rem;">
          <div style="font-weight: 600; color: var(--text-secondary);">${art.author.name}</div>
        </td>
        <td style="padding: 1rem 1.25rem; font-family: var(--font-mono); font-size: 0.8rem;">
          <div>${(art.viewsCount).toLocaleString('id-ID')} Pembaca</div>
          <div>${art.likesCount} Menyukai</div>
        </td>
        <td style="padding: 1rem 1.25rem;">
          <div style="display: flex; gap: 0.35rem;">
            <button class="btn-toggle-badge ${art.isFeatured ? 'active' : ''}" data-action="toggle-featured" data-id="${art.id}" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; border-radius: 6px; border: 1px solid var(--border-color); background: ${art.isFeatured ? 'rgba(0, 242, 254, 0.2)' : 'transparent'}; color: ${art.isFeatured ? 'var(--accent-cyan)' : 'var(--text-muted)'}; font-weight:700; cursor:pointer;">
              ${art.isFeatured ? 'Featured' : 'Standard'}
            </button>
            <button class="btn-toggle-badge ${art.isBreaking ? 'active' : ''}" data-action="toggle-breaking" data-id="${art.id}" style="padding: 0.25rem 0.6rem; font-size: 0.7rem; border-radius: 6px; border: 1px solid var(--border-color); background: ${art.isBreaking ? 'rgba(244, 63, 94, 0.2)' : 'transparent'}; color: ${art.isBreaking ? 'var(--accent-rose)' : 'var(--text-muted)'}; font-weight:700; cursor:pointer;">
              ${art.isBreaking ? 'Breaking' : 'Standard'}
            </button>
          </div>
        </td>
        <td style="padding: 1rem 1.25rem; text-align: right;">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            <button class="btn-action-edit" data-id="${art.id}" style="padding: 0.4rem 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); font-size: 0.78rem; font-weight:700; cursor:pointer;">Edit Studio</button>
            <button class="btn-action-delete" data-id="${art.id}" style="padding: 0.4rem 0.75rem; background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 6px; color: var(--accent-rose); font-size: 0.78rem; font-weight:700; cursor:pointer;">Hapus</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  public bindAdminEvents(modalElem: HTMLElement) {
    if (!AuthService.isAuthenticated()) {
      const loginForm = modalElem.querySelector('#admin-login-form') as HTMLFormElement;
      const errorAlert = modalElem.querySelector('#login-error-alert') as HTMLElement;

      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const usernameInput = (modalElem.querySelector('#login-username') as HTMLInputElement).value;
          const passwordInput = (modalElem.querySelector('#login-password') as HTMLInputElement).value;

          const result = AuthService.login(usernameInput, passwordInput);
          if (result.success) {
            modalElem.innerHTML = this.renderAdminModalHTML();
            this.bindAdminEvents(modalElem);
          } else {
            if (errorAlert) {
              errorAlert.textContent = result.message;
              errorAlert.style.display = 'block';
            }
          }
        });
      }
      return;
    }

    // Sidebar Tab Switcher
    modalElem.querySelectorAll('.nav-sidebar-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as 'articles' | 'analytics' | 'settings';
        if (tab) {
          this.activeTab = tab;
          modalElem.innerHTML = this.renderAdminModalHTML();
          this.bindAdminEvents(modalElem);
        }
      });
    });

    // Logout Handler
    const logoutBtn = modalElem.querySelector('#btn-logout-cms');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        modalElem.innerHTML = this.renderAdminModalHTML();
        this.bindAdminEvents(modalElem);
        Toast.show('Sesi redaksi telah berakhir.');
      });
    }

    const searchInput = modalElem.querySelector('#admin-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchKeyword = (e.target as HTMLInputElement).value;
        const tbody = modalElem.querySelector('#cms-table-body');
        if (tbody) tbody.innerHTML = this.renderTableRowsHTML();
        this.bindTableActionEvents(modalElem);
      });
    }

    const createBtn = modalElem.querySelector('#btn-create-article');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        this.openFullscreenArticleEditor(null, modalElem);
      });
    }

    this.bindTableActionEvents(modalElem);
  }

  private bindTableActionEvents(modalElem: HTMLElement) {
    // Toggle Featured
    modalElem.querySelectorAll('[data-action="toggle-featured"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const art = this.articles.find(a => a.id === id);
        if (art) {
          art.isFeatured = !art.isFeatured;
          this.onArticlesChange();
          this.refreshTable(modalElem);
          Toast.show(`Status Featured artikel ${art.isFeatured ? 'diaktifkan' : 'dinonaktifkan'}.`);
        }
      });
    });

    // Toggle Breaking
    modalElem.querySelectorAll('[data-action="toggle-breaking"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const art = this.articles.find(a => a.id === id);
        if (art) {
          art.isBreaking = !art.isBreaking;
          this.onArticlesChange();
          this.refreshTable(modalElem);
          Toast.show(`Status Breaking artikel ${art.isBreaking ? 'diaktifkan' : 'dinonaktifkan'}.`);
        }
      });
    });

    // Edit Article
    modalElem.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const art = this.articles.find(a => a.id === id);
        if (art) this.openFullscreenArticleEditor(art, modalElem);
      });
    });

    // Delete Article with Custom Glassmorphism Confirmation Modal
    modalElem.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const art = this.articles.find(a => a.id === id);
        if (id && art) {
          this.showDeleteConfirmationModal(art.title, () => {
            const idx = this.articles.findIndex(a => a.id === id);
            if (idx > -1) {
              this.articles.splice(idx, 1);
              this.onArticlesChange();
              this.refreshTable(modalElem);
              Toast.show('Artikel berhasil dihapus dari ByteIndonesia.', 'warning');
            }
          });
        }
      });
    });
  }

  // Custom Delete Confirmation Modal
  private showDeleteConfirmationModal(title: string, onConfirm: () => void) {
    const existing = document.getElementById('delete-confirm-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'delete-confirm-overlay';
    overlay.className = 'modal-overlay open';
    overlay.style.zIndex = '4500';

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 440px; padding: 2rem; border: 1px solid var(--accent-rose); box-shadow: var(--shadow-lg);">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 3.5rem; height: 3.5rem; background: rgba(244, 63, 94, 0.15); border: 1px solid var(--accent-rose); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--accent-rose); font-size: 1.5rem;">🗑️</div>
          <h3 style="font-size: 1.2rem; font-weight: 800;">Hapus Artikel Redaksi?</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.5;">Apakah Anda yakin ingin menghapus artikel <strong>"${title}"</strong>? Tindakan ini tidak dapat dibatalkan.</p>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button id="cancel-delete-btn" style="flex: 1; padding: 0.75rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-full); color: var(--text-primary); font-weight: 700; font-size: 0.85rem; cursor: pointer;">Batal</button>
          <button id="confirm-delete-btn" style="flex: 1; padding: 0.75rem; background: var(--accent-rose); border: none; border-radius: var(--radius-full); color: #fff; font-weight: 800; font-size: 0.85rem; cursor: pointer;">Hapus Permanen</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#cancel-delete-btn')?.addEventListener('click', () => overlay.remove());
    overlay.querySelector('#confirm-delete-btn')?.addEventListener('click', () => {
      overlay.remove();
      onConfirm();
    });
  }

  private refreshTable(modalElem: HTMLElement) {
    const tbody = modalElem.querySelector('#cms-table-body');
    if (tbody) tbody.innerHTML = this.renderTableRowsHTML();
    this.bindTableActionEvents(modalElem);
  }

  // Open Professional WYSIWYG Fullscreen Studio
  private openFullscreenArticleEditor(article: Article | null, parentModal: HTMLElement) {
    const isEdit = article !== null;
    const initialAiSummary = article ? article.aiSummary.join('\n') : '';
    const initialContent = article ? article.content : `<p class="lead"><strong>JAKARTA, ByteIndonesia</strong> — Tuliskan paragraf pembuka berita di sini.</p>\n<p>Paragraf penjelasan detail isu berita...</p>`;
    const user = AuthService.getCurrentUser();

    // Fullscreen Workspace Element
    const editorPage = document.createElement('div');
    editorPage.id = 'fullscreen-editor-workspace';
    editorPage.style.position = 'fixed';
    editorPage.style.inset = '0';
    editorPage.style.zIndex = '3000';
    editorPage.style.background = 'var(--bg-primary)';
    editorPage.style.color = 'var(--text-primary)';
    editorPage.style.display = 'flex';
    editorPage.style.flexDirection = 'column';
    editorPage.style.overflow = 'hidden';

    editorPage.innerHTML = `
      <!-- Professional Editor Header Bar -->
      <header style="height: 4.25rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); padding: 0 1.75rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button id="editor-back-btn" style="padding: 0.45rem 0.9rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-full); color: var(--text-primary); font-weight: 700; font-size: 0.825rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            ← Kembali ke Dasbor CMS
          </button>
          <div style="height: 1.5rem; width: 1px; background: var(--border-color);"></div>
          <div>
            <h2 style="font-size: 1.1rem; font-weight: 800;">${isEdit ? 'Sunting Naskah Berita' : 'Studio Penulisan Berita Pro'}</h2>
            <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: var(--font-mono);">ByteIndonesia Manuscript Engine — ${user?.fullName || 'Rijal Umami'}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" id="btn-generate-ai-summary" style="padding: 0.55rem 1.1rem; background: var(--gradient-ai); border: 1px solid var(--border-active); color: var(--accent-cyan); font-weight: 800; border-radius: var(--radius-full); font-size: 0.825rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            Ringkasan AI
          </button>
          <button type="submit" form="editor-fullscreen-form" style="padding: 0.6rem 1.6rem; background: var(--gradient-brand); color: #000; font-weight: 800; border-radius: var(--radius-full); font-size: 0.875rem; box-shadow: var(--shadow-glow); cursor: pointer;">
            ${isEdit ? 'Simpan Perubahan' : 'Terbitkan Berita'}
          </button>
        </div>
      </header>

      <!-- Fullscreen Body Layout Grid (Content Main vs Metadata Sidebar) -->
      <form id="editor-fullscreen-form" style="flex: 1; display: grid; grid-template-columns: 1fr 340px; overflow: hidden;">
        <!-- Left Main Area: Title, Toolbar, & Visual WYSIWYG Canvas -->
        <div style="padding: 2rem 3rem; overflow-y: auto; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <input type="text" id="edit-title" required value="${article ? article.title : ''}" placeholder="Masukkan Judul Berita Utama..." style="width: 100%; padding: 0.75rem 0; background: transparent; border: none; border-bottom: 2px solid var(--border-color); color: var(--text-primary); font-size: 1.85rem; font-weight: 800; font-family: var(--font-main);" />
          </div>

          <div>
            <input type="text" id="edit-subtitle" required value="${article ? article.subtitle : ''}" placeholder="Sub-judul / Ringkasan Pengantar Berita (1-2 kalimat)..." style="width: 100%; padding: 0.6rem 0; background: transparent; border: none; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); font-size: 1.1rem;" />
          </div>

          <!-- Professional Editorial Formatting Toolbar -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.5rem 0.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);">
            <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
              <button type="button" class="btn-tb" data-cmd="bold" title="Tebal (Bold) <b>"><b>B</b></button>
              <button type="button" class="btn-tb" data-cmd="italic" title="Miring (Italic) <i>"><i>I</i></button>
              <button type="button" class="btn-tb" data-cmd="underline" title="Garis Bawah <u>"><u>U</u></button>
              <div style="width: 1px; height: 1.2rem; background: var(--border-color); margin: 0 0.2rem;"></div>
              
              <button type="button" class="btn-tb-tag" data-tag="h2" title="Sub-Judul Utama (H2)">H2</button>
              <button type="button" class="btn-tb-tag" data-tag="h3" title="Sub-Judul (H3)">H3</button>
              <button type="button" class="btn-tb-tag" data-tag="lead" title="Paragraf Lead">Lead</button>
              <button type="button" class="btn-tb-tag" data-tag="blockquote" title="Blok Kutipan (Quote)">Kutipan</button>
              <div style="width: 1px; height: 1.2rem; background: var(--border-color); margin: 0 0.2rem;"></div>

              <button type="button" class="btn-tb" data-cmd="insertUnorderedList" title="Daftar Bullet (List)">Daftar Bullet</button>
              <button type="button" class="btn-tb" data-cmd="insertOrderedList" title="Daftar Angka">Daftar Angka</button>
              <button type="button" class="btn-tb" id="btn-tb-link" title="Sisipkan Tautan (Link)">Link</button>
              <button type="button" class="btn-tb" id="btn-tb-img" title="Sisipkan Gambar">Gambar</button>
            </div>

            <!-- View Switcher Toggle: Visual WYSIWYG vs Code HTML Source -->
            <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-tertiary); padding: 0.15rem 0.3rem; border-radius: var(--radius-full); border: 1px solid var(--border-color);">
              <button type="button" id="btn-mode-visual" class="btn-mode-toggle active" style="padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; color: #000; background: var(--accent-cyan); border: none; cursor: pointer;">Visual WYSIWYG</button>
              <button type="button" id="btn-mode-code" class="btn-mode-toggle" style="padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; color: var(--text-muted); background: transparent; border: none; cursor: pointer;">HTML Code</button>
            </div>
          </div>

          <!-- Manuscript Canvas Container -->
          <div style="flex: 1; min-height: 380px; display: flex; flex-direction: column; position: relative;">
            <!-- Mode 1: Visual WYSIWYG Rich Editor Container -->
            <div id="wysiwyg-editor-canvas" contenteditable="true" style="flex: 1; min-height: 380px; padding: 1.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-main); font-size: 1.05rem; line-height: 1.7; outline: none; overflow-y: auto;">
              ${initialContent}
            </div>

            <!-- Mode 2: Hidden Raw HTML Textarea Source -->
            <textarea id="edit-content" name="content" style="display: none; flex: 1; min-height: 380px; padding: 1.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.5; resize: vertical;">${initialContent}</textarea>
          </div>

          <!-- Real-Time Word & Reading Time Analytics Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); background: var(--bg-secondary); padding: 0.65rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display: flex; gap: 1.25rem; font-family: var(--font-mono);">
              <span><strong id="cnt-words" style="color: var(--accent-cyan);">0</strong> Kata</span>
              <span><strong id="cnt-chars" style="color: var(--accent-violet);">0</strong> Karakter</span>
              <span>Estimasi Waktu Baca: <strong id="cnt-readtime" style="color: var(--accent-emerald);">1m</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--accent-emerald);">
              <span>Auto-saved ke memori lokal</span>
            </div>
          </div>
        </div>

        <!-- Right Sidebar Area: Metadata & Settings -->
        <div style="background: var(--bg-secondary); padding: 2rem 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem;">
          <h3 style="font-size: 0.95rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-cyan); border-bottom: 1px solid var(--border-color); padding-bottom: 0.6rem;">Atribut Berita</h3>

          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-secondary);">Kategori Berita</label>
            <select id="edit-category" style="width: 100%; padding: 0.65rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.875rem; font-weight: 600;">
              ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                <option value="${c.id}" ${article && article.category === c.id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-secondary);">Tags Berita (Pisahkan Koma)</label>
            <input type="text" id="edit-tags" value="${article ? article.tags.join(', ') : 'Teknologi, Indonesia, AI'}" style="width: 100%; padding: 0.6rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.85rem;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-secondary);">URL Sampul Berita (HD Image)</label>
            <input type="url" id="edit-image-url" required value="${article ? article.imageUrl : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'}" style="width: 100%; padding: 0.6rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.85rem;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-secondary);">Nama Penulis / Jurnalis</label>
            <input type="text" id="edit-author-name" required value="${article ? article.author.name : (user?.fullName || 'Rijal Umami')}" style="width: 100%; padding: 0.6rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.85rem;" />
          </div>

          <!-- AI Summary Sidebar Box -->
          <div style="background: var(--gradient-ai); border: 1px solid var(--border-active); padding: 1rem; border-radius: var(--radius-md); margin-top: 0.5rem;">
            <label style="display: block; font-weight: 800; font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.4rem;">Ringkasan Poin AI</label>
            <textarea id="edit-ai-summary" rows="4" placeholder="Tuliskan 3 poin ringkasan utama (1 baris per poin)..." style="width: 100%; padding: 0.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); font-size: 0.8rem; resize: vertical;">${initialAiSummary}</textarea>
          </div>
        </div>
      </form>
    `;

    document.body.appendChild(editorPage);
    document.body.style.overflow = 'hidden';

    // Elements
    const wysiwygCanvas = editorPage.querySelector('#wysiwyg-editor-canvas') as HTMLDivElement;
    const rawTextarea = editorPage.querySelector('#edit-content') as HTMLTextAreaElement;
    const cntWords = editorPage.querySelector('#cnt-words') as HTMLElement;
    const cntChars = editorPage.querySelector('#cnt-chars') as HTMLElement;
    const cntReadtime = editorPage.querySelector('#cnt-readtime') as HTMLElement;

    // Analytics Counter Updater
    const updateAnalytics = () => {
      const text = wysiwygCanvas.innerText || wysiwygCanvas.textContent || '';
      const charCount = text.length;
      const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      const readTime = Math.max(1, Math.ceil(wordCount / 180));

      if (cntWords) cntWords.textContent = wordCount.toLocaleString('id-ID');
      if (cntChars) cntChars.textContent = charCount.toLocaleString('id-ID');
      if (cntReadtime) cntReadtime.textContent = `${readTime}m`;
    };

    updateAnalytics();

    // Sync Content WYSIWYG <-> Textarea
    wysiwygCanvas.addEventListener('input', () => {
      rawTextarea.value = wysiwygCanvas.innerHTML;
      updateAnalytics();
    });

    rawTextarea.addEventListener('input', () => {
      wysiwygCanvas.innerHTML = rawTextarea.value;
      updateAnalytics();
    });

    // Formatting Toolbar Handlers (document.execCommand & Custom Tags)
    editorPage.querySelectorAll('.btn-tb').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          document.execCommand(cmd, false, undefined);
          rawTextarea.value = wysiwygCanvas.innerHTML;
          updateAnalytics();
        }
      });
    });

    // Custom Tag Handlers (H2, H3, Lead, Quote)
    editorPage.querySelectorAll('.btn-tb-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const selectedText = selection.toString() || 'Teks Sub-Judul Berita';
        let htmlToInsert = '';

        if (tag === 'h2') htmlToInsert = `<h2>${selectedText}</h2>`;
        else if (tag === 'h3') htmlToInsert = `<h3>${selectedText}</h3>`;
        else if (tag === 'lead') htmlToInsert = `<p class="lead">${selectedText}</p>`;
        else if (tag === 'blockquote') htmlToInsert = `<blockquote>"${selectedText}"<cite>— Sumber / Kutipan Redaksi</cite></blockquote>`;

        document.execCommand('insertHTML', false, htmlToInsert);
        rawTextarea.value = wysiwygCanvas.innerHTML;
        updateAnalytics();
      });
    });

    // Insert Link Button
    editorPage.querySelector('#btn-tb-link')?.addEventListener('click', () => {
      const url = prompt('Masukkan URL Tautan:', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
        rawTextarea.value = wysiwygCanvas.innerHTML;
      }
    });

    // Insert Image Button
    editorPage.querySelector('#btn-tb-img')?.addEventListener('click', () => {
      const url = prompt('Masukkan URL Gambar HD:', 'https://images.unsplash.com/');
      if (url) {
        const imgHTML = `<img src="${url}" alt="Gambar Berita" style="width:100%; border-radius:12px; margin:1rem 0;" />`;
        document.execCommand('insertHTML', false, imgHTML);
        rawTextarea.value = wysiwygCanvas.innerHTML;
      }
    });

    // Mode Toggle Handlers (Visual vs Code)
    const btnVisual = editorPage.querySelector('#btn-mode-visual') as HTMLButtonElement;
    const btnCode = editorPage.querySelector('#btn-mode-code') as HTMLButtonElement;

    btnVisual?.addEventListener('click', () => {
      wysiwygCanvas.style.display = 'block';
      rawTextarea.style.display = 'none';
      wysiwygCanvas.innerHTML = rawTextarea.value;
      btnVisual.style.background = 'var(--accent-cyan)';
      btnVisual.style.color = '#000';
      btnCode.style.background = 'transparent';
      btnCode.style.color = 'var(--text-muted)';
    });

    btnCode?.addEventListener('click', () => {
      wysiwygCanvas.style.display = 'none';
      rawTextarea.style.display = 'block';
      rawTextarea.value = wysiwygCanvas.innerHTML;
      btnCode.style.background = 'var(--accent-cyan)';
      btnCode.style.color = '#000';
      btnVisual.style.background = 'transparent';
      btnVisual.style.color = 'var(--text-muted)';
    });

    // Back to CMS Handler
    const closeEditor = () => {
      editorPage.remove();
      document.body.style.overflow = '';
    };

    editorPage.querySelector('#editor-back-btn')?.addEventListener('click', closeEditor);

    // AI Summary Generator Button
    editorPage.querySelector('#btn-generate-ai-summary')?.addEventListener('click', () => {
      const titleInput = (editorPage.querySelector('#edit-title') as HTMLInputElement).value;
      const subtitleInput = (editorPage.querySelector('#edit-subtitle') as HTMLInputElement).value;
      const summaryArea = editorPage.querySelector('#edit-ai-summary') as HTMLTextAreaElement;

      if (!titleInput) {
        Toast.show('Harap isi Judul Berita Utama terlebih dahulu.', 'warning');
        return;
      }

      summaryArea.value = [
        `Redaksi memverifikasi perkembangan utama seputar "${titleInput}".`,
        `Poin krusial: ${subtitleInput || 'Implementasi teknologi tingkat nasional siap diakselerasi.'}`,
        `Dampak industri: Memperkuat efisiensi digital dan daya saing ekosistem teknologi Indonesia.`
      ].join('\n');
      Toast.show('Ringkasan AI berhasil digenerasi!');
    });

    // Submit Fullscreen Form Handler
    const form = editorPage.querySelector('#editor-fullscreen-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = (editorPage.querySelector('#edit-title') as HTMLInputElement).value;
      const subtitle = (editorPage.querySelector('#edit-subtitle') as HTMLInputElement).value;
      const category = (editorPage.querySelector('#edit-category') as HTMLSelectElement).value as CategoryId;
      const tagsStr = (editorPage.querySelector('#edit-tags') as HTMLInputElement).value;
      const imageUrl = (editorPage.querySelector('#edit-image-url') as HTMLInputElement).value;
      const authorName = (editorPage.querySelector('#edit-author-name') as HTMLInputElement).value;
      const aiSummaryText = (editorPage.querySelector('#edit-ai-summary') as HTMLTextAreaElement).value;
      const content = wysiwygCanvas.innerHTML;

      const aiSummary = aiSummaryText.split('\n').filter(line => line.trim().length > 0);
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

      if (isEdit && article) {
        article.title = title;
        article.subtitle = subtitle;
        article.category = category;
        article.tags = tags;
        article.imageUrl = imageUrl;
        article.author.name = authorName;
        article.aiSummary = aiSummary;
        article.content = content;
        Toast.show('Perubahan naskah berita berhasil disimpan.');
      } else {
        const newArt: Article = {
          id: `art-${Date.now().toString().slice(-4)}`,
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          subtitle,
          category,
          tags,
          author: {
            name: authorName,
            role: 'Jurnalis Redaksi',
            avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
          },
          publishedAt: new Date().toISOString(),
          readTimeMinutes: Math.max(3, Math.ceil(content.length / 500)),
          imageUrl,
          isFeatured: false,
          isTrending: false,
          isBreaking: false,
          viewsCount: 150,
          likesCount: 12,
          aiSummary,
          content
        };
        this.articles.unshift(newArt);
        Toast.show('Berita baru berhasil diterbitkan di ByteIndonesia!');
      }

      this.onArticlesChange();
      this.refreshTable(parentModal);
      closeEditor();
    });
  }
}
