local wg = require("../out/").wireguard

local PRIVATE_KEY = {
	[1] = 208,
	[2] = 109,
	[3] = 43,
	[4] = 223,
	[5] = 41,
	[6] = 233,
	[7] = 180,
	[8] = 88,
	[9] = 228,
	[10] = 1,
	[11] = 132,
	[12] = 145,
	[13] = 79,
	[14] = 164,
	[15] = 143,
	[16] = 199,
	[17] = 134,
	[18] = 67,
	[19] = 153,
	[20] = 226,
	[21] = 151,
	[22] = 39,
	[23] = 198,
	[24] = 16,
	[25] = 30,
	[26] = 109,
	[27] = 90,
	[28] = 11,
	[29] = 22,
	[30] = 4,
	[31] = 217,
	[32] = 105,
}
local PUBLIC_KEY = "mYqWwJuiVXsXqfqXOKOKVTTZRovUXqzPkRtz1DwX1Wc="

local publicKey = wg:generatePublicKey(PRIVATE_KEY)

assert(#publicKey == 44, "expected public key to be 44 bytes")
assert(publicKey == PUBLIC_KEY, "expected the correct public key")
