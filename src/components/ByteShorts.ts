export interface StorySlide {
  id: string;
  articleId: string;
  titleId: string;
  titleEn: string;
  captionId: string;
  captionEn: string;
  imageUrl: string;
  category: string;
}

export interface ByteStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  badge: string;
  isUnread: boolean;
  slides: StorySlide[];
}

export const MOCK_STORIES: ByteStory[] = [
  {
    id: 'story-01',
    authorName: 'IKN Superkomputer',
    authorAvatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=250&q=80',
    badge: 'AI TERKINI',
    isUnread: true,
    slides: [
      {
        id: 's-101',
        articleId: 'art-001',
        titleId: 'Pusat Data AI IKN Resmi Beroperasi!',
        titleEn: 'IKN AI Data Center Officially Active!',
        captionId: 'Kapasitas 100 Petaflops ditenagai 100% energi terbarukan PLTS IKN.',
        captionEn: '100 Petaflops capacity powered 100% by solar renewable energy.',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        category: 'AI & INFRASTRUKTUR'
      },
      {
        id: 's-102',
        articleId: 'art-001',
        titleId: 'Fokus Pelatihan LLM Nusantara',
        titleEn: 'Focus on LLM Nusantara Training',
        captionId: 'Memproses kecerdasan buatan dalam Bahasa Indonesia & 700+ bahasa daerah.',
        captionEn: 'Processing artificial intelligence in Indonesian & 700+ regional dialects.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        category: 'AI RESEARCH'
      }
    ]
  },
  {
    id: 'story-02',
    authorName: 'Review HP Lipat',
    authorAvatar: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=250&q=80',
    badge: 'GADGET',
    isUnread: true,
    slides: [
      {
        id: 's-201',
        articleId: 'art-002',
        titleId: 'Smartphone Layar Lipat Tiga Pertama',
        titleEn: 'First Tri-Fold Smartphone Launched',
        captionId: 'Ketebalan 3.6mm dengan engsel titanium & baterai sel silikon 5600mAh.',
        captionEn: '3.6mm thickness with titanium hinge & 5600mAh silicon battery.',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
        category: 'HARDWARE TECH'
      }
    ]
  },
  {
    id: 'story-03',
    authorName: 'Satelit Low Earth',
    authorAvatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=250&q=80',
    badge: 'TELEKOM',
    isUnread: true,
    slides: [
      {
        id: 's-301',
        articleId: 'art-003',
        titleId: 'Uji Coba Internet Direct-to-Cell',
        titleEn: 'Direct-to-Cell Satellite Trial',
        captionId: 'Komunikasi darurat satelit langsung ke smartphone standar di daerah 3T.',
        captionEn: 'Emergency satellite communication directly to standard smartphones in remote areas.',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        category: 'SPACE TECH'
      }
    ]
  },
  {
    id: 'story-04',
    authorName: 'Cyber Defense RI',
    authorAvatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=250&q=80',
    badge: 'SECURITY',
    isUnread: false,
    slides: [
      {
        id: 's-401',
        articleId: 'art-004',
        titleId: 'Enkripsi Quantum-Resistant PDP',
        titleEn: 'Quantum-Resistant PDP Encryption',
        captionId: 'BSSN berlakukan enkripsi Kuantum bagi lembaga keuangan & infrastruktur kritis.',
        captionEn: 'BSSN enforces Quantum encryption for financial & critical infrastructure.',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        category: 'CYBERSECURITY'
      }
    ]
  }
];

export class ByteShorts {
  private static activeStoryIndex = 0;
  private static activeSlideIndex = 0;
  private static timerId: any = null;

  public static renderBarHTML(lang: 'id' | 'en'): string {
    const sectionTitle = lang === 'en' ? '⚡ BYTESHORTS • VISUAL STORIES' : '⚡ BYTESHORTS • BERITA KILAT';

    return `
      <div style="margin: 1.25rem 0 0.5rem 0; padding: 0.85rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.72rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono); letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
          <span>${sectionTitle}</span>
          <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 600;">Klik Story Untuk Pratinjau →</span>
        </div>

        <div style="display: flex; gap: 1.25rem; overflow-x: auto; padding-bottom: 0.35rem; scrollbar-width: none;">
          ${MOCK_STORIES.map((story, idx) => `
            <div class="byte-story-item" data-story-index="${idx}" style="display: flex; flex-direction: column; align-items: center; gap: 0.4rem; cursor: pointer; flex-shrink: 0; transition: transform 0.2s ease;">
              <div style="position: relative; width: 56px; height: 56px; border-radius: 50%; padding: 2px; background: ${story.isUnread ? 'linear-gradient(135deg, var(--accent-cyan), #3b82f6, #ec4899)' : 'var(--border-color)'};">
                <img src="${story.authorAvatar}" alt="${story.authorName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid var(--bg-primary);" />
                <span style="position: absolute; bottom: -2px; right: -2px; background: var(--accent-cyan); color: #000; font-size: 0.55rem; font-weight: 800; padding: 0.1rem 0.3rem; border-radius: 100px; text-transform: uppercase;">
                  ${story.badge}
                </span>
              </div>
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-primary); max-width: 72px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${story.authorName}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  public static openViewer(storyIdx: number, lang: 'id' | 'en', onOpenArticle: (artId: string) => void) {
    this.activeStoryIndex = storyIdx;
    this.activeSlideIndex = 0;
    
    // Mark as read
    MOCK_STORIES[storyIdx].isUnread = false;

    let viewerModal = document.getElementById('byteshorts-viewer-modal');
    if (!viewerModal) {
      viewerModal = document.createElement('div');
      viewerModal.id = 'byteshorts-viewer-modal';
      viewerModal.style.cssText = `
        position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
      `;
      document.body.appendChild(viewerModal);
    }

    this.renderViewerContent(viewerModal, lang, onOpenArticle);
    viewerModal.style.opacity = '1';
    viewerModal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';

    this.startAutoAdvance(viewerModal, lang, onOpenArticle);
  }

  private static renderViewerContent(container: HTMLElement, lang: 'id' | 'en', onOpenArticle: (artId: string) => void) {
    const story = MOCK_STORIES[this.activeStoryIndex];
    const slide = story.slides[this.activeSlideIndex];

    const title = lang === 'en' ? slide.titleEn : slide.titleId;
    const caption = lang === 'en' ? slide.captionEn : slide.captionId;
    const readFullText = lang === 'en' ? 'Read Full Story →' : 'Baca Berita Selengkapnya →';

    container.innerHTML = `
      <div style="position: relative; width: 100%; max-width: 420px; height: 85vh; max-height: 720px; background: #000; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
        
        <!-- Background Image -->
        <img src="${slide.imageUrl}" alt="${title}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.95) 100%);"></div>

        <!-- Top Header & Segment Progress Bars -->
        <div style="position: relative; z-index: 10; padding: 1rem 1rem 0 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
          <div style="display: flex; gap: 4px;">
            ${story.slides.map((_, sIdx) => `
              <div style="flex: 1; height: 3px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden;">
                <div style="height: 100%; width: ${sIdx < this.activeSlideIndex ? '100%' : sIdx === this.activeSlideIndex ? '100%' : '0%'}; background: var(--accent-cyan); transition: ${sIdx === this.activeSlideIndex ? 'width 4.5s linear' : 'none'};"></div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <img src="${story.authorAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-cyan);" />
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: #fff;">${story.authorName}</div>
                <div style="font-size: 0.65rem; color: var(--accent-cyan); font-family: var(--font-mono); font-weight: 800;">${slide.category}</div>
              </div>
            </div>
            <button id="btn-close-byteshorts" style="background: rgba(255,255,255,0.2); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-weight: bold;">✕</button>
          </div>
        </div>

        <!-- Navigation Click Overlay Areas -->
        <div style="position: absolute; inset: 0; z-index: 5; display: flex;">
          <div id="btn-prev-slide" style="flex: 1; height: 100%; cursor: pointer;"></div>
          <div id="btn-next-slide" style="flex: 2; height: 100%; cursor: pointer;"></div>
        </div>

        <!-- Bottom Story Content & Call to Action -->
        <div style="position: relative; z-index: 10; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.85rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #fff; line-height: 1.35; text-shadow: 0 2px 8px rgba(0,0,0,0.8);">${title}</h2>
          <p style="font-size: 0.875rem; color: rgba(255,255,255,0.85); line-height: 1.45;">${caption}</p>
          
          <button id="btn-open-story-article" data-article-id="${slide.articleId}" style="width: 100%; padding: 0.75rem; background: var(--gradient-brand); border: none; border-radius: 8px; color: #000; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: transform 0.2s ease;">
            ${readFullText}
          </button>
        </div>
      </div>
    `;

    // Bind Viewer Events
    container.querySelector('#btn-close-byteshorts')?.addEventListener('click', () => this.closeViewer(container));
    container.querySelector('#btn-prev-slide')?.addEventListener('click', () => this.prevSlide(container, lang, onOpenArticle));
    container.querySelector('#btn-next-slide')?.addEventListener('click', () => this.nextSlide(container, lang, onOpenArticle));
    
    container.querySelector('#btn-open-story-article')?.addEventListener('click', () => {
      this.closeViewer(container);
      onOpenArticle(slide.articleId);
    });
  }

  private static startAutoAdvance(container: HTMLElement, lang: 'id' | 'en', onOpenArticle: (artId: string) => void) {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.nextSlide(container, lang, onOpenArticle);
    }, 4500);
  }

  private static nextSlide(container: HTMLElement, lang: 'id' | 'en', onOpenArticle: (artId: string) => void) {
    const story = MOCK_STORIES[this.activeStoryIndex];
    if (this.activeSlideIndex < story.slides.length - 1) {
      this.activeSlideIndex++;
      this.renderViewerContent(container, lang, onOpenArticle);
      this.startAutoAdvance(container, lang, onOpenArticle);
    } else if (this.activeStoryIndex < MOCK_STORIES.length - 1) {
      this.activeStoryIndex++;
      this.activeSlideIndex = 0;
      MOCK_STORIES[this.activeStoryIndex].isUnread = false;
      this.renderViewerContent(container, lang, onOpenArticle);
      this.startAutoAdvance(container, lang, onOpenArticle);
    } else {
      this.closeViewer(container);
    }
  }

  private static prevSlide(container: HTMLElement, lang: 'id' | 'en', onOpenArticle: (artId: string) => void) {
    if (this.activeSlideIndex > 0) {
      this.activeSlideIndex--;
      this.renderViewerContent(container, lang, onOpenArticle);
      this.startAutoAdvance(container, lang, onOpenArticle);
    } else if (this.activeStoryIndex > 0) {
      this.activeStoryIndex--;
      this.activeSlideIndex = MOCK_STORIES[this.activeStoryIndex].slides.length - 1;
      this.renderViewerContent(container, lang, onOpenArticle);
      this.startAutoAdvance(container, lang, onOpenArticle);
    }
  }

  private static closeViewer(container: HTMLElement) {
    if (this.timerId) clearTimeout(this.timerId);
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  public static bindBarEvents(container: HTMLElement, lang: 'id' | 'en', onOpenArticle: (artId: string) => void) {
    container.querySelectorAll('.byte-story-item').forEach(item => {
      item.addEventListener('click', () => {
        const sIdx = parseInt(item.getAttribute('data-story-index') || '0', 10);
        this.openViewer(sIdx, lang, onOpenArticle);
      });
    });
  }
}
