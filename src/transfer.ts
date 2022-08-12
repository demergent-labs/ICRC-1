import { balance_of, set_account_balance } from './account';
import { blob, ic, nat, nat64, Opt, Principal, Update, Variant } from 'azle';
import {
    Account,
    State,
    Subaccount,
    Transaction,
    TransactionKind,
    TransferArgs,
    TransferError,
    TransferResult
} from './types';
import { state } from './state';

// TODO probably make this configurable?
const permitted_drift_nanos = 60_000_000_000n;
const transaction_window_nanos = 24n * 60n * 60n * 1_000_000_000n;

export function icrc1_transfer(args: TransferArgs): Update<TransferResult> {
    const from: Account = {
        owner: ic.caller(),
        subaccount: args.from_subaccount
    };

    const validate_transfer_result = validate_transfer(args, from);

    if ('err' in validate_transfer_result) {
        return {
            Err: validate_transfer_result.err
        };
    }

    const from_is_minting_account = is_minting_account(from.owner);
    const to_is_minting_account = is_minting_account(args.to.owner);

    if (from_is_minting_account === true) {
        return handle_mint(args, from);
    }

    if (to_is_minting_account === true) {
        return handle_burn(args, from);
    }

    return handle_transfer(args, from);
}

function handle_mint(args: TransferArgs, from: Account): TransferResult {
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

function handle_burn(args: TransferArgs, from: Account): TransferResult {
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

function handle_transfer(args: TransferArgs, from: Account): TransferResult {
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

type ValidateTransferResult = Variant<{
    ok: boolean;
    err: TransferError;
}>;

function validate_transfer(
    args: TransferArgs,
    from: Account
): ValidateTransferResult {
    const from_is_anonymous = is_anonymous(from.owner);

    if (from_is_anonymous === true) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'anonymous user is not allowed to transfer funds'
                }
            }
        };
    }

    const from_subaccount_is_valid = is_subaccount_valid(args.from_subaccount);

    if (from_subaccount_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'from_subaccount must be 32 bytes in length'
                }
            }
        };
    }

    const to_subaccount_is_valid = is_subaccount_valid(args.to.subaccount);

    if (to_subaccount_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'to.subaccount must be 32 bytes in length'
                }
            }
        };
    }

    const memo_is_valid = is_memo_valid(args.memo);

    if (memo_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'memo must be a maximum of 32 bytes in length'
                }
            }
        };
    }

    const created_at_time_is_in_future = is_created_at_time_in_future(
        args.created_at_time
    );

    if (created_at_time_is_in_future === true) {
        return {
            err: {
                CreatedInFuture: {
                    ledger_time: ic.time()
                }
            }
        };
    }

    const created_at_time_too_old = is_created_at_time_too_old(
        args.created_at_time
    );

    if (created_at_time_too_old === true) {
        return {
            err: {
                TooOld: null
            }
        };
    }

    const duplicate_transaction_index = find_duplicate_transaction_index(args);

    if (duplicate_transaction_index !== null) {
        return {
            err: {
                Duplicate: {
                    duplicate_of: duplicate_transaction_index
                }
            }
        };
    }

    const from_is_minting_account = is_minting_account(from.owner);

    if (from_is_minting_account === true && args.fee !== 0n) {
        return {
            err: {
                BadFee: {
                    expected_fee: 0n
                }
            }
        };
    }

    const to_is_minting_account = is_minting_account(args.to.owner);

    if (to_is_minting_account === true) {
        if (args.fee !== 0n) {
            return {
                err: {
                    BadFee: {
                        expected_fee: 0n
                    }
                }
            };
        }

        if (args.amount < state.fee) {
            return {
                err: {
                    BadBurn: {
                        min_burn_amount: state.fee
                    }
                }
            };
        }
    }

    if (!from_is_minting_account && !to_is_minting_account) {
        if ((args.fee ?? state.fee) !== state.fee) {
            return {
                err: {
                    BadFee: {
                        expected_fee: state.fee
                    }
                }
            };
        }
    }

    const from_balance = balance_of(from);

    if (from_balance < args.amount) {
        return {
            err: {
                InsufficientFunds: {
                    balance: from_balance
                }
            }
        };
    }

    return {
        ok: true
    };
}

function is_anonymous(principal: Principal): boolean {
    return principal.toText() === '2vxsx-fae';
}

function is_subaccount_valid(subaccount: Opt<Subaccount>): boolean {
    return subaccount === null || subaccount.length === 4;
}

function is_memo_valid(memo: Opt<blob>): boolean {
    return memo === null || memo.length <= 4;
}

function is_created_at_time_in_future(created_at_time: Opt<nat64>): boolean {
    const now = ic.time();
    const tx_time = created_at_time ?? now;

    if (tx_time > now && tx_time - now > permitted_drift_nanos) {
        return true;
    } else {
        return false;
    }
}

function is_created_at_time_too_old(created_at_time: Opt<nat64>): boolean {
    const now = ic.time();
    const tx_time = created_at_time ?? now;

    if (
        tx_time < now &&
        now - tx_time > transaction_window_nanos + permitted_drift_nanos
    ) {
        return true;
    } else {
        return false;
    }
}

function find_duplicate_transaction_index(
    transfer_args: TransferArgs
): Opt<nat> {
    const now = ic.time();

    for (let i = 0; i < state.transactions.length; i++) {
        const transaction = state.transactions[i];

        if (
            stringify(transfer_args) === stringify(transaction.args) &&
            transaction.timestamp < now + permitted_drift_nanos &&
            now - transaction.timestamp <
                transaction_window_nanos + permitted_drift_nanos
        ) {
            return BigInt(i);
        }
    }

    return null;
}

function is_minting_account(owner: Principal): boolean {
    return owner.toText() === state.minting_account?.owner.toText();
}

function stringify(value: any): string {
    return JSON.stringify(value, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}
