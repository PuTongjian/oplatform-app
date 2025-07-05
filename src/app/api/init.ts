import { ensureAccessToken } from '@/utils/accessTokenManager';

// 初始化 access_token 管理器
try {
  // 仅在服务器端执行
  if (typeof window === 'undefined') {
    console.log('Initializing access token...');
    // 预先尝试获取一次token，以便缓存
    ensureAccessToken()
      .then(() => {
        console.log('Access token initialized successfully');
      })
      .catch(error => {
        console.error('Failed to initialize access token:', error);
      });
  }
} catch (error) {
  console.error('Failed to initialize access token:', error);
}

export {}; 