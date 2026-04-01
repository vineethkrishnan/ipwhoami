import { fetchJSON } from './base.js';

export const ipinfo = {
  name: 'ipinfo',
  displayName: 'ipinfo.io',
  url: (ip) => `https://ipinfo.io/${ip}/json`,

  async lookup(ip) {
    const data = await fetchJSON(this.url(ip));
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      org: data.org,
      location: data.loc,
      timezone: data.timezone,
    };
  },
};
