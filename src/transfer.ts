import { balance_of, set_account_balance } from './account';
import { ic, Update } from 'azle';
import { Account, Transaction, TransferArgs, TransferResult } from './types';
import { state } from './state';

// TODO split up into validation and state changes

// TODO remember to add account history
export function icrc1_transfer(args: TransferArgs): Update<TransferResult> {
    const from: Account = {
        owner: ic.caller(),
        subaccount: args.from_subaccount
    };

    // TODO validate the accounts
    const from_balance = balance_of(from);

    if (from_balance < args.amount) {
        return {
            Err: {
                InsufficientFunds: {
                    balance: from_balance
                }
            }
        };
    }

    const to_balance = balance_of(args.to);

    const transaction: Transaction = {
        args,
        fee: state.fee,
        from,
        kind: {
            Transfer: null
        },
        timestamp: ic.time()
    };

    set_account_balance(from, from_balance - args.amount);
    set_account_balance(args.to, to_balance + args.amount);

    state.transactions.push(transaction);

    return {
        Ok: args.amount
    };
}

function validate_transfer(): boolean {
    return false;
}
