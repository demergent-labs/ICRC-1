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

export function handle_burn(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Burn: null
    };

    const fee = args.fee ?? state.fee;

    set_account_balance(from, balance_of(from) - fee);

    if (state.minting_account !== null) {
        set_account_balance(
            state.minting_account,
            balance_of(state.minting_account) + fee
        );
    }

    state.total_supply -= args.amount + fee;

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
