local wg = require("../out/").wireguard

local BASE64_PAT = "^[%w%+%/=]-=?%w=*$"

local keypair = wg:generateKeypair()

assert(#keypair.publicKey == 44, "expected public key to be 44 bytes")
assert(#keypair.privateKey == 44, "expected private key to be 44 bytes")

assert(keypair.privateKey:match(BASE64_PAT), "expected private key to be base64 encoded")
assert(keypair.publicKey:match(BASE64_PAT), "expected public key to be base64 encoded")
