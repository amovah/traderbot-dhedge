import crypto from 'crypto';

export default function randomString() {
  return crypto.randomBytes(64).toString('hex');
}
