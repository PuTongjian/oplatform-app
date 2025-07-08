import * as fileSystemCache from './fileSystemCache';
import * as memoryCache from './memoryCache';

// Constants for credential files
const CREDENTIALS_FILE = 'credentials';

// Credential types
export interface TicketData {
  ticket: string;
  appId?: string;
  createTime?: string;
  receivedAt?: string;
  raw?: any;
}

export interface TokenData {
  access_token: string;
  expires_at: number; // Expiry timestamp
}

export interface AuthorizerInfo {
  appid: string;
  refresh_token: string;
  authorized_time: string;
  func_info?: any[];
  name?: string;
  type?: string;
  principal_name?: string;
  alias?: string;
  qrcode_url?: string;
}

export interface Credentials {
  component_verify_ticket?: TicketData;
  component_access_token?: TokenData;
  authorizer_access_tokens?: Record<string, TokenData>;
  authorizer_refresh_tokens?: Record<string, string>;
  authorizers?: Record<string, AuthorizerInfo>;
}

/**
 * Save credentials to file and update memory cache
 * @param credentials The credentials to save
 */
export function saveCredentials(credentials: Credentials): void {
  try {
    fileSystemCache.saveToFile(CREDENTIALS_FILE, credentials);
  } catch (error) {
    console.error('Failed to save credentials to file:', error);
  }
}

/**
 * Load credentials from file
 * @returns The loaded credentials or an empty object
 */
export function loadCredentials(): Credentials {
  try {
    const credentials = fileSystemCache.readFromFile<Credentials>(CREDENTIALS_FILE);
    return credentials || {};
  } catch (error) {
    console.error('Failed to load credentials from file:', error);
    return {};
  }
}

/**
 * Get component verify ticket
 * @returns The ticket data or undefined
 */
export function getComponentVerifyTicket(): TicketData | undefined {
  // First try memory cache
  const ticketData = memoryCache.get<TicketData>('component_verify_ticket');
  if (ticketData) {
    return ticketData;
  }

  // If not in memory, try file
  const credentials = loadCredentials();
  return credentials.component_verify_ticket;
}

/**
 * Save component verify ticket
 * @param ticketData The ticket data to save
 */
export function saveComponentVerifyTicket(ticketData: TicketData): void {
  // Save to memory cache
  memoryCache.set('component_verify_ticket', ticketData);

  // Save to file
  const credentials = loadCredentials();
  credentials.component_verify_ticket = ticketData;
  saveCredentials(credentials);
}

/**
 * Get component access token
 * @returns The token data or undefined
 */
export function getComponentAccessToken(): TokenData | undefined {
  const credentials = loadCredentials();
  return credentials.component_access_token;
}

/**
 * Save component access token
 * @param tokenData The token data to save
 */
export function saveComponentAccessToken(tokenData: TokenData): void {
  const credentials = loadCredentials();
  credentials.component_access_token = tokenData;
  saveCredentials(credentials);
}

/**
 * Get authorizer access token
 * @param authorizerAppId The authorizer appId
 * @returns The token data or undefined
 */
export function getAuthorizerAccessToken(authorizerAppId: string): TokenData | undefined {
  const credentials = loadCredentials();
  return credentials.authorizer_access_tokens?.[authorizerAppId];
}

/**
 * Save authorizer access token
 * @param authorizerAppId The authorizer appId
 * @param tokenData The token data to save
 */
export function saveAuthorizerAccessToken(authorizerAppId: string, tokenData: TokenData): void {
  const credentials = loadCredentials();
  if (!credentials.authorizer_access_tokens) {
    credentials.authorizer_access_tokens = {};
  }
  credentials.authorizer_access_tokens[authorizerAppId] = tokenData;
  saveCredentials(credentials);
}

/**
 * Get authorizer refresh token
 * @param authorizerAppId The authorizer appId
 * @returns The refresh token or undefined
 */
export function getAuthorizerRefreshToken(authorizerAppId: string): string | undefined {
  const credentials = loadCredentials();
  return credentials.authorizer_refresh_tokens?.[authorizerAppId];
}

/**
 * Save authorizer refresh token
 * @param authorizerAppId The authorizer appId
 * @param refreshToken The refresh token to save
 */
export function saveAuthorizerRefreshToken(authorizerAppId: string, refreshToken: string): void {
  const credentials = loadCredentials();
  if (!credentials.authorizer_refresh_tokens) {
    credentials.authorizer_refresh_tokens = {};
  }
  credentials.authorizer_refresh_tokens[authorizerAppId] = refreshToken;
  saveCredentials(credentials);
} 