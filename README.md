<img align="right" src="https://www.wireguard.com/img/icons/favicon-256.png" />

# wg-lua

A lua implementation of the wireguard keygen algorithm.

```lua
local wg = require("wg").wireguard
local keypair = wg:generateKeypair()

print("Public Key: ", keypair.publicKey)
print("Private Key: ", keypair.privateKey)

print(wg:generatePublicKey(keypair.privateKey))
```
## Methods

- #### Wireguard:generateKeypair() -> { publicKey: string, privateKey: string }
    > Generates a wireguard keypair consisting of a public and private key.
- #### Wireguard:generatePublicKey(privateKey: number[]) -> string
    > Generates a wireguard public key, given a private key.

## Development

To get started, install the required dependencies with:
```console
aftman install
pnpm i
```
Run tests with:
```console
pnpm test
```

Run any luau file with:
```console
./lunew <path>
```

Run an example with:

```console
./lunew example <example-name>
```
```
