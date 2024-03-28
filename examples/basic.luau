local datetime = require("@lune/datetime")

local wg = require("../out").wireguard

function main()
	print(`{datetime.now():formatLocalTime()} | Generating keypair`)

	local start = os.clock()
	local keypair = wg:generateKeypair()

	print(`{datetime.now():formatLocalTime()} | Generated keypair in {os.clock() - start}s`)
	print("---------------------------------------------------------------")
	print(`Private Key: {keypair.privateKey}`)
	print(`Public Key: {keypair.publicKey}`)
end

return main()
