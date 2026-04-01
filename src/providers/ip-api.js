import { fetchJSON } from './base.js';

export const ipApiCom = {
  name: 'ip-api',
  displayName: 'ip-api.com',
  url: (ip) => `http://ip-api.com/json/${ip}`,

  async lookup(ip) {
    const data = await fetchJSON(this.url(ip));
    return {
      ip: data.query,
      city: data.city,
      region: data.regionName,
      country: data.country,
      org: data.isp,
      location: data.lat && data.lon
        ? `${data.lat}, ${data.lon}`
        : undefined,
      timezone: data.timezone,
    };
  },
};
