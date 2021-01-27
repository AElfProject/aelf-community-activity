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

export function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const string = '?' + window.location.href.split('?')[1];
  var results = regex.exec(string);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
