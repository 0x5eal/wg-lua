export type Keypair = {
	publicKey: string,
	privateKey: string,
}

export type Wireguard = {
	generateKeypair: (self: {}) -> Keypair,
	generatePrivateKey: (self: {}, privateKey: { number }) -> string,
}

return {
	wireguard = require("./init.lua").wireguard :: Wireguard,
}
