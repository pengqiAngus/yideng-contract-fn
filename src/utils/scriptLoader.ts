import resourceLoader from './resourceLoader';
import { manifest } from '../../dist/manifest.json';

export async function loadAppScripts() {
  try {
    // 加载主入口脚本
    await resourceLoader.loadScript(manifest['main.js']);

    // 加载其他必要的脚本
    const scriptsToLoad = [
      manifest['chunk-vendors.js'],
      manifest['chunk-commons.js'],
      manifest['chunk-components.js'],
      manifest['chunk-web3-sdk.js'],
      manifest['chunk-react-libs.js'],
      manifest['chunk-other-vendors.js'],
    ].filter(Boolean); // 过滤掉undefined的项

    // 并行加载所有脚本
    await Promise.all(scriptsToLoad.map(script => resourceLoader.loadScript(script)));
  } catch (error) {
    console.error('Failed to load app scripts:', error);
    throw error;
  }
}

// 导出manifest以供其他模块使用
export { manifest };
