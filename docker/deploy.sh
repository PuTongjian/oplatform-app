#!/bin/bash

# 切换到docker目录所在的父目录
cd "$(dirname "$0")/.."

# 显示彩色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 显示欢迎信息
echo -e "${GREEN}=== 微信开放平台应用一键部署脚本 ===${NC}"
echo -e "${YELLOW}此脚本将自动构建并部署应用到Docker${NC}"
echo ""

# 检查 Docker 和 Docker Compose 是否已安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装. 请先安装 Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo "错误: Docker Compose 未安装. 请先安装 Docker Compose."
    exit 1
fi

# 设置环境变量
export NODE_ENV=production

# 停止并移除旧容器
echo -e "${YELLOW}正在停止旧容器...${NC}"
docker-compose -f docker/docker-compose.yml down || docker compose -f docker/docker-compose.yml down

# 构建新镜像
echo -e "${YELLOW}正在构建新镜像...${NC}"
docker-compose -f docker/docker-compose.yml build || docker compose -f docker/docker-compose.yml build

# 启动新容器
echo -e "${YELLOW}正在启动新容器...${NC}"
docker-compose -f docker/docker-compose.yml up -d || docker compose -f docker/docker-compose.yml up -d

# 显示运行状态
echo -e "${YELLOW}检查容器状态...${NC}"
docker-compose -f docker/docker-compose.yml ps || docker compose -f docker/docker-compose.yml ps

echo ""
echo -e "${GREEN}部署完成!${NC}"
echo -e "应用现在应该可以通过 http://localhost:3000 访问"
echo -e "如需查看日志，请运行: ${YELLOW}docker-compose -f docker/docker-compose.yml logs -f${NC} 或 ${YELLOW}docker compose -f docker/docker-compose.yml logs -f${NC}" 