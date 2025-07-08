/**
 * 测试 JSON 文件持久化功能
 * 运行方式：node scripts/test-persistence.js
 */

const fs = require('fs');
const path = require('path');

// 路径到源代码目录
const srcPath = path.join(process.cwd(), 'src');

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
  
  return dataDir;
}

// 测试JSON文件读写
function testJsonFileOperations(dataDir) {
  console.log('\n测试JSON文件操作...');
  const testFile = path.join(dataDir, 'test.json');
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
    fs.writeFileSync(testFile, JSON.stringify(testData, null, 2), 'utf8');
    console.log(`✓ 成功保存测试文件: ${testFile}`);
    
    // 读取文件
    const readData = JSON.parse(fs.readFileSync(testFile, 'utf8'));
    console.log(`✓ 成功读取测试文件: ${testFile}`);
    
    // 验证数据
    if (JSON.stringify(readData) === JSON.stringify(testData)) {
      console.log('✓ 数据验证成功，读取的数据与写入的数据一致');
    } else {
      console.error('✗ 数据验证失败，读取的数据与写入的数据不一致');
      console.log('写入:', testData);
      console.log('读取:', readData);
    }
    
    // 删除测试文件
    fs.unlinkSync(testFile);
    console.log(`✓ 成功删除测试文件: ${testFile}`);
    
  } catch (error) {
    console.error(`✗ 文件操作测试失败: ${error}`);
  }
}

// 测试凭证文件
function testCredentialsFile(dataDir) {
  console.log('\n测试凭证文件...');
  const credentialsFile = path.join(dataDir, 'credentials.json');
  
  // 模拟凭证数据
  const credentialsData = {
    component_verify_ticket: {
      ticket: 'test_ticket_' + Date.now(),
      appId: 'test_appid',
      createTime: Date.now().toString(),
      receivedAt: new Date().toISOString()
    },
    component_access_token: {
      access_token: 'test_token_' + Date.now(),
      expires_at: Date.now() + 7200000 // 2小时后过期
    },
    authorizer_access_tokens: {
      'wx123456': {
        access_token: 'auth_test_token_' + Date.now(),
        expires_at: Date.now() + 7200000
      }
    },
    authorizer_refresh_tokens: {
      'wx123456': 'refresh_token_' + Date.now()
    }
  };
  
  try {
    // 保存凭证文件
    fs.writeFileSync(credentialsFile, JSON.stringify(credentialsData, null, 2), 'utf8');
    console.log(`✓ 成功保存凭证文件: ${credentialsFile}`);
    
    // 读取凭证文件
    const readData = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    console.log(`✓ 成功读取凭证文件: ${credentialsFile}`);
    
    // 验证数据
    if (JSON.stringify(readData) === JSON.stringify(credentialsData)) {
      console.log('✓ 凭证数据验证成功，读取的数据与写入的数据一致');
    } else {
      console.error('✗ 凭证数据验证失败，读取的数据与写入的数据不一致');
    }
    
    // 保留文件作为示例
    console.log(`✓ 凭证文件保留在: ${credentialsFile}`);
    
  } catch (error) {
    console.error(`✗ 凭证文件测试失败: ${error}`);
  }
}

// 运行所有测试
function runAllTests() {
  console.log('开始测试 JSON 文件持久化...\n');
  
  const dataDir = testDataDirectory();
  testJsonFileOperations(dataDir);
  testCredentialsFile(dataDir);
  
  console.log('\n测试完成');
  console.log(`数据目录: ${dataDir}`);
}

runAllTests(); 