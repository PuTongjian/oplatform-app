# 微信第三方平台接口可视化平台

这是一个用于可视化微信第三方平台接口调用的应用程序。它提供了接收微信服务器推送的 component_verify_ticket 和消息的 API 接口，并以简洁清晰的方式展示接收到的数据。

## 功能特点

- 接收并存储微信服务器推送的 component_verify_ticket
- 接收并存储微信服务器推送的消息
- 自动解密加密消息（支持安全模式下的消息解密）
- 提供直观的可视化界面展示接收到的数据
- 定时自动刷新数据

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- React

## 安装与运行

1. 克隆代码库

```bash
git clone <repository-url>
cd oplatform-app
```

2. 安装依赖

```bash
npm install
# 或者
yarn
# 或者
pnpm install
```

3. 配置微信第三方平台参数

编辑 `src/config/wechatConfig.ts` 文件，填入您的第三方平台信息：

```typescript
// 微信第三方平台配置
const wechatConfig = {
  // 第三方平台的 AppID，可在微信开放平台获取
  appId: '您的AppID',
  
  // 消息校验Token，用于签名校验，需与微信开放平台配置一致
  token: '您设置的Token',
  
  // 消息加解密Key，用于消息加解密，需与微信开放平台配置一致
  encodingAESKey: '您设置的EncodingAESKey',
};
```

4. 启动开发服务器

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用

## API 接口

### component_verify_ticket

- **路径**: `/api/component_verify_ticket`
- **方法**: `POST`
- **描述**: 用于接收微信服务器推送的 component_verify_ticket
- **响应**: 成功接收后返回字符串 `"success"`
- **存储**: ticket 信息以 JSON 格式存储在 `data/component_verify_ticket.txt` 文件中
- **加密支持**: 自动解密加密的消息内容

### revice

- **路径**: `/api/revice`
- **方法**: `POST`
- **描述**: 用于接收微信服务器推送的消息
- **响应**: 成功接收后返回字符串 `"success"`
- **存储**: 消息以 JSON 格式追加存储在 `data/messages.txt` 文件中
- **加密支持**: 自动解密加密的消息内容

## 微信第三方平台配置

在微信开放平台的「管理中心」-「第三方平台」-「开发配置」-「开发资料」中，配置以下信息：

1. **授权事件接收 URL**: `https://your-domain.com/api/component_verify_ticket`
2. **消息与事件接收 URL**: `https://your-domain.com/api/revice`
3. **消息校验 Token**: 自定义的 Token（需与 wechatConfig.ts 中配置一致）
4. **消息加解密 Key**: 自定义的加密密钥（需与 wechatConfig.ts 中配置一致）
5. **消息加解密方式**: 安全模式（第三方平台只支持安全模式）

## 消息解密功能

本应用实现了微信第三方平台消息的解密功能，支持处理安全模式下的加密消息。解密流程如下：

1. 从消息中提取 Encrypt 字段
2. 使用 AES-CBC 算法进行解密
3. 从解密结果中提取真正的消息内容
4. 解析并显示解密后的数据

解密过程遵循以下步骤：
- AESKey = Base64_Decode(消息加解密Key + "=")
- 将 Encrypt 密文进行 Base64 解码
- 使用 AES-CBC 算法解密，得到包含随机字符串、消息长度、消息内容和 AppID 的完整字符串
- 从完整字符串中提取消息内容

## 数据存储

- component_verify_ticket 数据存储在 `data/component_verify_ticket.txt` 文件中
- 推送消息数据存储在 `data/messages.txt` 文件中

## 注意事项

- 使用前请务必配置正确的 Token、EncodingAESKey 和 AppID
- 目前仅支持文本方式存储数据，未实现数据库存储
- 在生产环境中部署时，请确保 `data` 目录有适当的文件读写权限
- 为安全起见，建议在生产环境中使用 HTTPS

## Docker部署指南

本项目支持通过Docker快速部署。所有Docker相关文件位于`docker`目录。

### 前提条件

- 已安装Docker
- 已安装Docker Compose

### 快速部署

使用提供的一键部署脚本：

```bash
# 添加执行权限
chmod +x docker/deploy.sh

# 运行部署脚本
./docker/deploy.sh
```

脚本会自动执行以下操作：
1. 构建Docker镜像
2. 停止并移除旧容器（如果存在）
3. 启动新容器
4. 显示容器运行状态

### 手动部署

如果需要手动部署，可以执行以下命令：

```bash
# 构建镜像
docker-compose -f docker/docker-compose.yml build

# 启动容器
docker-compose -f docker/docker-compose.yml up -d

# 查看日志
docker-compose -f docker/docker-compose.yml logs -f
```

部署完成后，应用将运行在 http://localhost:3000

## GitHub Actions自动构建

本项目配置了GitHub Actions自动构建和发布Docker镜像到Docker Hub。

### 配置步骤

1. Fork或克隆此仓库到您的GitHub账号
2. 在GitHub仓库设置中添加以下Secrets:
   - `DOCKERHUB_USERNAME`: 您的Docker Hub用户名
   - `DOCKERHUB_TOKEN`: 您的Docker Hub访问令牌（在Docker Hub账号设置中创建）
3. 在`.github/workflows/docker-publish.yml`文件中修改`IMAGE_NAME`为您的Docker仓库名称

### 触发构建

以下操作会触发自动构建并发布Docker镜像：
- 推送代码到`main`分支
- 创建以`v`开头的标签（如`v1.0.0`）
- 手动在GitHub Actions页面触发workflow

### 使用发布的镜像

发布后，您可以通过以下命令拉取并运行镜像：

```bash
# 拉取最新镜像
docker pull your-dockerhub-username/oplatform-app:latest

# 运行容器
docker run -d -p 3000:3000 your-dockerhub-username/oplatform-app:latest
```

## 其他说明

- 应用使用内存缓存存储数据，重启容器后数据将丢失
- 默认端口为3000，可在docker/docker-compose.yml中修改
