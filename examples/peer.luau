local wg = require("../out").wireguard

local CODEGEN_TEMPLATE = [[[NetDev]
Name=wg0
Kind=wireguard

[WireGuard]
PrivateKey = %s
# PublicKey = %s
ListenPort = 51820

[WireGuardPeer]
PublicKey = %s
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25]]

function main()
	local bob = wg:generateKeypair()
	local alice = wg:generateKeypair()

	local bob_config = CODEGEN_TEMPLATE:format(bob.privateKey, bob.publicKey, alice.publicKey)
	local alice_config = CODEGEN_TEMPLATE:format(alice.privateKey, alice.publicKey, bob.publicKey)

	print("########################## BOB'S CONFIG ##########################")
	print(bob_config)
	print("##################################################################")

	print()

	print("######################### ALICE'S CONFIG #########################")
	print(alice_config)
	print("##################################################################")
end

return main()
