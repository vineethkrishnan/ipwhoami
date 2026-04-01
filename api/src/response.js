export function normalizeResult(ip, cityResult, asnResult) {
  const city = cityResult?.city?.names?.en || null;
  const region = cityResult?.subdivisions?.[0]?.names?.en || null;
  const countryCode = cityResult?.country?.iso_code || null;
  const countryName = cityResult?.country?.names?.en || null;
  const lat = cityResult?.location?.latitude;
  const lon = cityResult?.location?.longitude;
  const timezone = cityResult?.location?.time_zone || null;
  const postal = cityResult?.postal?.code || null;
  const accuracyRadius = cityResult?.location?.accuracy_radius || null;

  const asnNumber = asnResult?.autonomous_system_number || null;
  const asnOrg = asnResult?.autonomous_system_organization || null;
  const org = asnNumber && asnOrg ? `AS${asnNumber} ${asnOrg}` : asnOrg || null;

  const location = (lat != null && lon != null)
    ? `${lat}, ${lon}`
    : null;

  return {
    ip,
    city,
    region,
    country: countryCode,
    country_name: countryName,
    org,
    location,
    timezone,
    postal,
    accuracy_radius: accuracyRadius,
    provider: 'ipwhoami',
  };
}
