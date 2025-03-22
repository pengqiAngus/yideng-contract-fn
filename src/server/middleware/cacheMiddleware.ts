import { Request, Response, NextFunction } from 'express';
import path from 'path';

// 需要强缓存的资源类型
const CACHEABLE_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
];

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ext = path.extname(req.path).toLowerCase();

  // 检查是否是静态资源
  if (CACHEABLE_EXTENSIONS.includes(ext)) {
    // 设置强缓存头
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1年
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  }

  next();
};
