import { SELF_IP_URL } from './config.js';

const IPV4_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

export function validateIP(ip) {
  if (IPV4_REGEX.test(ip) || ip.includes(':')) {
    return true;
  }
  throw new Error(`invalid IP address: ${ip}`);
}

export async function getPublicIP() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(SELF_IP_URL, { signal: controller.signal });
    const text = (await res.text()).trim();
    if (!text) {
      throw new Error('got empty response when fetching public IP.');
    }
    return text;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('timed out fetching your public IP. Check your internet connection.');
    }
    throw new Error(`failed to fetch your public IP: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
}
