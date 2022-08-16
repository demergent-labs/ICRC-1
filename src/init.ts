import { ic, Init } from 'azle';
import { state } from './state';
import { InitArgs, TransferArgs } from './types';
import { is_subaccount_valid, stringify } from './transfer/validate';
import { handle_mint } from './transfer/mint';

export function init(args: InitArgs): Init {
    state.decimals = args.decimals;
    state.fee = args.fee;
    state.name = args.name;

    if (
        args.minting_account !== null &&
        is_subaccount_valid(args.minting_account.subaccount) === false
    ) {
        ic.trap(`subaccount for minting account must be 32 bytes in length`);
    }

    state.minting_account = args.minting_account;
    state.permitted_drift_nanos =
        args.permitted_drift_nanos ?? state.permitted_drift_nanos;
    state.supported_standards = [
        {
            name: 'ICRC-1',
            url: 'https://github.com/dfinity/ICRC-1'
        },
        ...args.supported_standards
    ];
    state.symbol = args.symbol;
    state.transaction_window_nanos =
        args.transaction_window_nanos ?? state.transaction_window_nanos;

    state.metadata = [
        ['icrc1:decimals', { Nat: BigInt(state.decimals) }],
        ['icrc1:fee', { Nat: state.fee }],
        ['icrc1:name', { Text: state.name }],
        ['icrc1:symbol', { Text: state.symbol }],
        ...args.metadata
    ];

    args.initial_account_balances.forEach((initial_account_balance) => {
        if (
            is_subaccount_valid(initial_account_balance.account.subaccount) ===
            false
        ) {
            ic.trap(
                `subaccount for initial account ${initial_account_balance.account.owner.toText()} must be 32 bytes in length`
            );
        }

        const args: TransferArgs = {
            amount: initial_account_balance.balance,
            created_at_time: ic.time(),
            fee: null,
            from_subaccount: null,
            memo: null,
            to: initial_account_balance.account
        };

        const mint_result = handle_mint(args, state.minting_account);

        if ('Err' in mint_result) {
            ic.trap(stringify(mint_result.Err));
        }
    });
}
