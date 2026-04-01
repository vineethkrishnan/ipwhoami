import { bold, cyan, dim } from './colors.js';

const FIELDS = [
  ['IP', 'ip'],
  ['City', 'city'],
  ['Region', 'region'],
  ['Country', 'country'],
  ['Org', 'org'],
  ['Location', 'location'],
  ['Timezone', 'timezone'],
];

export function formatResult(providerName, result) {
  const lines = [cyan(bold(`[${providerName}]`))];

  for (const [label, key] of FIELDS) {
    const value = result[key] || 'n/a';
    lines.push(`  ${label.padEnd(10)} ${value}`);
  }

  return lines.join('\n');
}

export function formatRaw(result) {
  return JSON.stringify(result, null, 2);
}

export function formatCompareHeader(ip) {
  return [
    `${bold('Comparing geolocation for:')} ${ip}`,
    dim('\u2500'.repeat(40)),
  ].join('\n');
}
