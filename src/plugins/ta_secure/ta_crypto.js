// cryptoUtils.js
import CryptoJS from 'crypto-js';

/**
 * SHA256 hash, hasil base64
 */
export function sha256Base64(data) {
  const hash = CryptoJS.SHA256(data);
  return CryptoJS.enc.Base64.stringify(hash);
}

/**
 * HMAC SHA256, key dalam base64, hasil base64
 */
export function hmacSha256Base64(base64Key, data64) {
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const data = CryptoJS.enc.Base64.parse(data64);
  const hmac = CryptoJS.HmacSHA256(data, key);
  return CryptoJS.enc.Base64.stringify(hmac);
}

/**
 * AES256 encrypt
 * key base64, return { ivHex, encryptedBase64 }
 */
export function aes256Encrypt(data64, base64Key) {
  const data = CryptoJS.enc.Base64.parse(data64);
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv, 
    mode: CryptoJS.mode.CBC, 
    padding: CryptoJS.pad.Pkcs7 
  });
  return {
    ivHex: iv.toString(CryptoJS.enc.Hex),
    // encryptedBase64: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    encryptedBase64: CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  };
}

/**
 * AES256 decrypt
 * ivHex string, encryptedBase64 string, key base64
 */
export function aes256Decrypt(ivHex,encryptedBase64, base64Key) {
  const key = CryptoJS.enc.Base64.parse(base64Key);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(encryptedBase64)
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
