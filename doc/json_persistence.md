# JSON 文件数据持久化

本项目使用 JSON 文件进行数据持久化，确保应用重启后数据不会丢失。

## 存储目录

默认情况下，JSON 文件存储在项目根目录下的 `data` 目录中。可以通过环境变量 `DATA_DIR` 修改此路径。

## 存储内容

目前，以下数据将被持久化到 JSON 文件中：

1. **凭证信息** (`credentials.json`)
   - 第三方平台 component_verify_ticket
   - 第三方平台 component_access_token
   - 授权方 authorizer_access_token
   - 授权方 authorizer_refresh_token

## 工作原理

1. 应用启动时，会检查数据目录是否存在，如不存在则创建
2. 当新数据到达时，会同时存储在内存缓存和 JSON 文件中
3. 当应用需要读取数据时，会先查找内存缓存，如没有则从 JSON 文件中读取

## Docker 部署

在 Docker 环境中，数据目录被映射为一个命名卷 `oplatform-data`，确保容器重建后数据仍然保留。

```yaml
volumes:
  - oplatform-data:/app/data
```

## API

持久化功能主要由以下文件提供：

- `src/utils/fileSystemCache.ts` - 提供基本的文件读写功能
- `src/utils/credentialsManager.ts` - 专门处理凭证数据的持久化

### 示例用法

```typescript
// 导入凭证管理器
import * as credentialsManager from '@/utils/credentialsManager';

// 保存票据
credentialsManager.saveComponentVerifyTicket(ticketData);

// 获取票据
const ticket = credentialsManager.getComponentVerifyTicket();

// 保存访问令牌
credentialsManager.saveComponentAccessToken(tokenData);

// 获取访问令牌
const token = credentialsManager.getComponentAccessToken();
``` 