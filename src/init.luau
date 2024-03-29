export type Keypair = {
	publicKey: string,
	privateKey: string,
}

export type Wireguard = {
	generateKeypair: () -> Keypair,
	generatePrivateKey: (privateKey: { number }) -> string,
}

return {
	wireguard = require("./init.lua") :: Wireguard,
}
