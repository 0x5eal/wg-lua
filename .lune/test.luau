local process = require("@lune/process")
local fs = require("@lune/fs")
local stdio = require("@lune/stdio")

local OK = stdio.color("green")
	.. stdio.style("bold")
	.. " OK"
	.. stdio.style("reset")
	.. stdio.color("reset")
	.. "\n"
	.. ""
local FAILED = stdio.color("red")
	.. stdio.style("bold")
	.. " FAILED"
	.. stdio.style("reset")
	.. stdio.color("reset")
	.. "\n"

-- Adapted from https://github.com/4x8Matrix/Package-Index/blob/Master/.lune/type-check.luau#L10
local function execute(exe, ...): (boolean, string, string)
	local res = process.spawn(exe, { ... }, {
		stdio = "default",
	})

	return res.ok, res.stdout, res.stderr
end

function main()
	local results = {
		passed = 0,
		failed = 0,
	}

	for _, test in fs.readDir("tests/") do
		stdio.write(`Running wg::{test:gsub(".luau", "")}...`)

		local ok, _out, err = execute("lune", "run", "tests/" .. test)

		if ok then
			stdio.write(OK)
			results.passed += 1
		else
			stdio.write(FAILED)
			print(err:split("\n")[1])

			results.failed += 1
		end
	end

	print(`\nResults: passed: {results.passed}; failed: {results.failed}`)

	if results.failed > 0 then
		process.exit(1)
	end
end

return main()
