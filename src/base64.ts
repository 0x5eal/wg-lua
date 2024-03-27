const { slice } = require<{
  slice: <T extends defined>(arr: T[], start: number, stop?: number) => T[];
}>("util");

function stringToBytes(str: string) {
  let result = [];

  for (let i = 0; i < str.size(); i++) {
    result.push(string.byte(str, i + 1)[0]);
  }

  return result;
}

// Adapted from https://github.com/un-ts/ab64/blob/main/src/ponyfill.ts#L24
const _atob = (asc: string) => {
  const b64CharList =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  const b64Chars = string.split(b64CharList, "");

  const b64Table = b64Chars.reduce<Record<string, number>>(
    (acc, char, index) => {
      acc[char] = index;
      return acc;
    },
    {}
  );

  const fromCharCode = string.char;

  asc = string.gsub(asc, "%s+", "")[0];
  asc += string.char(...slice(stringToBytes("=="), 2 - (asc.size() & 3)));

  let u24: number;
  let binary = "";
  let r1: number;
  let r2: number;

  for (let i = 0; i < asc.size(); ) {
    u24 =
      (b64Table[string.byte(asc, i++)[0]] << 18) |
      (b64Table[string.byte(asc, i++)[0]] << 12) |
      ((r1 = b64Table[string.byte(asc, i++)[0]]) << 6) |
      (r2 = b64Table[string.byte(asc, i++)[0]]);
    binary +=
      r1 === 64
        ? fromCharCode((u24 >> 16) & 255)
        : r2 === 64
        ? fromCharCode((u24 >> 16) & 255, (u24 >> 8) & 255)
        : fromCharCode((u24 >> 16) & 255, (u24 >> 8) & 255, u24 & 255);
  }

  return binary;
};

// Adapted from https://gist.github.com/jonleighton/958841
export function atob(buf: number[]): string {
  let base64 = "";
  let encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  let byteLength = buf.size();
  let byteRemainder = byteLength % 3;
  let mainLength = byteLength - byteRemainder;

  let a: number, b: number, c: number, d: number;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (buf[i] << 16) | (buf[i + 1] << 8) | buf[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 +=
      string.char(string.byte(encodings, a + 1)[0]) +
      string.char(string.byte(encodings, b + 1)[0]) +
      string.char(string.byte(encodings, c + 1)[0]) +
      string.char(string.byte(encodings, d + 1)[0]);
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = buf[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 +=
      string.byte(encodings, a)[0] + string.byte(encodings, b)[0] + "==";
  } else if (byteRemainder === 2) {
    chunk = (buf[mainLength] << 8) | buf[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 +=
      string.char(string.byte(encodings, a + 1)[0]) +
      string.char(string.byte(encodings, b + 1)[0]) +
      string.char(string.byte(encodings, c + 1)[0]) +
      "=";
  }

  return base64;
}
