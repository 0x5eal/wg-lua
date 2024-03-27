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
		const privateKey = generatePrivateKey();
		const publicKey = generatePublicKey(privateKey);

		return {
			publicKey: atob(publicKey),
			privateKey: atob(privateKey),
		};
	},

	generatePublicKey: function (privateKey) {
		return atob(generatePublicKey(privateKey));
	},
};
