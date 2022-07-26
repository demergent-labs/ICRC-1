// TODO Start using the official test suite once it is out

import { Principal } from '@dfinity/principal';
import { run_tests, Test } from 'azle/test';
import { createActor } from './dfx_generated/icrc_1';
import { get_identity } from './identities';

const icrc_1_canister = createActor('rrkah-fqaaa-aaaaa-aaaaq-cai', {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

const tests: Test[] = [
    ...get_intial_state_tests(),
    ...get_mint_tests(),
    ...get_burn_tests(),
    ...get_transfer_tests()
];

run_tests(tests);

function get_intial_state_tests(): Test[] {
    return [
        {
            name: 'icrc1_balance_of jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae.0',
            test: async () => {
                const result = await icrc_1_canister.icrc1_balance_of({
                    owner: Principal.fromText(
                        'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                    ),
                    subaccount: []
                });

                return {
                    ok: result === 100_000_000n
                };
            }
        },
        {
            name: 'icrc1_balance_of jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae.1',
            test: async () => {
                const result = await icrc_1_canister.icrc1_balance_of({
                    owner: Principal.fromText(
                        'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                    ),
                    subaccount: [[0, 0, 0, 1]]
                });

                return {
                    ok: result === 200_000_000n
                };
            }
        },
        {
            name: 'icrc1_balance_of 5g453-ogeid-pywgl-dn7nj-aiq5z-xohmn-4kbna-lyyot-ry5cp-5wcw4-kae.0',
            test: async () => {
                const result = await icrc_1_canister.icrc1_balance_of({
                    owner: Principal.fromText(
                        '5g453-ogeid-pywgl-dn7nj-aiq5z-xohmn-4kbna-lyyot-ry5cp-5wcw4-kae'
                    ),
                    subaccount: []
                });

                return {
                    ok: result === 300_000_000n
                };
            }
        },
        {
            name: 'icrc1_balance_of 5g453-ogeid-pywgl-dn7nj-aiq5z-xohmn-4kbna-lyyot-ry5cp-5wcw4-kae.1',
            test: async () => {
                const result = await icrc_1_canister.icrc1_balance_of({
                    owner: Principal.fromText(
                        '5g453-ogeid-pywgl-dn7nj-aiq5z-xohmn-4kbna-lyyot-ry5cp-5wcw4-kae'
                    ),
                    subaccount: [[0, 0, 0, 1]]
                });

                return {
                    ok: result === 400_000_000n
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
                    ok:
                        result.length === 1 &&
                        result[0].owner.toText() ===
                            'jkpmw-aav35-wxvb3-lanyp-62lqw-fmtwc-cvqc3-jcn7p-6jtrt-x7csr-rae'
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
                const result =
                    await icrc_1_canister.icrc1_supported_standards();

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
                    ok: result === 1_000_000_000n
                };
            }
        }
    ];
}

function get_mint_tests(): Test[] {
    return [
        {
            name: 'mint',
            test: async () => {
                const minting_identity = get_identity('test_identity_0');

                const icrc_1_canister_minting_identity = createActor(
                    'rrkah-fqaaa-aaaaa-aaaaq-cai',
                    {
                        agentOptions: {
                            host: 'http://127.0.0.1:8000',
                            identity: minting_identity
                        }
                    }
                );

                const total_supply_result_before =
                    await icrc_1_canister.icrc1_total_supply();

                const balance_result_before =
                    await icrc_1_canister.icrc1_balance_of({
                        owner: Principal.fromText(
                            'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                        ),
                        subaccount: []
                    });

                const mint_result =
                    await icrc_1_canister_minting_identity.icrc1_transfer({
                        amount: 100_000_000n,
                        created_at_time: [],
                        fee: [],
                        from_subaccount: [],
                        memo: [],
                        to: {
                            owner: Principal.fromText(
                                'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                            ),
                            subaccount: []
                        }
                    });

                const total_supply_result_after =
                    await icrc_1_canister.icrc1_total_supply();

                const balance_result_after =
                    await icrc_1_canister.icrc1_balance_of({
                        owner: Principal.fromText(
                            'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                        ),
                        subaccount: []
                    });

                return {
                    ok:
                        'Ok' in mint_result &&
                        mint_result.Ok === 100_000_000n &&
                        total_supply_result_before + 100_000_000n ===
                            total_supply_result_after &&
                        balance_result_before + 100_000_000n ===
                            balance_result_after
                };
            }
        }
    ];
}

function get_burn_tests(): Test[] {
    return [
        {
            name: 'burn',
            test: async () => {
                const test_identity_1 = get_identity('test_identity_1');

                const icrc_1_canister_test_identity_1 = createActor(
                    'rrkah-fqaaa-aaaaa-aaaaq-cai',
                    {
                        agentOptions: {
                            host: 'http://127.0.0.1:8000',
                            identity: test_identity_1
                        }
                    }
                );

                const total_supply_result_before =
                    await icrc_1_canister.icrc1_total_supply();

                const balance_result_before =
                    await icrc_1_canister.icrc1_balance_of({
                        owner: Principal.fromText(
                            'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                        ),
                        subaccount: []
                    });

                const burn_result =
                    await icrc_1_canister_test_identity_1.icrc1_transfer({
                        amount: 100_000_000n,
                        created_at_time: [],
                        fee: [],
                        from_subaccount: [],
                        memo: [],
                        to: {
                            owner: Principal.fromText(
                                'jkpmw-aav35-wxvb3-lanyp-62lqw-fmtwc-cvqc3-jcn7p-6jtrt-x7csr-rae'
                            ),
                            subaccount: []
                        }
                    });

                const total_supply_result_after =
                    await icrc_1_canister.icrc1_total_supply();

                const balance_result_after =
                    await icrc_1_canister.icrc1_balance_of({
                        owner: Principal.fromText(
                            'jm5gm-r5btc-kor5h-mkrva-sbubi-z2krh-3flug-4xr2v-bnkhf-w23cq-dae'
                        ),
                        subaccount: []
                    });

                return {
                    ok:
                        'Ok' in burn_result &&
                        burn_result.Ok === 100_000_000n &&
                        total_supply_result_before - 100_000_000n ===
                            total_supply_result_after &&
                        balance_result_before - 100_000_000n ===
                            balance_result_after
                };
            }
        }
    ];
}

function get_transfer_tests(): Test[] {
    return [
        {
            name: 'icrc1_transfer test_identity_0.0 to test_identity_0.0',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_0',
                    [0, 0, 0, 0],
                    'test_identity_0',
                    [0, 0, 0, 0]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_0.1 to test_identity_0.1',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_0',
                    [0, 0, 0, 1],
                    'test_identity_0',
                    [0, 0, 0, 1]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_1.0 to test_identity_1.0',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_1',
                    [0, 0, 0, 0],
                    'test_identity_1',
                    [0, 0, 0, 0]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_1.1 to test_identity_1.1',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_1',
                    [0, 0, 0, 1],
                    'test_identity_1',
                    [0, 0, 0, 1]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_0.0 to test_identity_0.1',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_0',
                    [0, 0, 0, 0],
                    'test_identity_0',
                    [0, 0, 0, 1]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_0.1 to test_identity_0.0',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_0',
                    [0, 0, 0, 1],
                    'test_identity_0',
                    [0, 0, 0, 0]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_0.0 to test_identity_1.0',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_0',
                    [0, 0, 0, 0],
                    'test_identity_1',
                    [0, 0, 0, 0]
                );

                return {
                    ok: succeeded
                };
            }
        },
        {
            name: 'icrc1_transfer test_identity_0.1 to test_identity_1.1',
            test: async () => {
                const succeeded = await test_transfer(
                    'test_identity_0',
                    [0, 0, 0, 1],
                    'test_identity_1',
                    [0, 0, 0, 1]
                );

                return {
                    ok: succeeded
                };
            }
        }
    ];
}

async function test_transfer(
    identity_a_name: string,
    identity_a_subaccount: number[],
    identity_b_name: string,
    identity_b_subaccount: number[]
): Promise<boolean> {
    const identity_a = get_identity(identity_a_name);
    const identity_b = get_identity(identity_b_name);

    const icrc_1_canister_identity_a = createActor(
        'rrkah-fqaaa-aaaaa-aaaaq-cai',
        {
            agentOptions: {
                host: 'http://127.0.0.1:8000',
                identity: identity_a
            }
        }
    );

    const icrc_1_canister_identity_b = createActor(
        'rrkah-fqaaa-aaaaa-aaaaq-cai',
        {
            agentOptions: {
                host: 'http://127.0.0.1:8000',
                identity: identity_b
            }
        }
    );

    const identity_a_balance_before_transfer_a =
        await icrc_1_canister_identity_a.icrc1_balance_of({
            owner: identity_a.getPrincipal(),
            subaccount: [identity_a_subaccount]
        });

    const identity_b_balance_before_transfer_a =
        await icrc_1_canister_identity_b.icrc1_balance_of({
            owner: identity_b.getPrincipal(),
            subaccount: [identity_b_subaccount]
        });

    const transfer_result_a = await icrc_1_canister_identity_a.icrc1_transfer({
        amount: identity_a_balance_before_transfer_a,
        created_at_time: [BigInt(new Date().getTime() * 1_000_000)],
        fee: [],
        from_subaccount: [identity_a_subaccount],
        memo: [],
        to: {
            owner: identity_b.getPrincipal(),
            subaccount: [identity_b_subaccount]
        }
    });

    const identity_a_balance_after_transfer_a =
        await icrc_1_canister_identity_a.icrc1_balance_of({
            owner: identity_a.getPrincipal(),
            subaccount: [identity_a_subaccount]
        });

    const identity_b_balance_after_transfer_a =
        await icrc_1_canister_identity_b.icrc1_balance_of({
            owner: identity_b.getPrincipal(),
            subaccount: [identity_b_subaccount]
        });

    const transfer_result_b = await icrc_1_canister_identity_b.icrc1_transfer({
        amount: identity_a_balance_before_transfer_a,
        created_at_time: [BigInt(new Date().getTime() * 1_000_000)],
        fee: [],
        from_subaccount: [identity_b_subaccount],
        memo: [],
        to: {
            owner: identity_a.getPrincipal(),
            subaccount: [identity_a_subaccount]
        }
    });

    const identity_a_balance_after_transfer_b =
        await icrc_1_canister_identity_a.icrc1_balance_of({
            owner: identity_a.getPrincipal(),
            subaccount: [identity_a_subaccount]
        });

    const identity_b_balance_after_transfer_b =
        await icrc_1_canister_identity_b.icrc1_balance_of({
            owner: identity_b.getPrincipal(),
            subaccount: [identity_b_subaccount]
        });

    if (
        identity_a_name === identity_b_name &&
        identity_a_subaccount.length === identity_b_subaccount.length &&
        identity_a_subaccount.every(
            (a, index) => a === identity_b_subaccount[index]
        )
    ) {
        return (
            'Ok' in transfer_result_a &&
            transfer_result_a.Ok === identity_a_balance_before_transfer_a &&
            identity_a_balance_after_transfer_a ===
                identity_a_balance_before_transfer_a &&
            identity_b_balance_after_transfer_a ===
                identity_b_balance_before_transfer_a &&
            'Ok' in transfer_result_b &&
            transfer_result_b.Ok === identity_a_balance_before_transfer_a &&
            identity_a_balance_after_transfer_b ===
                identity_a_balance_before_transfer_a &&
            identity_b_balance_after_transfer_b ===
                identity_b_balance_before_transfer_a
        );
    } else {
        return (
            'Ok' in transfer_result_a &&
            transfer_result_a.Ok === identity_a_balance_before_transfer_a &&
            identity_a_balance_after_transfer_a === 0n &&
            identity_b_balance_after_transfer_a ===
                identity_a_balance_before_transfer_a +
                    identity_b_balance_before_transfer_a &&
            'Ok' in transfer_result_b &&
            transfer_result_b.Ok === identity_a_balance_before_transfer_a &&
            identity_a_balance_after_transfer_b ===
                identity_a_balance_before_transfer_a &&
            identity_b_balance_after_transfer_b ===
                identity_b_balance_before_transfer_a
        );
    }
}
