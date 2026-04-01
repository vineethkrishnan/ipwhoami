const isTTY = process.stdout.isTTY;

function wrap(code) {
  return isTTY ? (s) => `\x1b[${code}m${s}\x1b[0m` : (s) => s;
}

export const bold = wrap('1');
export const dim = wrap('2');
export const cyan = wrap('36');
export const green = wrap('32');
export const red = wrap('31');
