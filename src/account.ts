import { nat, Opt } from 'azle';
import { state } from './state';
import { Account, OwnerKey, Subaccount, SubaccountKey } from './types';

export function set_account_balance(account: Account, balance: nat): void {
    const { owner_key, subaccount_key } = get_account_keys(account);

    let owner_account = state.accounts[owner_key];

    if (owner_account === undefined) {
        state.accounts[owner_key] = {
            [subaccount_key]: balance
        };

        return;
    }

    owner_account[subaccount_key] = balance;
}

export function get_account_keys(account: Account): {
    owner_key: OwnerKey;
    subaccount_key: SubaccountKey;
} {
    const owner_key: OwnerKey = account.owner.toText();

    const subaccount_key: SubaccountKey = subaccount_to_hex(account.subaccount);

    return {
        owner_key,
        subaccount_key
    };
}

export function subaccount_to_hex(subaccount: Opt<Subaccount>): SubaccountKey {
    const hex = 
        subaccount === null ? "0".repeat(64): subaccount.buffer.toString("hex");

    return hex
};

export function balance_of(account: Account): nat {
    const { owner_key, subaccount_key } = get_account_keys(account);

    return state.accounts?.[owner_key]?.[subaccount_key] ?? 0n;
}
