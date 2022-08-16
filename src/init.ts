import { set_account_balance } from './account';
import { ic, Init } from 'azle';
import { state } from './state';
import { InitArgs, Transaction, TransferArgs } from './types';

export function init(args: InitArgs): Init {
    state.decimals = args.decimals;
    state.fee = args.fee;
    state.name = args.name;
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
        // TODO run some necessary validation here, subaccounts and such
        const args: TransferArgs = {
            amount: initial_account_balance.balance,
            created_at_time: null,
            fee: null,
            from_subaccount: null,
            memo: null,
            to: initial_account_balance.account
        };

        const fee = 0n;

        set_account_balance(
            initial_account_balance.account,
            initial_account_balance.balance - fee
        );

        state.total_supply += initial_account_balance.balance;

        const transaction: Transaction = {
            args,
            fee,
            from: state.minting_account,
            kind: {
                Mint: null
            },
            timestamp: ic.time()
        };

        state.transactions.push(transaction);
    });
}
