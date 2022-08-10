#!/bin/bash

dfx canister create icrc_1
dfx canister uninstall-code icrc_1
dfx build icrc_1

argument=$(cat init_args.txt | tr -s '\n' ' ')

dfx canister install --argument "($argument)" --wasm target/wasm32-unknown-unknown/release/icrc_1.wasm.gz icrc_1
