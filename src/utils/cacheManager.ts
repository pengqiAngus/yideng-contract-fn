import { manifest } from '../../dist/manifest.json';

interface CacheItem {
  content: string;
  hash: string;
  timestamp: number;
}

class CacheManager {
  private static instance: CacheManager;
  private readonly CACHE_PREFIX = 'app_cache_';
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天过期

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // 保存资源到localStorage
  async saveResource(key: string, content: string): Promise<void> {
    const cacheItem: CacheItem = {
      content,
      hash: manifest[key] || '',
      timestamp: Date.now(),
    };
    localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheItem));
  }

  // 从localStorage获取资源
  getResource(key: string): string | null {
    const cachedItem = localStorage.getItem(this.CACHE_PREFIX + key);
    if (!cachedItem) return null;

    const item: CacheItem = JSON.parse(cachedItem);

    // 检查是否过期
    if (Date.now() - item.timestamp > this.CACHE_EXPIRY) {
      this.removeResource(key);
      return null;
    }

    // 检查hash是否匹配
    if (item.hash !== manifest[key]) {
      this.removeResource(key);
      return null;
    }

    return item.content;
  }

  // 移除资源
  removeResource(key: string): void {
    localStorage.removeItem(this.CACHE_PREFIX + key);
  }

  // 清除所有缓存
  clearAll(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}

export default CacheManager.getInstance();
