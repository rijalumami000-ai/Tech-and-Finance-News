import type { Article, TechIndexItem } from '../types/news';
import { ARTICLES, TECH_INDEXES } from '../data/mockNews';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export class ApiService {
  private static isBackendAvailable = false;

  // Check Backend Server Health
  public static async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:8080/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        this.isBackendAvailable = true;
        return true;
      }
    } catch {
      this.isBackendAvailable = false;
    }
    return false;
  }

  // Fetch Articles from Go Backend or Fallback Dataset
  public static async getArticles(category?: string, search?: string): Promise<Article[]> {
    if (this.isBackendAvailable) {
      try {
        const url = new URL(`${API_BASE_URL}/articles`);
        if (category && category !== 'all') url.searchParams.append('category', category);
        if (search) url.searchParams.append('search', search);

        const res = await fetch(url.toString());
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('Backend API request failed, falling back to local dataset.', err);
      }
    }
    return ARTICLES;
  }

  // Fetch Tech Indexes from Go Backend or Fallback Dataset
  public static async getTechIndexes(): Promise<TechIndexItem[]> {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/tech-indexes`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            return json.data;
          }
        }
      } catch (err) {
        console.warn('Backend Tech Indexes API failed, falling back to mock dataset.', err);
      }
    }
    return TECH_INDEXES;
  }

  // Create Article via Go Backend
  public static async createArticle(article: Article): Promise<boolean> {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE_URL}/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article)
        });
        return res.ok;
      } catch (err) {
        console.error('Failed to post article to Go Backend', err);
      }
    }
    return false;
  }
}
