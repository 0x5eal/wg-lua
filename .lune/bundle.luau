local fs = require("@lune/fs")
local stdio = require("@lune/stdio")
local task = require("@lune/task")

local terracotta = require("terracotta")

local LUAU_TYPES_PATH = "out/rbxts/init.luau"
local TS_TYPES_PATH = "out/rbxts/index.d.ts"

local function map<k, v>(tbl: { [k]: v }, callback: (k: k, v: v) -> v)
	for k, v in tbl do
		local ok, val = pcall(function()
			return callback(k, v)
		end)

		if not ok then
			tbl[k] = nil
		else
			tbl[k] = val
		end
	end

	return tbl
end

print("\n")

local dirChildren = fs.readDir("out/rbxts")
local ENTYRPOINTS = map(dirChildren, function(k, path)
	if path ~= "rbxts" and path:find("%.lua.?$") then
		print(`{k}/{#dirChildren} include`, path)
		return "out/rbxts/" .. path
	end

	print(`{k}/{#dirChildren} ignore`, path)
	error("not a lua file")
end)

function main()
	local bundleStart = os.clock()

	local out = terracotta.Build({
		entryPoints = ENTYRPOINTS,
		bundle = true,
		rules = {
			"remove_spaces",
			"remove_unused_while",
			"remove_unused_if_branch",
			"remove_empty_do",
		},
	})

	print(`\nbundled {#ENTYRPOINTS} files in {os.clock() - bundleStart}s`)

	local fsStart = os.clock()
	for pos, path in { table.unpack(ENTYRPOINTS), TS_TYPES_PATH } do
		local bundle = out[path]

		if path == LUAU_TYPES_PATH then
			bundle = fs.readFile(LUAU_TYPES_PATH)
		elseif path == TS_TYPES_PATH then
			bundle = fs.readFile(LUAU_TYPES_PATH)
		end

		path = "out/" .. path:split("/")[3]
		stdio.write(`\x1B[2K\r{pos}/{#ENTYRPOINTS} write {path}`)
		task.wait(1)

		fs.writeFile(path, bundle)
	end

	stdio.write(`\x1B[2K\rwrote {#ENTYRPOINTS} files in {os.clock() - fsStart}s\n`)
end

return main()
