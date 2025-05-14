import { sendMail } from './emailService.js';
import { generateOTPTemplate } from '../templates/emailTemplate.js';

const otpCache = new Map();
const OTP_TTL_MS = 60 * 60 * 1000; // 1 jam

export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function sendOTP(email) {
  otpCache.delete(email);

  const code = generateOTP();
  const expiresAt = Date.now() + OTP_TTL_MS;
  otpCache.set(email, { code, expiresAt });

  const html = generateOTPTemplate(code);
  await sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Reset Password OTP',
    html
  });

  return { email, expiresAt };
}

export function verifyOTP(email, code) {
  const record = otpCache.get(email);
  if (!record) throw new Error('OTP tidak ditemukan atau telah kedaluwarsa');
  if (Date.now() > record.expiresAt) {
    otpCache.delete(email);
    throw new Error('OTP telah kedaluwarsa');
  }
  if (record.code !== code) throw new Error('OTP tidak valid');
  otpCache.delete(email);
  return true;
}
