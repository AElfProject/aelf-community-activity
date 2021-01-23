export function shorten(input, max = 10, chars = 4) {
  const parsed = '' + input;
  if (!parsed) {
    throw Error(`Invalid input parameter '${input}'.`)
  }
  if (parsed.length <= max) {
    return parsed;
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(parsed.length - chars)}`
}

export function sleep(timestamp = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timestamp);
  });
}
