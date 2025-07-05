// 调用凭证数据类型
export interface TicketData {
  ticket: string;
  appId: string;
  createTime: string;
  receivedAt: string;
  raw?: any;
}

// 消息数据类型
export interface MessageData {
  receivedAt: string;
  params: {
    signature?: string;
    timestamp?: string;
    nonce?: string;
    openid?: string;
    encryptType?: string;
    msgSignature?: string;
  };
  rawData: string;
  parsedData: any;
  decryptedData?: any;
  isEncrypted?: boolean;
  signatureValid?: boolean;
  appid?: string;
}

// 草稿箱列表数据类型
export interface DraftItem {
  create_time: number;
  user_version: string;
  user_desc: string;
  draft_id: number;
  source_miniprogram_appid: string;
  source_miniprogram: string;
  developer: string;
  category_list: any[];
}

// 模板库列表数据类型
export interface TemplateItem {
  create_time: number;
  user_version: string;
  user_desc: string;
  template_id: number;
  draft_id?: number;
  source_miniprogram_appid: string;
  source_miniprogram: string;
  developer?: string;
  template_type: number;
  category_list: any[];
  audit_scene?: number;
  audit_status?: number;
  reason?: string;
}

// 操作结果类型
export interface OperationResult {
  success: boolean;
  message: string;
  visible: boolean;
} 