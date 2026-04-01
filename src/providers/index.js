import { ipinfo } from './ipinfo.js';
import { ipapi } from './ipapi.js';
import { ipApiCom } from './ip-api.js';

const providers = new Map([
  ['ipinfo', ipinfo],
  ['ipapi', ipapi],
  ['ip-api', ipApiCom],
]);

export function getProvider(name) {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`unknown provider: ${name}. Available: ${[...providers.keys()].join(', ')}`);
  }
  return provider;
}

export function getAllProviders() {
  return [...providers.entries()].map(([name, provider]) => ({ name, provider }));
}
