import { open } from 'maxmind';
import { stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const CITY_DB_PATH = join(DATA_DIR, 'dbip-city-lite.mmdb');
const ASN_DB_PATH = join(DATA_DIR, 'dbip-asn-lite.mmdb');

let cityReader = null;
let asnReader = null;
let dbLoadedAt = null;

export async function loadDatabases() {
  try {
    cityReader = await open(CITY_DB_PATH);
    asnReader = await open(ASN_DB_PATH);
    dbLoadedAt = new Date();
  } catch (err) {
    throw new Error(
      `Failed to load MMDB databases from ${DATA_DIR}. ` +
      `Run "npm run download-db" first. Original error: ${err.message}`
    );
  }
}

export function lookupCity(ip) {
  if (!cityReader) throw new Error('City database not loaded');
  return cityReader.get(ip);
}

export function lookupASN(ip) {
  if (!asnReader) throw new Error('ASN database not loaded');
  return asnReader.get(ip);
}

export async function getDatabaseMeta() {
  let cityModified = null;
  let asnModified = null;

  try {
    const cityStat = await stat(CITY_DB_PATH);
    cityModified = cityStat.mtime;
  } catch {}

  try {
    const asnStat = await stat(ASN_DB_PATH);
    asnModified = asnStat.mtime;
  } catch {}

  const oldestDb = cityModified && asnModified
    ? new Date(Math.min(cityModified.getTime(), asnModified.getTime()))
    : null;

  const ageHours = oldestDb
    ? Math.round((Date.now() - oldestDb.getTime()) / (1000 * 60 * 60))
    : null;

  return {
    loaded: !!cityReader && !!asnReader,
    loadedAt: dbLoadedAt,
    dbDate: oldestDb ? oldestDb.toISOString().split('T')[0] : null,
    dbAgeHours: ageHours,
  };
}
