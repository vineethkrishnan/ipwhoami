import { fetchJSON } from './base.js';

export const ipapi = {
  name: 'ipapi',
  displayName: 'ipapi.co',
  url: (ip) => `https://ipapi.co/${ip}/json`,

  async lookup(ip) {
    const data = await fetchJSON(this.url(ip));
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      org: data.org,
      location: data.latitude && data.longitude
        ? `${data.latitude}, ${data.longitude}`
        : undefined,
      timezone: data.timezone,
    };
  },
};
