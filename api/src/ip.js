const IPV4_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

export function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') return false;
  return IPV4_REGEX.test(ip) || ip.includes(':');
}

export function extractClientIP(c) {
  // Proxy/CDN headers (most specific first)
  const cfIP = c.req.header('cf-connecting-ip');
  if (cfIP) return cfIP.trim();

  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIP = c.req.header('x-real-ip');
  if (realIP) return realIP.trim();

  // Fly.io header
  const flyIP = c.req.header('fly-client-ip');
  if (flyIP) return flyIP.trim();

  // Direct socket (Hono/Node)
  const addr = c.env?.incoming?.socket?.remoteAddress;
  if (addr) return addr.replace('::ffff:', '');

  return null;
}
