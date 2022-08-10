import { Principal } from '@dfinity/principal';
import { run_tests, Test } from 'azle/test';
import { createActor } from './dfx_generated/icrc_1';

const icrc_1_canister = createActor('rrkah-fqaaa-aaaaa-aaaaq-cai', {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

const tests: Test[] = [
    {
        name: 'icrc1_balance_of aaaaa-aa.0',
        test: async () => {
            const result = await icrc_1_canister.icrc1_balance_of({
                owner: Principal.fromText('aaaaa-aa'),
                subaccount: []
            });

            return {
                ok: result === 1n
            };
        }
    },
    {
        name: 'icrc1_balance_of aaaaa-aa.1',
        test: async () => {
            const result = await icrc_1_canister.icrc1_balance_of({
                owner: Principal.fromText('aaaaa-aa'),
                subaccount: [[0, 0, 0, 1]]
            });

            return {
                ok: result === 2n
            };
        }
    },
    {
        name: 'icrc1_balance_of aaaaa-aa.2',
        test: async () => {
            const result = await icrc_1_canister.icrc1_balance_of({
                owner: Principal.fromText('aaaaa-aa'),
                subaccount: [[0, 0, 0, 2]]
            });

            return {
                ok: result === 3n
            };
        }
    },
    {
        name: 'icrc1_balance_of aaaaa-aa.3',
        test: async () => {
            const result = await icrc_1_canister.icrc1_balance_of({
                owner: Principal.fromText('aaaaa-aa'),
                subaccount: [[0, 0, 0, 3]]
            });

            return {
                ok: result === 4n
            };
        }
    },
    {
        name: 'icrc1_decimals',
        test: async () => {
            const result = await icrc_1_canister.icrc1_decimals();

            return {
                ok: result === 8
            };
        }
    },
    {
        name: 'icrc1_fee',
        test: async () => {
            const result = await icrc_1_canister.icrc1_fee();

            return {
                ok: result === 0n
            };
        }
    },
    {
        name: 'icrc1_metadata',
        test: async () => {
            const result_decimals = await icrc_1_canister.icrc1_decimals();
            const result_fee = await icrc_1_canister.icrc1_fee();
            const result_name = await icrc_1_canister.icrc1_name();
            const result_symbol = await icrc_1_canister.icrc1_symbol();

            const result_metadata = await icrc_1_canister.icrc1_metadata();

            return {
                ok:
                    result_metadata[0][0] === 'icrc1:decimals' &&
                    'Nat' in result_metadata[0][1] &&
                    result_metadata[0][1].Nat === BigInt(result_decimals) &&
                    result_metadata[1][0] === 'icrc1:fee' &&
                    'Nat' in result_metadata[1][1] &&
                    result_metadata[1][1].Nat === result_fee &&
                    result_metadata[2][0] === 'icrc1:name' &&
                    'Text' in result_metadata[2][1] &&
                    result_metadata[2][1].Text === result_name &&
                    result_metadata[3][0] === 'icrc1:symbol' &&
                    'Text' in result_metadata[3][1] &&
                    result_metadata[3][1].Text === result_symbol
            };
        }
    },
    {
        name: 'icrc1_minting_account',
        test: async () => {
            const result = await icrc_1_canister.icrc1_minting_account();

            return {
                ok: result.length === 0
            };
        }
    },
    {
        name: 'icrc1_name',
        test: async () => {
            const result = await icrc_1_canister.icrc1_name();

            return {
                ok: result === 'Azle'
            };
        }
    },
    {
        name: 'icrc1_supported_standards',
        test: async () => {
            const result = await icrc_1_canister.icrc1_supported_standards();

            return {
                ok:
                    result[0].name === 'ICRC-1' &&
                    result[0].url === 'https://github.com/dfinity/ICRC-1'
            };
        }
    },
    {
        name: 'icrc1_symbol',
        test: async () => {
            const result = await icrc_1_canister.icrc1_symbol();

            return {
                ok: result === 'AZLE'
            };
        }
    },
    {
        name: 'icrc1_total_supply',
        test: async () => {
            const result = await icrc_1_canister.icrc1_total_supply();

            return {
                ok: result === 0n
            };
        }
    }
];

run_tests(tests);
