local wg = require("../out/").wireguard

local PRIVATE_KEY = "iIWrphmeEnCLZFjdN17RQfEq8ND1MX+qAdIpRJdRhEA="
local PUBLIC_KEY = "lYnVoKy9rzIapS0zPoLHskf4B+L3FouFXWwddKhRa3s="

local publicKey = wg:generatePublicKey(PRIVATE_KEY)

assert(#publicKey == 44, "expected public key to be 44 bytes")
assert(publicKey == PUBLIC_KEY, "expected the correct public key")
