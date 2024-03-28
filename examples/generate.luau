local fs = require("@lune/fs")
local process = require("@lune/process")
local stdio = require("@lune/stdio")

local wg = require("../out").wireguard

local BASE64_PAT = "^[%w%+%/=]-=?%w=*$"
local CODEGEN_TEMPLATE = [[[Interface]
PrivateKey = %s
PublicKey = %s
Address = %s
DNS = %s

[Peer]
PublicKey = %s
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = %s
]]

function main()
	if process.args[1] == nil or process.args[1] == "" then
		print("USAGE: ./lunew example generate <output-file>")
		process.exit(1)
	end

	local outputFile = process.args[1]

	local opts = {
		privateKey = "",
		address = "",
		dns = "",
		peerPublicKey = "",
		peerEndpoint = "",
		peerAllowedIPs = "",
	}

	for opt, _ in opts do
		local resp: string? = stdio.prompt("text", opt)

		opts[opt] = resp
	end

	if opts.privateKey ~= "" and string.match(opts.privateKey, BASE64_PAT) then
		opts.publicKey = wg:generatePublicKey(opts.privateKey)
	else
		local keypair = wg:generateKeypair()
		opts.publicKey = keypair.publicKey
		opts.privateKey = keypair.privateKey
	end

	if opts.address == "" or opts.dns == "" or opts.peerPublicKey == "" or opts.peerEndpoint == "" then
		print("ERROR: address, dns, peerPublicKey, peerEndpoint are required")
		process.exit(1)
	end

	local generatedConfig = string.format(
		CODEGEN_TEMPLATE,
		opts.privateKey,
		opts.publicKey,
		opts.address,
		opts.dns,
		opts.peerPublicKey,
		opts.peerEndpoint
	)

	fs.writeFile(outputFile, generatedConfig)
	print("Generated config file: " .. outputFile)
end

return main()
