const { toBinary, getCharAt } = require<{
	toBinary: (int: number) => string;
	getCharAt: (str: string, pos: number) => string;
}>("./util.lua");

const BASE64_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Adapted from https://gist.github.com/jonleighton/958841
export function encode(buf: number[]): string {
	let base64 = "";

	const byteLength = buf.size();
	const byteRemainder = byteLength % 3;
	const mainLength = byteLength - byteRemainder;

	let a: number, b: number, c: number, d: number;
	let chunk;

	// Main loop deals with bytes in chunks of 3
	for (let i = 0; i < mainLength; i = i + 3) {
		// Combine the three bytes into a single integer
		chunk = (buf[i] << 16) | (buf[i + 1] << 8) | buf[i + 2];

		// Use bitmasks to extract 6-bit segments from the triplet
		a = (chunk & 16515072) >> 18;
		b = (chunk & 258048) >> 12;
		c = (chunk & 4032) >> 6;
		d = chunk & 63;

		// Convert the raw binary segments to the appropriate ASCII encoding
		base64 +=
			string.char(string.byte(BASE64_CHAR, a + 1)[0]) +
			string.char(string.byte(BASE64_CHAR, b + 1)[0]) +
			string.char(string.byte(BASE64_CHAR, c + 1)[0]) +
			string.char(string.byte(BASE64_CHAR, d + 1)[0]);
	}

	// Deal with the remaining bytes and padding
	if (byteRemainder === 1) {
		chunk = buf[mainLength];

		a = (chunk & 252) >> 2;

		// Set the 4 least significant bits to zero
		b = (chunk & 3) << 4;

		base64 += string.byte(BASE64_CHAR, a)[0] + string.byte(BASE64_CHAR, b)[0] + "==";
	} else if (byteRemainder === 2) {
		chunk = (buf[mainLength] << 8) | buf[mainLength + 1];

		a = (chunk & 64512) >> 10;
		b = (chunk & 1008) >> 4;

		// Set the 2 least significant bits to zero
		c = (chunk & 15) << 2;

		base64 +=
			string.char(string.byte(BASE64_CHAR, a + 1)[0]) +
			string.char(string.byte(BASE64_CHAR, b + 1)[0]) +
			string.char(string.byte(BASE64_CHAR, c + 1)[0]) +
			"=";
	}

	return base64;
}

// FIXME: Ideally, you'd want to use bit math and mask off bytes and stuff,
// but I'm lazy, so this logic uses string manipulation instead
export function decode(base64: string): number[] {
	// Strip padding from base64
	base64 = base64.split("=")[0].gsub("%s", "")[0];

	// Convert base64 chars to lookup table offsets
	const chars = [];
	for (let i = 1; i <= base64.size(); i++) {
		const char = getCharAt(base64, i);
		const [pos] = string.find(BASE64_CHAR, char);

		pos !== undefined ? chars.push(pos - 1) : error("invalid base64 data");
	}

	// Convert offsets to 6 bit binary numbers
	const bin = chars.map(toBinary);

	// Combine all binary numbers into one
	let combinedBin = "";
	bin.forEach((b) => (combinedBin += b));

	// Split the combined binary number into smaller ones of 8 bits each
	const intermediaryBin = [];
	while (combinedBin.size() > 0) {
		intermediaryBin.push(string.sub(combinedBin, 1, 8));
		combinedBin = string.sub(combinedBin, 9, combinedBin.size());
	}

	// Convert each individual 8 bit binary number to a base 10 integer
	const decoded = [];
	for (let i = 0; i < intermediaryBin.size() - 1; i++) {
		const byte = tonumber(intermediaryBin[i], 2);
		decoded.push(byte !== undefined ? byte : error("got invalid byte while decoding base64"));
	}

	return decoded;
}
