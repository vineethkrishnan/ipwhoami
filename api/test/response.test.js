import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeResult } from '../src/response.js';

describe('normalizeResult', () => {
  it('normalizes a full city + ASN result', () => {
    const city = {
      city: { names: { en: 'Mountain View' } },
      subdivisions: [{ names: { en: 'California' } }],
      country: { iso_code: 'US', names: { en: 'United States' } },
      location: { latitude: 37.4056, longitude: -122.0775, time_zone: 'America/Los_Angeles', accuracy_radius: 1000 },
      postal: { code: '94043' },
    };
    const asn = {
      autonomous_system_number: 15169,
      autonomous_system_organization: 'Google LLC',
    };

    const result = normalizeResult('8.8.8.8', city, asn);

    assert.equal(result.ip, '8.8.8.8');
    assert.equal(result.city, 'Mountain View');
    assert.equal(result.region, 'California');
    assert.equal(result.country, 'US');
    assert.equal(result.country_name, 'United States');
    assert.equal(result.org, 'AS15169 Google LLC');
    assert.equal(result.location, '37.4056, -122.0775');
    assert.equal(result.timezone, 'America/Los_Angeles');
    assert.equal(result.postal, '94043');
    assert.equal(result.accuracy_radius, 1000);
    assert.equal(result.provider, 'ipwhoami');
  });

  it('handles missing ASN', () => {
    const city = {
      city: { names: { en: 'London' } },
      country: { iso_code: 'GB', names: { en: 'United Kingdom' } },
      location: { latitude: 51.5, longitude: -0.12 },
    };

    const result = normalizeResult('1.2.3.4', city, null);
    assert.equal(result.city, 'London');
    assert.equal(result.org, null);
    assert.equal(result.provider, 'ipwhoami');
  });

  it('handles missing city data', () => {
    const city = {
      country: { iso_code: 'DE', names: { en: 'Germany' } },
    };

    const result = normalizeResult('5.6.7.8', city, null);
    assert.equal(result.city, null);
    assert.equal(result.region, null);
    assert.equal(result.country, 'DE');
    assert.equal(result.location, null);
  });

  it('handles null city result', () => {
    const result = normalizeResult('0.0.0.0', null, null);
    assert.equal(result.ip, '0.0.0.0');
    assert.equal(result.city, null);
    assert.equal(result.country, null);
    assert.equal(result.provider, 'ipwhoami');
  });

  it('formats location with both lat and lon', () => {
    const city = { location: { latitude: 0, longitude: 0 } };
    const result = normalizeResult('1.1.1.1', city, null);
    assert.equal(result.location, '0, 0');
  });

  it('returns null location when lat or lon missing', () => {
    const city = { location: { latitude: 37.4 } };
    const result = normalizeResult('1.1.1.1', city, null);
    assert.equal(result.location, null);
  });

  it('formats ASN org with number prefix', () => {
    const asn = {
      autonomous_system_number: 13335,
      autonomous_system_organization: 'Cloudflare Inc',
    };
    const result = normalizeResult('1.1.1.1', {}, asn);
    assert.equal(result.org, 'AS13335 Cloudflare Inc');
  });

  it('handles ASN with org but no number', () => {
    const asn = {
      autonomous_system_number: null,
      autonomous_system_organization: 'Unknown ISP',
    };
    const result = normalizeResult('1.1.1.1', {}, asn);
    assert.equal(result.org, 'Unknown ISP');
  });
});
