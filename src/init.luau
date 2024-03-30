export type Keypair = {
	publicKey: string,
	privateKey: string,
}

export type Wireguard = {
	generateKeypair: (self: {}) -> Keypair,
	generatePublicKey: (self: {}, privateKey: { number }) -> string,
}

return {
	wireguard = require("./init.lua").wireguard :: Wireguard,
}
