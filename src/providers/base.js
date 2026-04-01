export async function fetchJSON(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`request to ${url} timed out.`);
    }
    throw new Error(`request to ${url} failed: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
}
