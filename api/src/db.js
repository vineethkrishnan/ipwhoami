import { open } from 'maxmind';
import { stat, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

let cityReader = null;
let asnReader = null;
let cityDbPath = null;
let asnDbPath = null;
let dbLoadedAt = null;

async function findMMDB(pattern) {
  try {
    const files = await readdir(DATA_DIR);
    const match = files.find((f) => f.endsWith('.mmdb') && f.includes(pattern));
    return match ? join(DATA_DIR, match) : null;
  } catch {
    return null;
  }
}

export async function loadDatabases() {
  cityDbPath = await findMMDB('city');
  asnDbPath = await findMMDB('asn');

  if (!cityDbPath) {
    throw new Error(
      `No city MMDB file found in ${DATA_DIR}. ` +
      `Run "npm run download-db" or place a *city*.mmdb file in api/data/.`
    );
  }

  try {
    cityReader = await open(cityDbPath);
    if (asnDbPath) asnReader = await open(asnDbPath);
    dbLoadedAt = new Date();
  } catch (err) {
    throw new Error(
      `Failed to load MMDB databases from ${DATA_DIR}. ` +
      `Original error: ${err.message}`
    );
  }

  const asnStatus = asnReader ? 'loaded' : 'not found (org field will be empty)';
  console.log(`  City DB: ${cityDbPath}`);
  console.log(`  ASN DB:  ${asnStatus}`);
}

export function lookupCity(ip) {
  if (!cityReader) throw new Error('City database not loaded');
  return cityReader.get(ip);
}

export function lookupASN(ip) {
  if (!asnReader) return null;
  return asnReader.get(ip);
}

export async function getDatabaseMeta() {
  let cityModified = null;
  let asnModified = null;

  try {
    if (cityDbPath) cityModified = (await stat(cityDbPath)).mtime;
  } catch {}

  try {
    if (asnDbPath) asnModified = (await stat(asnDbPath)).mtime;
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
