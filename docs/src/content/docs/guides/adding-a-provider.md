---
title: Adding a Provider
description: How to add a new geolocation provider to ipwhoami.
---

ipwhoami uses a provider pattern that makes adding new sources straightforward. Each provider is a single file that implements one method.

## Provider Interface

Every provider exports an object with:

```js
{
  name: 'provider-name',        // Used in CLI flag
  displayName: 'Provider Name', // Shown in output
  url: (ip) => '...',           // API endpoint

  async lookup(ip) {
    // Fetch data and return normalized result
    return {
      ip: '...',
      city: '...',
      region: '...',
      country: '...',
      org: '...',
      location: 'lat, lon',
      timezone: '...',
    };
  },
}
```

## Step-by-Step

### 1. Create the provider file

Create `src/providers/my-provider.js`:

```js
import { fetchJSON } from './base.js';

export const myProvider = {
  name: 'my-provider',
  displayName: 'myprovider.com',
  url: (ip) => `https://api.myprovider.com/${ip}`,

  async lookup(ip) {
    const data = await fetchJSON(this.url(ip));
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      org: data.organization,
      location: data.lat && data.lng
        ? `${data.lat}, ${data.lng}`
        : undefined,
      timezone: data.timezone,
    };
  },
};
```

The `fetchJSON` helper from `base.js` handles timeouts and error responses for you.

### 2. Register it

Open `src/providers/index.js` and add your provider:

```js
import { myProvider } from './my-provider.js';

const providers = new Map([
  ['ipinfo', ipinfo],
  ['ipapi', ipapi],
  ['ip-api', ipApiCom],
  ['my-provider', myProvider],  // Add this line
]);
```

### 3. Update config

Add the name to `PROVIDER_NAMES` in `src/config.js`:

```js
export const PROVIDER_NAMES = ['ipinfo', 'ipapi', 'ip-api', 'my-provider'];
```

### 4. Test it

```bash
node bin/ipwhoami.js -p my-provider 8.8.8.8
```

That's it. The new provider automatically works with compare mode, raw output, and all CLI flags.

## Guidelines

- Always return the **normalized shape** (all 7 fields). Use `undefined` for unavailable fields.
- Use `fetchJSON()` from `base.js` — it handles timeouts and HTTP errors.
- Map provider-specific field names to the standard names (e.g., `isp` -> `org`).
