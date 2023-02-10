function pad(number: number): string {
  let r = String(number);
  if (r.length === 1) {
    r = '0' + r;
  }
  return r;
}

export function formatDateToISOString(datetime: Date): string {
  return (
    datetime.getFullYear() +
    '-' +
    pad(datetime.getMonth() + 1) +
    '-' +
    pad(datetime.getDate()) +
    'T' +
    pad(datetime.getHours()) +
    ':' +
    pad(datetime.getMinutes()) +
    ':' +
    pad(datetime.getSeconds()) +
    '.' +
    String((datetime.getMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
    'Z'
  );
}
