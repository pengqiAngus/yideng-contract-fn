import cacheManager from './cacheManager';

class ResourceLoader {
  private static instance: ResourceLoader;
  private loadingPromises: Map<string, Promise<void>> = new Map();
  private loadedScripts: Set<string> = new Set();

  private constructor() {}

  static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  async loadScript(url: string): Promise<void> {
    // 如果脚本已经加载过，直接返回
    if (this.loadedScripts.has(url)) {
      return;
    }

    // 检查是否正在加载中
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // 检查缓存
    const cachedContent = cacheManager.getResource(url);
    if (cachedContent) {
      await this.executeScript(cachedContent);
      this.loadedScripts.add(url);
      return;
    }

    // 创建新的加载Promise
    const loadPromise = this.fetchAndCacheScript(url);
    this.loadingPromises.set(url, loadPromise);

    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  private async fetchAndCacheScript(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch script: ${url}`);
      }
      const content = await response.text();

      // 缓存脚本内容
      await cacheManager.saveResource(url, content);

      // 执行脚本
      await this.executeScript(content);
      this.loadedScripts.add(url);
    } catch (error) {
      console.error(`Error loading script ${url}:`, error);
      throw error;
    }
  }

  private executeScript(content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 创建script标签
        const script = document.createElement('script');
        script.type = 'text/javascript';

        // 使用Blob和URL.createObjectURL来执行脚本
        const blob = new Blob([content], { type: 'text/javascript' });
        script.src = URL.createObjectURL(blob);

        // 监听加载完成事件
        script.onload = () => {
          URL.revokeObjectURL(script.src);
          resolve();
        };

        // 监听错误事件
        script.onerror = error => {
          URL.revokeObjectURL(script.src);
          reject(error);
        };

        // 添加到文档中
        document.head.appendChild(script);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 清除所有已加载的脚本
  clearLoadedScripts(): void {
    this.loadedScripts.clear();
  }
}

export default ResourceLoader.getInstance();
