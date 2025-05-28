import config from '@/config';
import CryptoJS from 'crypto-js';

/**
 * 生成HMAC签名
 * @param secretKey - 密钥
 * @param dataToSign - 待签名数据
 * @returns 返回base64编码的签名
 */
export function generateSignature(data: string): string {
    // 生成 HMAC-SHA256 哈希
    const hmac = CryptoJS.HmacSHA256(data, config.appSecret);

    // 转换为Base64格式
    return CryptoJS.enc.Base64.stringify(hmac);
}