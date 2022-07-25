import crypto from "crypto";

export const KEY = '2d9c9d9025b0b76bfd1253ce000d053dbc1bd787c383ed7e546f266f32b5e611';
export const IV = '9b9febeed53fdc35dde8324417e1eddb';

// Decrypting text
export function decrypt(value: Buffer, key: string, iv: string) : Buffer {
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, "hex"), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(value);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}
