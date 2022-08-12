import { balance_of, set_account_balance } from './account';
import { ic, Update } from 'azle';
import {
    Account,
    State,
    Transaction,
    TransactionKind,
    TransferArgs,
    TransferResult
} from './types';
import { state } from './state';

// TODO split up into validation and state changes
export function icrc1_transfer(args: TransferArgs): Update<TransferResult> {
    const from: Account = {
        owner: ic.caller(),
        subaccount: args.from_subaccount
    };

    const transfer_from_minting_account =
        from.owner.toText() === state.minting_account?.owner.toText();
    const transfer_to_minting_account =
        args.to.owner.toText() === state.minting_account?.owner.toText();

    if (transfer_from_minting_account === true) {
        return handle_mint(args, from);
    }

    if (transfer_to_minting_account === true) {
        return handle_burn(args, from);
    }

    return handle_transfer(args, from);
}

function handle_mint(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Mint: null
    };

    const fee = get_fee(state, args, kind);

    state.total_supply += args.amount;
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

function handle_burn(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Burn: null
    };

    const fee = get_fee(state, args, kind);

    set_account_balance(from, balance_of(from) - fee);

    state.total_supply -= args.amount;
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

function handle_transfer(args: TransferArgs, from: Account): TransferResult {
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

    const kind: TransactionKind = {
        Transfer: null
    };

    const fee = get_fee(state, args, kind);

    set_account_balance(from, balance_of(from) - args.amount - fee);
    set_account_balance(args.to, balance_of(args.to) + args.amount);

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

function validate_transfer(): boolean {
    return false;
}

export function get_fee(
    state: State,
    args: TransferArgs,
    kind: TransactionKind
) {
    if ('Mint' in kind) {
        return 0n;
    }

    if (args.fee === null || args.fee < state.fee) {
        return state.fee;
    }

    return args.fee;
}
