import crypto from 'crypto';

export class WXBizMsgCrypt {
  private encodingAESKey: string;
  private token: string;
  private appId: string;
  private aesKey: Buffer;
  private iv: Buffer;

  /**
   * 构造函数
   * @param token 公众平台上，开发者设置的Token
   * @param encodingAESKey 公众平台上，开发者设置的EncodingAESKey
   * @param appId 公众号的appId或第三方平台的appId
   */
  constructor(token: string, encodingAESKey: string, appId: string) {
    this.token = token;
    this.appId = appId;
    this.encodingAESKey = encodingAESKey;
    
    // 消息加解密Key尾部填充一个字符的"="
    const aesKeyWithPadding = encodingAESKey + '=';
    
    // Base64解码得到32个字节的AESKey
    this.aesKey = Buffer.from(aesKeyWithPadding, 'base64');
    
    // 使用AESKey的前16字节作为初始向量
    this.iv = this.aesKey.slice(0, 16);
  }

  /**
   * 验证签名
   * @param signature 签名
   * @param timestamp 时间戳
   * @param nonce 随机数
   * @param encrypt 加密的消息
   * @returns 是否合法
   */
  verifySignature(signature: string, timestamp: string, nonce: string, encrypt: string): boolean {
    const sortedParams = [this.token, timestamp, nonce, encrypt].sort();
    const joinedParams = sortedParams.join('');
    const sha1Sum = crypto.createHash('sha1');
    sha1Sum.update(joinedParams);
    const calculatedSignature = sha1Sum.digest('hex');
    
    return signature === calculatedSignature;
  }

  /**
   * 解密消息
   * @param encryptedMsg 加密的XML消息体中的Encrypt字段内容
   * @returns 解密后的消息内容
   */
  decrypt(encryptedMsg: string): { message: string, appId: string } {
    try {
      // 对密文进行Base64解码
      const encryptedBuffer = Buffer.from(encryptedMsg, 'base64');
      
      // 使用AES-CBC解密
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, this.iv);
      decipher.setAutoPadding(false); // 需要手动处理PKCS#7填充
      
      // 解密得到的是随机字符串(16B) + 消息长度(4B) + 消息内容 + AppId
      let decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final()
      ]);
      
      // 处理PKCS#7填充
      const padLength = decrypted[decrypted.length - 1];
      if (padLength > 0 && padLength <= 32) {
        decrypted = decrypted.slice(0, decrypted.length - padLength);
      }
      
      // 提取真正的消息内容
      // 跳过16字节随机字符串
      const msgLenBuffer = decrypted.slice(16, 20);
      const msgLen = msgLenBuffer.readUInt32BE(0); // 使用网络字节序(大端序)读取长度
      
      // 提取消息内容
      const msgContent = decrypted.slice(20, 20 + msgLen).toString('utf8');
      
      // 提取appId
      const receivedAppId = decrypted.slice(20 + msgLen).toString('utf8');
      
      // 验证appId是否匹配
      if (receivedAppId !== this.appId) {
        console.warn(`AppId不匹配: 期望${this.appId}, 实际${receivedAppId}`);
      }
      
      return {
        message: msgContent,
        appId: receivedAppId
      };
    } catch (error) {
      console.error('解密失败:', error);
      throw new Error('消息解密失败');
    }
  }
} 