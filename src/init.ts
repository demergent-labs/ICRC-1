import { set_account_balance } from './account';
import { Init } from 'azle';
import { state } from './state';
import { InitArgs } from './types';

export function init(args: InitArgs): Init {
    state.decimals = args.decimals;
    state.fee = args.fee;
    state.name = args.name;
    state.minting_account = args.minting_account;
    state.supported_standards = [
        {
            name: 'ICRC-1',
            url: 'https://github.com/dfinity/ICRC-1'
        },
        ...args.supported_standards
    ];
    state.symbol = args.symbol;

    state.metadata = [
        ['icrc1:decimals', { Nat: BigInt(state.decimals) }],
        ['icrc1:fee', { Nat: state.fee }],
        ['icrc1:name', { Text: state.name }],
        ['icrc1:symbol', { Text: state.symbol }],
        ...args.metadata
    ];

    // TODO perhaps we should create a transaction for each of these
    args.initial_account_balances.forEach((initial_account_balance) =>
        set_account_balance(
            initial_account_balance.account,
            initial_account_balance.balance
        )
    );

    const total_initial_account_balance = args.initial_account_balances.reduce(
        (result, initial_account_balance) => {
            return result + initial_account_balance.balance;
        },
        0n
    );

    state.total_supply = total_initial_account_balance;
}
