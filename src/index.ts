const { generatePrivateKey, generatePublicKey } = require<{
	generatePrivateKey: () => number[];
	generatePublicKey: (privateKey: string | number[]) => number[];
}>("./wg.lua");
const base64 = require<{
	encode: (buf: number[]) => string;
	decode: (base64: string) => number[];
}>("./base64.lua");

export interface Keypair {
	publicKey: string;
	privateKey: string;
}

export interface Wireguard {
	generateKeypair(): Keypair;
	generatePublicKey(privateKey: number[] | string): string;
}

export const wireguard: Wireguard = {
	generateKeypair: function () {
		const [privateKeyOk, privateKey] = pcall<[], number[]>(() => generatePrivateKey());
		const [publicKeyOk, publicKey] = privateKeyOk
			? pcall<[], number[]>(() => generatePublicKey(privateKey))
			: error("failed to generate private key");
		return {
			publicKey: base64.encode(publicKeyOk ? publicKey : error("failed to generate public key")),
			privateKey: base64.encode(privateKey as number[]),
		};
	},

	generatePublicKey: function (privateKey) {
		if (typeIs(privateKey, "string")) {
			privateKey = base64.decode(privateKey);
		}

		const [publicKeyOk, publicKey] = pcall<[], number[]>(() => generatePublicKey(privateKey));

		return base64.encode(
			publicKeyOk ? publicKey : error("failed to generate public key %s".format(publicKey as string)),
		);
	},
};
