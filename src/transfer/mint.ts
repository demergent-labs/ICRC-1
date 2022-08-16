import { ic, Principal } from 'azle';
import { state } from '../state';
import {
    Account,
    Transaction,
    TransactionKind,
    TransferArgs,
    TransferResult
} from '../types';

export function handle_mint(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Mint: null
    };

    state.total_supply += args.amount;

    const transaction: Transaction = {
        args,
        fee: 0n,
        from,
        kind,
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
