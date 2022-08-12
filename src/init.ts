import { set_account_balance } from './account';
import { ic, Init } from 'azle';
import { state } from './state';
import { InitArgs, Transaction, TransactionKind, TransferArgs } from './types';
import { get_fee } from './transfer';

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

    args.initial_account_balances.forEach((initial_account_balance) => {
        const args: TransferArgs = {
            amount: initial_account_balance.balance,
            created_at_time: null,
            fee: null,
            from_subaccount: null,
            memo: null,
            to: initial_account_balance.account
        };

        const kind: TransactionKind = {
            Mint: null
        };

        const fee = get_fee(state, args, kind);

        set_account_balance(
            initial_account_balance.account,
            initial_account_balance.balance - fee
        );

        state.total_supply += initial_account_balance.balance;
        state.total_supply -= fee;

        const transaction: Transaction = {
            args,
            fee,
            from: state.minting_account,
            kind,
            timestamp: ic.time()
        };

        state.transactions.push(transaction);
    });
}
