import { nat, nat32, Opt } from 'azle';
import { state } from './state';
import { Account, OwnerKey, Subaccount, SubaccountKey } from './types';

export function set_account_balance(account: Account, balance: nat): void {
    const {
        owner_key,
        subaccount_key
    } = get_account_keys(account);

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

    const subaccount_number: nat32 = subaccount_to_nat32(account.subaccount);
    const subaccount_key: SubaccountKey = subaccount_number.toString();

    return {
        owner_key,
        subaccount_key
    };
}

export function subaccount_to_nat32(subaccount: Opt<Subaccount>): nat32 {
    const subaccount_number = subaccount === null ? 0 : new DataView(subaccount.buffer).getUint32(0);

    return subaccount_number;
}
