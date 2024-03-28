const { generatePrivateKey, generatePublicKey } = require<{
	generatePrivateKey: () => number[];
	generatePublicKey: (privateKey: number[]) => number[];
}>("wg");
const { atob } = require<{ atob: (buf: number[]) => string }>("base64");

export interface Keypair {
	publicKey: string;
	privateKey: string;
}

export interface Wireguard {
	generateKeypair(): Keypair;
	generatePublicKey(privateKey: number[]): string;
}

export const wireguard: Wireguard = {
	generateKeypair: function () {
		const [privateKeyOk, privateKey] = pcall<[], number[]>(() => generatePrivateKey());
		const [publicKeyOk, publicKey] = privateKeyOk
			? pcall<[], number[]>(() => generatePublicKey(privateKey))
			: error("failed to generate private key");
		return {
			publicKey: atob(publicKeyOk ? publicKey : error("failed to generate public key")),
			privateKey: atob(privateKey as number[]),
		};
	},

	generatePublicKey: function (privateKey) {
		const [publicKeyOk, publicKey] = pcall<[], number[]>(() => generatePublicKey(privateKey));

		return atob(publicKeyOk ? publicKey : error("failed to generate public key"));
	},
};
