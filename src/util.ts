const OCTAL_LOOKUP = ["000", "001", "010", "011", "100", "101", "110", "111"];

export function toBinary(int: number): string {
	let bin = string.format("%o", int);
	bin = bin.gsub(
		".",
		(b: string) =>
			OCTAL_LOOKUP[
				(() => {
					const [ok, val] = pcall<[], number>(() => {
						const res = tonumber(b);

						if (typeIs(res, "nil")) {
							error("failed to convert to binary");
						}

						return res;
					});

					return ok ? val : error(val);
				})()
			],
	)[0];

	// Pad to ensure the binary number is 6 bits
	bin = "0".rep(6 - bin.size()) + bin;

	return bin;
}

export function getCharAt(str: string, pos: number): string {
	return string.char(str.byte(pos)[0]);
}
