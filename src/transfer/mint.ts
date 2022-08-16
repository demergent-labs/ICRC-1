import { balance_of, set_account_balance } from '../account';
import { ic, Opt, Principal } from 'azle';
import { state } from '../state';
import {
    Account,
    Transaction,
    TransferArgs,
    TransferResult
} from '../types';

export function handle_mint(args: TransferArgs, from: Opt<Account>): TransferResult {
    set_account_balance(args.to, balance_of(args.to) + args.amount);
    state.total_supply += args.amount;

    const transaction: Transaction = {
        args,
        fee: 0n,
        from,
        kind: {
            Mint: null
        },
        timestamp: ic.time()
    };

    state.transactions.push(transaction);

    const transfer_result: TransferResult = {
        Ok: args.amount
    };

    return transfer_result;
}

export function is_minting_account(owner: Principal): boolean {
    return owner.toText() === state.minting_account?.owner.toText();
}
