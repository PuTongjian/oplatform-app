/**
 * 简单的内存缓存实现
 */

interface CacheData {
  value: any;
  expiry?: number; // 可选的过期时间戳
}

// 模块级缓存对象
const cache: Record<string, CacheData> = {};

/**
 * 设置缓存
 * @param key 缓存键
 * @param value 缓存值
 * @param ttl 过期时间(毫秒)，可选
 */
export function set(key: string, value: any, ttl?: number): void {
  const data: CacheData = { value };
  
  if (ttl) {
    data.expiry = Date.now() + ttl;
  }
  
  cache[key] = data;
}

/**
 * 获取缓存
 * @param key 缓存键
 * @returns 缓存值或undefined(如果不存在或已过期)
 */
export function get<T>(key: string): T | undefined {
  const data = cache[key];
  
  if (!data) {
    return undefined;
  }
  
  // 检查是否过期
  if (data.expiry && data.expiry < Date.now()) {
    delete cache[key];
    return undefined;
  }
  
  return data.value as T;
}

/**
 * 检查缓存键是否存在且未过期
 * @param key 缓存键
 * @returns 是否存在且未过期
 */
export function has(key: string): boolean {
  const data = cache[key];
  
  if (!data) {
    return false;
  }
  
  if (data.expiry && data.expiry < Date.now()) {
    delete cache[key];
    return false;
  }
  
  return true;
}

/**
 * 删除缓存
 * @param key 缓存键
 */
export function del(key: string): void {
  delete cache[key];
}

/**
 * 清除所有缓存
 */
export function clear(): void {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
} 