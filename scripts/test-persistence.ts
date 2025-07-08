/**
 * 测试 JSON 文件持久化功能
 * 运行方式：npx ts-node scripts/test-persistence.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as fileSystemCache from '../src/utils/fileSystemCache';
import * as credentialsManager from '../src/utils/credentialsManager';

// 测试数据目录是否存在或可创建
function testDataDirectory() {
  console.log('测试数据目录...');
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');

  if (fs.existsSync(dataDir)) {
    console.log(`✓ 数据目录已存在: ${dataDir}`);
  } else {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`✓ 成功创建数据目录: ${dataDir}`);
    } catch (error) {
      console.error(`✗ 创建数据目录失败: ${error}`);
      process.exit(1);
    }
  }
}

// 测试保存和读取文件
function testFileOperations() {
  console.log('\n测试文件操作...');
  const testData = {
    timestamp: Date.now(),
    message: '测试数据',
    nested: {
      value: 123,
      array: [1, 2, 3]
    }
  };

  try {
    // 保存文件
    fileSystemCache.saveToFile('test', testData);
    console.log('✓ 成功保存测试文件');

    // 读取文件
    const readData = fileSystemCache.readFromFile('test');
    console.log('✓ 成功读取测试文件');

    // 验证数据
    if (JSON.stringify(readData) === JSON.stringify(testData)) {
      console.log('✓ 数据验证成功，读取的数据与写入的数据一致');
    } else {
      console.error('✗ 数据验证失败，读取的数据与写入的数据不一致');
      console.log('写入:', testData);
      console.log('读取:', readData);
    }

    // 删除测试文件
    fileSystemCache.deleteFile('test');
    console.log('✓ 成功删除测试文件');

  } catch (error) {
    console.error(`✗ 文件操作测试失败: ${error}`);
  }
}

// 测试凭证管理器
function testCredentialsManager() {
  console.log('\n测试凭证管理器...');

  // 模拟票据数据
  const ticketData = {
    ticket: 'test_ticket_' + Date.now(),
    appId: 'test_appid',
    createTime: Date.now().toString(),
    receivedAt: new Date().toISOString()
  };

  // 模拟令牌数据
  const tokenData = {
    access_token: 'test_token_' + Date.now(),
    expires_at: Date.now() + 7200000 // 2小时后过期
  };

  try {
    // 保存票据
    credentialsManager.saveComponentVerifyTicket(ticketData);
    console.log('✓ 成功保存票据数据');

    // 读取票据
    const savedTicket = credentialsManager.getComponentVerifyTicket();
    console.log('✓ 成功读取票据数据');

    // 验证票据数据
    if (savedTicket?.ticket === ticketData.ticket) {
      console.log('✓ 票据数据验证成功');
    } else {
      console.error('✗ 票据数据验证失败');
      console.log('写入:', ticketData);
      console.log('读取:', savedTicket);
    }

    // 保存令牌
    credentialsManager.saveComponentAccessToken(tokenData);
    console.log('✓ 成功保存令牌数据');

    // 读取令牌
    const savedToken = credentialsManager.getComponentAccessToken();
    console.log('✓ 成功读取令牌数据');

    // 验证令牌数据
    if (savedToken?.access_token === tokenData.access_token) {
      console.log('✓ 令牌数据验证成功');
    } else {
      console.error('✗ 令牌数据验证失败');
      console.log('写入:', tokenData);
      console.log('读取:', savedToken);
    }

  } catch (error) {
    console.error(`✗ 凭证管理器测试失败: ${error}`);
  }
}

// 运行所有测试
function runAllTests() {
  console.log('开始测试 JSON 文件持久化...\n');

  testDataDirectory();
  testFileOperations();
  testCredentialsManager();

  console.log('\n测试完成');
}

runAllTests(); 