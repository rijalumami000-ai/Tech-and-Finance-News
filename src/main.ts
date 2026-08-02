import './styles/main.css';
import { ARTICLES, CATEGORIES, TECH_INDEXES } from './data/mockNews';
import type { Article, CategoryId, UserPreferences, TechIndexItem } from './types/news';
import { AdminCMS } from './components/AdminCMS';
import { ByteAIChatbot } from './components/ByteAIChatbot';
import { ApiService } from './services/apiService';
import { TechGlossary } from './components/TechGlossary';
import { SpecsComparator } from './components/SpecsComparator';
import { CompanyModal, type CompanyPageType } from './components/CompanyModal';
import { Toast } from './utils/toast';
import { TranslationService, UI_TRANSLATIONS } from './utils/translationService';
import { TextToSpeechService } from './utils/textToSpeech';
import Lenis from 'lenis';

// English Names for Categories
const CATEGORIES_EN: Record<string, string> = {
  'all': 'All News',
  'ai': 'Artificial Intelligence',
  'gadget': 'Gadget & Innovation',
  'cybersecurity': 'Cybersecurity',
  'startup': 'Startup & Business',
  'policy': 'Digital Policy',
  'telecom': 'Telecommunications',
  'developer': 'Developer Collective'
};

// Default State
let currentCategory: CategoryId = 'all';
let searchQuery = '';
let liveTechIndexes: TechIndexItem[] = [...TECH_INDEXES];
let currentArticleSpeechText = '';

const preferences: UserPreferences = {
  theme: (localStorage.getItem('byte_theme') as 'dark' | 'light') || 'dark',
  savedArticleIds: JSON.parse(localStorage.getItem('byte_bookmarks') || '[]'),
  likedArticleIds: JSON.parse(localStorage.getItem('byte_likes') || '[]'),
  fontSize: 'normal',
  language: (localStorage.getItem('byte_lang') as 'id' | 'en') || 'id'
};

// Helper: get current language label
function t(key: keyof typeof UI_TRANSLATIONS['id']): string {
  return TranslationService.getLabel(key, preferences.language);
}

// DOM Elements
const appElement = document.documentElement;
const techTickerList = document.getElementById('tech-ticker-list');
const categoryContainer = document.getElementById('category-container');
const breakingNewsTitle = document.getElementById('breaking-news-title');
const featuredArticleContainer = document.getElementById('featured-article-container');
const trendingArticlesContainer = document.getElementById('trending-articles-container');
const articlesGrid = document.getElementById('articles-grid');
const feedTitle = document.getElementById('feed-title');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const bookmarkCountBadge = document.getElementById('bookmark-count');
const readerModal = document.getElementById('reader-modal');
const modalReaderContent = document.getElementById('modal-reader-content');
const modalCloseBtn = document.getElementById('modal-close-btn');
const bookmarksBtn = document.getElementById('bookmarks-btn');
const bookmarksModal = document.getElementById('bookmarks-modal');
const bookmarksCloseBtn = document.getElementById('bookmarks-close-btn');
const bookmarksListContainer = document.getElementById('bookmarks-list-container');
const logoBtn = document.getElementById('logo-btn');
const newsletterForm = document.getElementById('newsletter-form');
const adminCmsBtn = document.getElementById('admin-cms-btn');
const adminCmsModal = document.getElementById('admin-cms-modal');
const adminCmsContainer = document.getElementById('admin-cms-container');

// Company Modal Elements
const companyModal = document.getElementById('company-modal');
const companyModalBody = document.getElementById('company-modal-content-body');

// New Modals for Glossary & Specs
const glossaryBtn = document.getElementById('glossary-btn');
const glossaryModal = document.getElementById('glossary-modal');
const glossaryCloseBtn = document.getElementById('glossary-close-btn');
const glossaryBody = document.getElementById('glossary-content-body');

const specsBtn = document.getElementById('specs-btn');
const specsModal = document.getElementById('specs-modal');
const specsCloseBtn = document.getElementById('specs-close-btn');
const specsBody = document.getElementById('specs-content-body');

// Instances
const chatbot = new ByteAIChatbot();
const specsComparator = new SpecsComparator();
const adminCMS = new AdminCMS(() => {
  renderBreakingBanner();
  renderHeroSection();
  renderFeed();
});

// Initialize Application
async function init() {
  // Initialize Lenis Smooth Scroll for Main Page
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true
  });

  // Initialize Lenis Smooth Scroll for Modal Overlays
  const modalLenisInstances: Lenis[] = [];
  const modalConfigs = [
    { wrapperId: 'reader-modal', contentId: 'reader-modal-container' },
    { wrapperId: 'company-modal', contentId: 'company-modal-container' },
    { wrapperId: 'bookmarks-modal', contentSelector: '#bookmarks-modal .modal-container' },
    { wrapperId: 'glossary-modal', contentId: 'glossary-modal-container' },
    { wrapperId: 'specs-modal', contentId: 'specs-modal-container' },
    { wrapperId: 'admin-cms-modal', contentId: 'admin-cms-container' }
  ];

  modalConfigs.forEach(cfg => {
    const wrap = document.getElementById(cfg.wrapperId);
    const content = cfg.contentId ? document.getElementById(cfg.contentId) : (cfg.contentSelector ? document.querySelector(cfg.contentSelector) : null);
    if (wrap && content) {
      const ml = new Lenis({
        wrapper: wrap,
        content: content as HTMLElement,
        lerp: 0.08,
        smoothWheel: true
      });
      modalLenisInstances.push(ml);
    }
  });

  const raf = (time: number) => {
    lenis.raf(time);
    modalLenisInstances.forEach(ml => ml.raf(time));
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  applyTheme(preferences.theme);
  updateBookmarkBadge();

  // Mount Floating AI Chatbot Widget
  const chatbotWrapper = document.createElement('div');
  chatbotWrapper.id = 'chatbot-mount-point';
  chatbotWrapper.innerHTML = chatbot.renderChatbotHTML();
  document.body.appendChild(chatbotWrapper);
  chatbot.bindEvents(chatbotWrapper);
  
  // Async Health check & load live financial indexes
  const isBackendLive = await ApiService.checkBackendHealth();
  if (isBackendLive) {
    liveTechIndexes = await ApiService.getTechIndexes();
  }

  renderTechIndexes();
  renderCategories();
  renderBreakingBanner();
  renderHeroSection();
  renderFeed();

  setupEventListeners();
  handleHashRouting();
  setupCookieConsent();
  updateFooterLabels();
}

// Client-Side Hash Router (#admin, #article/art-001, #category/ai)
function handleHashRouting() {
  const hash = window.location.hash;

  if (hash.startsWith('#admin')) {
    openAdminCMSModal();
  } else if (hash.startsWith('#article/')) {
    const artId = hash.replace('#article/', '');
    openArticleReader(artId);
  } else if (hash.startsWith('#category/')) {
    const catId = hash.replace('#category/', '') as CategoryId;
    currentCategory = catId;
    renderCategories();
    renderFeed();
  } else {
    // Default home
    if (adminCmsModal) adminCmsModal.classList.remove('open');
    if (readerModal) readerModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Apply Theme
function applyTheme(theme: 'dark' | 'light') {
  preferences.theme = theme;
  appElement.setAttribute('data-theme', theme);
  localStorage.setItem('byte_theme', theme);

  const themeSvgIcon = document.getElementById('theme-svg-icon');
  if (themeSvgIcon) {
    if (theme === 'dark') {
      themeSvgIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
    } else {
      themeSvgIcon.innerHTML = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
    }
  }
}

// Update Bookmark Badge
function updateBookmarkBadge() {
  if (bookmarkCountBadge) {
    bookmarkCountBadge.textContent = preferences.savedArticleIds.length.toString();
  }
}

// Render Tech Indexes Ticker
function renderTechIndexes() {
  if (!techTickerList) return;
  techTickerList.innerHTML = liveTechIndexes.map((item, idx) => `
    <div class="ticker-item" data-ticker-idx="${idx}" role="button" tabindex="0" title="Klik untuk lihat grafik ${item.name}">
      <span class="ticker-symbol">${item.symbol}</span>
      <span class="ticker-val">${item.value}</span>
      <span class="ticker-change ${item.isPositive ? 'up' : 'down'}">${item.change}</span>
    </div>
  `).join('');

  // Add click handlers for chart popup
  techTickerList.addEventListener('click', (e) => {
    const tickerEl = (e.target as HTMLElement).closest('.ticker-item') as HTMLElement;
    if (!tickerEl) return;
    const idx = parseInt(tickerEl.dataset.tickerIdx || '0', 10);
    showTickerChart(liveTechIndexes[idx], tickerEl);
  });
}

// Generate SVG line chart from historical data
function generateSVGChart(item: TechIndexItem): string {
  const data = item.historicalData;
  const W = 380, H = 160, padX = 42, padY = 20;
  const chartW = W - padX * 2, chartH = H - padY * 2;

  const values = data.map(d => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  // Build polyline points
  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((d.value - minV) / range) * chartH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  // Gradient fill area
  const areaPoints = [
    `${padX},${padY + chartH}`,
    ...points,
    `${(padX + chartW).toFixed(1)},${padY + chartH}`
  ].join(' ');

  const lineColor = item.isPositive ? '#10b981' : '#f43f5e';
  const gradId = `grad-${item.symbol.replace(/[^a-zA-Z]/g, '')}`;

  // Y-axis labels (5 steps)
  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const val = minV + (range * i) / 4;
    const y = padY + chartH - (i / 4) * chartH;
    const label = val >= 1000 ? val.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : val.toFixed(1);
    return `<text x="${padX - 6}" y="${y + 3}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)">${label}</text>
      <line x1="${padX}" y1="${y}" x2="${padX + chartW}" y2="${y}" stroke="var(--border-subtle)" stroke-width="0.5" stroke-dasharray="3,3"/>`;
  }).join('');

  // X-axis labels (every 6 hours)
  const xLabels = [0, 6, 12, 18, 23].map(i => {
    const x = padX + (i / (data.length - 1)) * chartW;
    return `<text x="${x}" y="${padY + chartH + 14}" text-anchor="middle" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)">${data[i].time}</text>`;
  }).join('');

  // Hover dots
  const dots = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((d.value - minV) / range) * chartH;
    const label = d.value >= 1000 ? d.value.toLocaleString('id-ID') : d.value.toFixed(2);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${lineColor}" opacity="0" class="chart-dot">
      <title>${d.time} — ${label}</title>
    </circle>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H + 18}" xmlns="http://www.w3.org/2000/svg" class="ticker-chart-svg">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${yLabels}
    ${xLabels}
    <polygon points="${areaPoints}" fill="url(#${gradId})"/>
    <polyline points="${points.join(' ')}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chart-line"/>
    ${dots}
  </svg>`;
}

// Show ticker chart popup
function showTickerChart(item: TechIndexItem, anchorEl: HTMLElement) {
  // Remove existing popup
  document.querySelector('.ticker-chart-popup')?.remove();

  const values = item.historicalData.map(d => d.value);
  const openVal = values[0];
  const closeVal = values[values.length - 1];
  const highVal = Math.max(...values);
  const lowVal = Math.min(...values);
  const fmt = (v: number) => v >= 1000 ? v.toLocaleString('id-ID') : v.toFixed(2);

  const isLive = ApiService.isBackendAvailable && item.symbol !== 'STARTUP-RI';
  const footerText = isLive ? t('chartFooter') : t('chartFooterFallback');

  const popup = document.createElement('div');
  popup.className = 'ticker-chart-popup';
  popup.innerHTML = `
    <div class="ticker-chart-header">
      <div class="ticker-chart-title">
        <span class="ticker-chart-symbol">${item.symbol}</span>
        <span class="ticker-chart-name">${item.name}</span>
      </div>
      <div class="ticker-chart-meta">
        <span class="ticker-chart-value">${item.value}</span>
        <span class="ticker-chart-change ${item.isPositive ? 'up' : 'down'}">${item.change}</span>
      </div>
      <button class="ticker-chart-close" aria-label="Tutup">&times;</button>
    </div>
    <div class="ticker-chart-body">
      ${generateSVGChart(item)}
    </div>
    <div class="ticker-chart-stats">
      <div class="stat-item"><span class="stat-label">Open</span><span class="stat-val">${fmt(openVal)}</span></div>
      <div class="stat-item"><span class="stat-label">High</span><span class="stat-val up">${fmt(highVal)}</span></div>
      <div class="stat-item"><span class="stat-label">Low</span><span class="stat-val down">${fmt(lowVal)}</span></div>
      <div class="stat-item"><span class="stat-label">Close</span><span class="stat-val">${fmt(closeVal)}</span></div>
    </div>
    <div class="ticker-chart-footer">
      <span>${footerText}</span>
    </div>
  `;

  // Position relative to the top-bar
  document.body.appendChild(popup);

  // Close handlers
  const closeBtn = popup.querySelector('.ticker-chart-close')!;
  closeBtn.addEventListener('click', () => popup.remove());

  const onClickOutside = (e: MouseEvent) => {
    if (!popup.contains(e.target as Node) && !anchorEl.contains(e.target as Node)) {
      popup.remove();
      document.removeEventListener('click', onClickOutside);
    }
  };
  // Delay adding outside listener to avoid immediate close
  setTimeout(() => document.addEventListener('click', onClickOutside), 50);

  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      popup.remove();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);

  // Animate in
  requestAnimationFrame(() => popup.classList.add('show'));
}

// Render Categories Bar
function renderCategories() {
  if (!categoryContainer) return;
  const lang = preferences.language;
  categoryContainer.innerHTML = CATEGORIES.map(cat => `
    <button class="cat-pill ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
      <span>${lang === 'en' ? (CATEGORIES_EN[cat.id] || cat.name) : cat.name}</span>
    </button>
  `).join('');

  categoryContainer.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const catId = target.getAttribute('data-category') as CategoryId;
      if (catId) {
        currentCategory = catId;
        window.location.hash = `category/${catId}`;
        renderCategories();
        renderFeed();
      }
    });
  });
}

// Render Breaking News Banner
function renderBreakingBanner() {
  if (!breakingNewsTitle) return;
  const breakingArticle = ARTICLES.find(a => a.isBreaking) || ARTICLES[0];
  breakingNewsTitle.textContent = breakingArticle.title;
  breakingNewsTitle.onclick = () => {
    window.location.hash = `article/${breakingArticle.id}`;
    openArticleReader(breakingArticle.id);
  };
}

// Render Hero Section (Featured + Trending)
function renderHeroSection() {
  const featuredArticle = ARTICLES.find(a => a.isFeatured) || ARTICLES[0];
  
  if (featuredArticleContainer) {
    featuredArticleContainer.innerHTML = `
      <article class="hero-card" data-article-id="${featuredArticle.id}">
        <div class="hero-img-wrapper">
          <img src="${featuredArticle.imageUrl}" alt="${featuredArticle.title}" class="hero-img" loading="eager" />
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
          <div class="badge-group">
            <span class="tag-badge badge-ai">${preferences.language === 'en' ? 'HEADLINE' : 'BERITA UTAMA'}</span>
            <span class="tag-badge">${featuredArticle.category.toUpperCase()}</span>
          </div>
          <h1 class="hero-title">${featuredArticle.title}</h1>
          <p class="hero-subtitle">${featuredArticle.subtitle}</p>
          <div class="meta-row">
            <div class="meta-author">
              <img src="${featuredArticle.author.avatar}" alt="${featuredArticle.author.name}" class="author-avatar" />
              <span>${featuredArticle.author.name}</span>
            </div>
            <span>•</span>
            <span>${formatDate(featuredArticle.publishedAt)}</span>
            <span>•</span>
            <span>${t('readTime').replace('{min}', String(featuredArticle.readTimeMinutes))}</span>
          </div>
        </div>
      </article>
    `;

    featuredArticleContainer.querySelector('.hero-card')?.addEventListener('click', () => {
      window.location.hash = `article/${featuredArticle.id}`;
      openArticleReader(featuredArticle.id);
    });
  }

  // Render Sidebar Trending
  if (trendingArticlesContainer) {
    const trendingArticles = ARTICLES.filter(a => a.isTrending && a.id !== featuredArticle.id).slice(0, 4);
    trendingArticlesContainer.innerHTML = trendingArticles.map((art, idx) => `
      <div class="trending-item" data-article-id="${art.id}">
        <div class="trending-num">0${idx + 1}</div>
        <div class="trending-info">
          <h3 class="trending-item-title">${art.title}</h3>
          <div class="trending-meta">
            <span>${art.author.name}</span>
            <span>•</span>
            <span>${(art.viewsCount / 1000).toFixed(1)}k ${preferences.language === 'en' ? 'Readers' : 'Pembaca'}</span>
          </div>
        </div>
      </div>
    `).join('');

    trendingArticlesContainer.querySelectorAll('.trending-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-article-id');
        if (id) {
          window.location.hash = `article/${id}`;
          openArticleReader(id);
        }
      });
    });
  }
}

// Render Articles Grid Feed
function renderFeed() {
  if (!articlesGrid) return;

  // Filter Articles
  const filtered = ARTICLES.filter(art => {
    const matchesCategory = currentCategory === 'all' || art.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Update Title & Count
  if (feedTitle) {
    const categoryObj = CATEGORIES.find(c => c.id === currentCategory);
    if (preferences.language === 'en') {
      feedTitle.innerHTML = categoryObj ? (CATEGORIES_EN[categoryObj.id] || categoryObj.name) : 'Latest Tech News';
    } else {
      feedTitle.innerHTML = categoryObj ? categoryObj.name : 'Berita Terbaru';
    }
  }

  if (resultsCount) {
    resultsCount.textContent = preferences.language === 'en'
      ? `Showing ${filtered.length} articles`
      : `Menampilkan ${filtered.length} artikel`;
  }

  if (filtered.length === 0) {
    articlesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${preferences.language === 'en' ? 'No Articles Found' : 'Tidak Ada Berita Ditemukan'}</h3>
        <p style="margin-top: 0.5rem; font-size:0.9rem;">${preferences.language === 'en' ? 'Try a different search keyword or category.' : 'Coba gunakan kata kunci pencarian lain atau pilih kategori berbeda.'}</p>
      </div>
    `;
    return;
  }

  articlesGrid.innerHTML = filtered.map(art => {
    const isBookmarked = preferences.savedArticleIds.includes(art.id);

    return `
      <article class="article-card" data-article-id="${art.id}">
        <div class="card-img-wrap">
          <img src="${art.imageUrl}" alt="${art.title}" class="card-img" loading="lazy" />
          <span class="card-category-badge">${art.category}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${art.title}</h3>
          <p class="card-excerpt">${art.subtitle}</p>
          <div class="card-footer">
            <div class="card-author-info">
              <img src="${art.author.avatar}" alt="${art.author.name}" style="width: 1.3rem; height: 1.3rem; border-radius: 50%; object-fit: cover;" />
              <span>${art.author.name}</span>
            </div>
            <div class="card-actions">
              <span>${art.readTimeMinutes}m</span>
              <button class="btn-bookmark ${isBookmarked ? 'active' : ''}" data-bookmark-id="${art.id}" title="${t('bookmarkBtn')}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Add click handlers
  articlesGrid.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.btn-bookmark')) return;

      const artId = card.getAttribute('data-article-id');
      if (artId) {
        window.location.hash = `article/${artId}`;
        openArticleReader(artId);
      }
    });
  });

  articlesGrid.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const artId = (btn as HTMLElement).getAttribute('data-bookmark-id');
      if (artId) toggleBookmark(artId);
    });
  });
}

// Open Article Reader Modal
function openArticleReader(articleId: string) {
  const article = ARTICLES.find(a => a.id === articleId);
  if (!article || !readerModal || !modalReaderContent) return;

  const isLiked = preferences.likedArticleIds.includes(article.id);
  const isBookmarked = preferences.savedArticleIds.includes(article.id);

  // Apply Auto Tech Glossary Highlights
  const highlightedContent = TechGlossary.highlightTermsInHTML(article.content);

  // Prepare text & duration for Text-to-Speech Engine
  const plainBody = TextToSpeechService.extractPlainTextFromHTML(highlightedContent);
  const summaryText = article.aiSummary.join('. ');
  currentArticleSpeechText = `${article.title}. ${article.subtitle}. ${summaryText}. ${plainBody}`;
  const totalWords = currentArticleSpeechText.split(/\s+/).length;
  const initialDurationStr = TextToSpeechService.formatTime(Math.ceil(totalWords / 2.2));

  modalReaderContent.innerHTML = `
    <div class="reader-header">
      <div class="badge-group">
        <span class="tag-badge">${article.category.toUpperCase()}</span>
        ${article.tags.map(t => `<span class="tag-badge" style="background:var(--bg-tertiary); color:var(--text-secondary); border-color:var(--border-color);">#${t}</span>`).join('')}
      </div>
      <h1 class="reader-title" id="reader-article-title">${article.title}</h1>
      <p class="reader-subtitle" id="reader-article-subtitle">${article.subtitle}</p>

      <div class="author-meta-block">
        <div class="author-detail">
          <img src="${article.author.avatar}" alt="${article.author.name}" class="author-lg-avatar" />
          <div>
            <div class="author-name-text">${article.author.name}</div>
            <div class="author-role-text">${article.author.role}</div>
          </div>
        </div>
        <div style="font-size: 0.825rem; color: var(--text-muted); text-align: right;">
          <div>${preferences.language === 'en' ? 'Date' : 'Tanggal'}: ${formatDate(article.publishedAt)}</div>
          <div>${preferences.language === 'en' ? 'Total' : 'Total'}: ${(article.viewsCount).toLocaleString('id-ID')} ${preferences.language === 'en' ? 'Readers' : 'Pembaca'}</div>
        </div>
      </div>
    </div>

    <!-- Executive AI Summary Box -->
    <div class="ai-summary-box">
      <div class="ai-summary-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
        ${t('aiSummaryHeader')}
      </div>
      <ul class="ai-summary-list" id="reader-ai-summary-list">
        ${article.aiSummary.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>

    <!-- Audio Player -->
    <div style="background:var(--bg-tertiary); padding:0.85rem 1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem;">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <button id="btn-audio-play" style="width:2.4rem; height:2.4rem; border-radius:50%; background:var(--accent-cyan); color:#000; font-weight:bold; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; transition:all 0.2s ease;" title="Play / Pause Audio">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button id="btn-audio-stop" style="width:2.0rem; height:2.0rem; border-radius:50%; background:rgba(255,255,255,0.08); color:var(--text-secondary); display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; transition:all 0.2s ease;" title="Stop Audio">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
        </button>
        <div>
          <div style="font-weight:700; font-size:0.85rem;">${t('audioNarrativeHeader')}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);" id="audio-status-text">${t('audioNarrativeSub')}</div>
        </div>
      </div>
      <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);" id="audio-timer-text">00:00 / ${initialDurationStr}</span>
    </div>

    <img src="${article.imageUrl}" alt="${article.title}" class="reader-hero-image" />
    ${article.imageCaption ? `<div class="image-caption">${article.imageCaption}</div>` : ''}

    <div class="article-rich-content ${preferences.fontSize === 'large' ? 'size-large' : preferences.fontSize === 'xlarge' ? 'size-xlarge' : ''}" id="article-content-wrapper">
      ${highlightedContent}
    </div>

    <div class="reader-action-bar">
      <div style="display:flex; gap:0.75rem;">
        <button class="btn-action ${isLiked ? 'liked' : ''}" id="btn-like-article">
          <span id="like-count">${article.likesCount + (isLiked ? 1 : 0)} ${t('likeBtn')}</span>
        </button>
        <button class="btn-action" id="btn-bookmark-article">
          <span>${isBookmarked ? t('bookmarkedBtn') : t('bookmarkBtn')}</span>
        </button>
      </div>
      <button class="btn-action" id="btn-share-article">
        <span>${t('shareBtn')}</span>
      </button>
    </div>

    <!-- Comments Section -->
    <div class="comments-section">
      <h3 class="comments-title">${t('commentsTitle')} (4 ${preferences.language === 'en' ? 'Comments' : 'Komentar'})</h3>
      <div class="comment-input-wrap">
        <textarea class="comment-textarea" id="comment-input-text" placeholder="${t('commentPlaceholder')}"></textarea>
        <button class="btn-submit-comment" id="btn-submit-comment-trigger">${t('commentSubmit')}</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
            <strong style="font-size:0.875rem;">Irvan Kurniawan</strong>
            <span style="font-size:0.75rem; color:var(--text-muted);">2 jam lalu</span>
          </div>
          <p style="font-size:0.875rem; color:var(--text-secondary);">Inovasi infrastruktur AI seperti ini memang sangat dibutuhkan agar startup lokal tidak tergantung penuh pada server cloud luar negeri.</p>
        </div>
      </div>
    </div>
  `;

  readerModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const contentWrapper = document.getElementById('article-content-wrapper');
  if (contentWrapper) TechGlossary.bindTermEvents(contentWrapper);

  // Apply dynamic translation if language is English
  if (preferences.language === 'en') {
    const titleEl = document.getElementById('reader-article-title');
    const subtitleEl = document.getElementById('reader-article-subtitle');
    const summaryListEl = document.getElementById('reader-ai-summary-list');
    // Show shimmer loading indicator
    if (summaryListEl) summaryListEl.style.opacity = '0.5';
    TranslationService.translateArticle(article, 'en').then(translated => {
      if (titleEl) titleEl.textContent = translated.title;
      if (subtitleEl) subtitleEl.textContent = translated.subtitle;
      if (summaryListEl) {
        summaryListEl.innerHTML = translated.aiSummary.map(item => `<li>${item}</li>`).join('');
        summaryListEl.style.opacity = '1';
      }
    });
  }

  setupReaderControls(article);
}

// Setup Reader Internal Controls
function setupReaderControls(article: Article) {
  const contentWrapper = document.getElementById('article-content-wrapper');
  const sizeBtns = document.querySelectorAll('.font-size-toggle .btn-size');

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget as HTMLElement;
      target.classList.add('active');
      const size = target.getAttribute('data-size') as 'normal' | 'large' | 'xlarge';
      preferences.fontSize = size;
      
      if (contentWrapper) {
        contentWrapper.className = `article-rich-content ${size === 'large' ? 'size-large' : size === 'xlarge' ? 'size-xlarge' : ''}`;
      }
    });
  });

  // Like Button Handler
  const likeBtn = document.getElementById('btn-like-article');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const isLiked = preferences.likedArticleIds.includes(article.id);
      if (isLiked) {
        preferences.likedArticleIds = preferences.likedArticleIds.filter(id => id !== article.id);
      } else {
        preferences.likedArticleIds.push(article.id);
      }
      localStorage.setItem('byte_likes', JSON.stringify(preferences.likedArticleIds));
      
      likeBtn.classList.toggle('liked', !isLiked);
      const likeCountElem = document.getElementById('like-count');
      if (likeCountElem) {
        likeCountElem.textContent = `${article.likesCount + (!isLiked ? 1 : 0)} ${t('likeBtn')}`;
      }
    });
  }

  // Bookmark Button Handler
  const bookmarkBtn = document.getElementById('btn-bookmark-article');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      toggleBookmark(article.id);
      const isNowSaved = preferences.savedArticleIds.includes(article.id);
      bookmarkBtn.querySelector('span')!.textContent = isNowSaved ? t('bookmarkedBtn') : t('bookmarkBtn');
    });
  }

  // Share Button Handler
  const shareBtn = document.getElementById('btn-share-article');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      Toast.show(preferences.language === 'en' ? 'Article link copied to clipboard!' : 'Tautan artikel disalin ke clipboard!');
    });
  }

  // Submit Comment Handler
  const commentBtn = document.getElementById('btn-submit-comment-trigger');
  const commentArea = document.getElementById('comment-input-text') as HTMLTextAreaElement;
  if (commentBtn && commentArea) {
    commentBtn.addEventListener('click', () => {
      if (commentArea.value.trim()) {
        commentArea.value = '';
        Toast.show(preferences.language === 'en' ? 'Your comment has been submitted and is pending editorial moderation.' : 'Komentar Anda telah terkirim dan menanti moderasi redaksi.');
      }
    });
  }

  // Real Web Speech Synthesis Text-to-Speech Handler
  const audioBtn = document.getElementById('btn-audio-play');
  const audioStopBtn = document.getElementById('btn-audio-stop');
  const audioStatusText = document.getElementById('audio-status-text');
  const audioTimerText = document.getElementById('audio-timer-text');

  // Stop any previous speech instance when opening new article
  TextToSpeechService.stop();

  if (audioBtn && audioStatusText && audioTimerText) {
    audioBtn.addEventListener('click', () => {
      if (TextToSpeechService.getIsPlaying()) {
        TextToSpeechService.pause();
      } else {
        TextToSpeechService.play(currentArticleSpeechText, preferences.language, (state, curTime, durTime) => {
          const curStr = TextToSpeechService.formatTime(curTime);
          const durStr = TextToSpeechService.formatTime(durTime);

          if (state === 'playing') {
            audioBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
            (audioBtn as HTMLElement).style.background = 'var(--accent-emerald)';
            audioStatusText.textContent = t('audioPlaying');
            audioTimerText.textContent = `${curStr} / ${durStr}`;
          } else if (state === 'paused') {
            audioBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            (audioBtn as HTMLElement).style.background = 'var(--accent-cyan)';
            audioStatusText.textContent = t('audioPaused');
            audioTimerText.textContent = `${curStr} / ${durStr}`;
          } else {
            // stopped
            audioBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            (audioBtn as HTMLElement).style.background = 'var(--accent-cyan)';
            audioStatusText.textContent = t('audioNarrativeSub');
            audioTimerText.textContent = `00:00 / ${durStr}`;
          }
        });
      }
    });

    audioStopBtn?.addEventListener('click', () => {
      TextToSpeechService.stop();
    });
  }
}

// Toggle Bookmark
function toggleBookmark(articleId: string) {
  const index = preferences.savedArticleIds.indexOf(articleId);
  if (index > -1) {
    preferences.savedArticleIds.splice(index, 1);
  } else {
    preferences.savedArticleIds.push(articleId);
  }
  localStorage.setItem('byte_bookmarks', JSON.stringify(preferences.savedArticleIds));
  updateBookmarkBadge();
  renderFeed();
}

// Render Bookmarks Drawer Modal
function renderBookmarksModal() {
  if (!bookmarksListContainer) return;

  const savedArticles = ARTICLES.filter(a => preferences.savedArticleIds.includes(a.id));

  if (savedArticles.length === 0) {
    bookmarksListContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem 0; color: var(--text-muted);">
        <p>${preferences.language === 'en' ? 'No saved articles yet.' : 'Belum ada artikel yang Anda simpan.'}</p>
      </div>
    `;
  } else {
    bookmarksListContainer.innerHTML = savedArticles.map(art => `
      <div style="display: flex; gap: 1rem; padding: 0.85rem 0; border-bottom: 1px solid var(--border-color); align-items: center;">
        <img src="${art.imageUrl}" alt="${art.title}" style="width: 70px; height: 50px; border-radius: 8px; object-fit: cover;" />
        <div style="flex: 1;">
          <h4 style="font-size: 0.875rem; font-weight: 700; cursor: pointer;" onclick="window.openArticleReaderFromOutside('${art.id}')">${art.title}</h4>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${art.category} • ${art.readTimeMinutes}m ${preferences.language === 'en' ? 'read' : 'baca'}</span>
        </div>
        <button style="color: var(--accent-rose); font-size: 0.8rem;" onclick="window.removeBookmarkFromOutside('${art.id}')">${preferences.language === 'en' ? 'Remove' : 'Hapus'}</button>
      </div>
    `).join('');
  }

  if (bookmarksModal) bookmarksModal.classList.add('open');
}

// Open Admin CMS Modal
function openAdminCMSModal() {
  if (!adminCmsModal || !adminCmsContainer) return;
  adminCmsContainer.innerHTML = adminCMS.renderAdminModalHTML();
  adminCmsModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  adminCMS.bindAdminEvents(adminCmsContainer);

  adminCmsContainer.querySelector('#admin-modal-close-btn')?.addEventListener('click', () => {
    window.location.hash = '';
    adminCmsModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Open Company Info Modal
function openCompanyModal(type: CompanyPageType) {
  if (!companyModal || !companyModalBody) return;
  companyModalBody.innerHTML = CompanyModal.renderCompanyModalHTML(type);
  companyModal.classList.add('open');

  companyModalBody.querySelector('#company-modal-close')?.addEventListener('click', () => {
    companyModal.classList.remove('open');
  });
}

// Open Glossary Modal
function openGlossaryModal() {
  if (!glossaryModal || !glossaryBody) return;
  glossaryBody.innerHTML = TechGlossary.renderGlossaryModalHTML();
  glossaryModal.classList.add('open');
}

// Open Specs Comparator Modal
function openSpecsModal() {
  if (!specsModal || !specsBody) return;
  const renderSpecs = () => {
    specsBody.innerHTML = specsComparator.renderComparatorHTML();
    specsComparator.bindEvents(specsBody, renderSpecs);
  };
  renderSpecs();
  specsModal.classList.add('open');
}

// Global helpers
(window as any).openArticleReaderFromOutside = (id: string) => {
  if (bookmarksModal) bookmarksModal.classList.remove('open');
  window.location.hash = `article/${id}`;
  openArticleReader(id);
};

(window as any).removeBookmarkFromOutside = (id: string) => {
  toggleBookmark(id);
  renderBookmarksModal();
};

// Event Listeners Registration
function setupEventListeners() {
  // Hash Routing Change
  window.addEventListener('hashchange', handleHashRouting);

  // Theme Toggle
  themeToggleBtn?.addEventListener('click', () => {
    const newTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  // Footer Company Link Event Listeners
  document.getElementById('link-about')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('about'); });
  document.getElementById('link-ethics')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('ethics'); });
  document.getElementById('link-careers')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('careers'); });
  document.getElementById('link-ads')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('ads'); });
  document.getElementById('link-contact')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('contact'); });
  document.getElementById('link-disclaimer')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('disclaimer'); });
  document.getElementById('link-cyber-guidelines')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('cyber-guidelines'); });

  document.getElementById('link-privacy')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('privacy'); });
  document.getElementById('link-terms')?.addEventListener('click', (e) => { e.preventDefault(); openCompanyModal('terms'); });
  document.getElementById('link-sitemap')?.addEventListener('click', (e) => { e.preventDefault(); Toast.show(preferences.language === 'en' ? 'ByteIndonesia Sitemap 2026.' : 'Peta Situs ByteIndonesia 2026.'); });

  // Glossary & Specs Buttons
  glossaryBtn?.addEventListener('click', openGlossaryModal);
  glossaryCloseBtn?.addEventListener('click', () => glossaryModal?.classList.remove('open'));

  specsBtn?.addEventListener('click', openSpecsModal);
  specsCloseBtn?.addEventListener('click', () => specsModal?.classList.remove('open'));

  // CMS Admin Button -> Navigate to #admin route
  adminCmsBtn?.addEventListener('click', () => {
    window.location.hash = 'admin';
  });

  // Search Bar Filter
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    renderFeed();
  });

  // Keyboard shortcut '/' to focus search & 'Escape' to close reader/audio
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === 'Escape' && readerModal?.classList.contains('open')) {
      window.location.hash = '';
      readerModal.classList.remove('open');
      document.body.style.overflow = '';
      TextToSpeechService.stop();
    }
  });

  // Modal Close Buttons
  modalCloseBtn?.addEventListener('click', () => {
    window.location.hash = '';
    readerModal?.classList.remove('open');
    document.body.style.overflow = '';
    TextToSpeechService.stop();
  });

  bookmarksBtn?.addEventListener('click', renderBookmarksModal);
  bookmarksCloseBtn?.addEventListener('click', () => {
    bookmarksModal?.classList.remove('open');
  });

  // Close modals on clicking overlay
  companyModal?.addEventListener('click', (e) => {
    if (e.target === companyModal) companyModal.classList.remove('open');
  });

  readerModal?.addEventListener('click', (e) => {
    if (e.target === readerModal) {
      window.location.hash = '';
      readerModal.classList.remove('open');
      document.body.style.overflow = '';
      TextToSpeechService.stop();
    }
  });

  bookmarksModal?.addEventListener('click', (e) => {
    if (e.target === bookmarksModal) {
      bookmarksModal.classList.remove('open');
    }
  });

  glossaryModal?.addEventListener('click', (e) => {
    if (e.target === glossaryModal) {
      glossaryModal.classList.remove('open');
    }
  });

  specsModal?.addEventListener('click', (e) => {
    if (e.target === specsModal) {
      specsModal.classList.remove('open');
    }
  });

  adminCmsModal?.addEventListener('click', (e) => {
    if (e.target === adminCmsModal) {
      window.location.hash = '';
      adminCmsModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Logo Button resets filter and route
  logoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '';
    currentCategory = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    renderCategories();
    renderFeed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Newsletter Submit Toast
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    Toast.show(t('alertSubscribe'));
    (newsletterForm as HTMLFormElement).reset();
  });

  // Footer Newsletter Submit
  const footerNewsletterForm = document.getElementById('footer-newsletter-form');
  footerNewsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    Toast.show(t('alertSubscribe'));
    (footerNewsletterForm as HTMLFormElement).reset();
  });

  // Language Switcher
  const langSwitcher = document.getElementById('lang-toggle-switcher');
  if (langSwitcher) {
    // Apply initial active state from preferences
    langSwitcher.querySelectorAll('.btn-lang').forEach(btn => {
      const lang = (btn as HTMLElement).getAttribute('data-lang');
      btn.classList.toggle('active', lang === preferences.language);
    });

    langSwitcher.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.btn-lang') as HTMLElement | null;
      if (!target) return;
      const lang = target.getAttribute('data-lang') as 'id' | 'en';
      if (lang === preferences.language) return;

      preferences.language = lang;
      localStorage.setItem('byte_lang', lang);

      // Update button visual state
      langSwitcher.querySelectorAll('.btn-lang').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).getAttribute('data-lang') === lang);
      });

      // Update search placeholder
      if (searchInput) searchInput.placeholder = t('searchPlaceholder');

      // Update cookie banner text if visible
      updateCookieBannerLabels();

      // Re-render all translatable sections
      renderCategories();
      renderBreakingBanner();
      renderHeroSection();
      renderFeed();
      updateFooterLabels();

      Toast.show(lang === 'en' ? 'Language switched to English' : 'Bahasa diubah ke Indonesia');
    });
  }

  // Back to Top button
  const backToTopBtn = document.getElementById('btn-back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
        backToTopBtn.style.transform = 'translateY(0)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transform = 'translateY(10px)';
      }
    }
  });
}

// Utility: Format Date
function formatDate(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

// Footer Localization setup
function updateFooterLabels() {
  const companyTitle = document.getElementById('footer-company-title');
  const linkAbout = document.getElementById('link-about');
  const linkContact = document.getElementById('link-contact');
  const linkEthics = document.getElementById('link-ethics');
  const linkCyber = document.getElementById('link-cyber-guidelines');
  const linkDisclaimer = document.getElementById('link-disclaimer');
  const linkAds = document.getElementById('link-ads');
  const linkCareers = document.getElementById('link-careers');

  if (companyTitle) companyTitle.textContent = t('companyText');
  if (linkAbout) linkAbout.textContent = t('aboutUs');
  if (linkContact) linkContact.textContent = t('getInTouch');
  if (linkEthics) linkEthics.textContent = t('ethicsCode');
  if (linkCyber) linkCyber.textContent = t('cyberGuidelines');
  if (linkDisclaimer) linkDisclaimer.textContent = t('disclaimerText');
  if (linkAds) linkAds.textContent = t('adsText');
  if (linkCareers) linkCareers.textContent = t('careersText');
}

// Cookie Consent Banner setup
function updateCookieBannerLabels() {
  const bannerMsg = document.getElementById('cookie-consent-msg');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');
  if (bannerMsg) bannerMsg.textContent = t('cookieMsg');
  if (acceptBtn) acceptBtn.textContent = t('cookieAccept');
  if (rejectBtn) rejectBtn.textContent = t('cookieReject');
}

function setupCookieConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');

  if (!banner || !acceptBtn || !rejectBtn) return;

  // Set initial labels
  updateCookieBannerLabels();

  const consent = localStorage.getItem('byte_cookie_consent');
  if (!consent) {
    // Show banner after 1.5s delay
    setTimeout(() => {
      banner.classList.add('show');
    }, 1500);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('byte_cookie_consent', 'accepted');
    banner.classList.remove('show');
    Toast.show(t('cookieToastAccept'));
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('byte_cookie_consent', 'rejected');
    banner.classList.remove('show');
    Toast.show(t('cookieToastReject'));
  });
}

// Run Application
document.addEventListener('DOMContentLoaded', init);
