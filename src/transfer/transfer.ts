import { balance_of, set_account_balance } from '../account';
import { ic } from 'azle';
import { state } from '../state';
import {
    Account,
    Transaction,
    TransactionKind,
    TransferArgs,
    TransferResult
} from '../types';

export function handle_transfer(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Transfer: null
    };

    const fee = args.fee ?? state.fee;

    set_account_balance(from, balance_of(from) - args.amount - fee);
    set_account_balance(args.to, balance_of(args.to) + args.amount);

    if (state.minting_account !== null) {
        set_account_balance(
            state.minting_account,
            balance_of(state.minting_account) + fee
        );
    }

    state.total_supply -= fee;

    const transaction: Transaction = {
        args,
        fee,
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
