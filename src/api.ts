import { get_account_keys } from './account';
import { nat, nat8, Opt, Query } from 'azle';
import { state } from './state';
import { Account, Metadatum, SupportedStandard } from './types';

export function icrc1_balance_of(account: Account): Query<nat> {
    const {
        owner_key,
        subaccount_key
    } = get_account_keys(account);

    return state.accounts?.[owner_key]?.[subaccount_key] ?? 0n;
}

export function icrc1_decimals(): Query<nat8> {
    return state.decimals;
}

export function icrc1_fee(): Query<nat> {
    return state.fee;
}

export function icrc1_metadata(): Query<Metadatum[]> {
    return state.metadata;
}

export function icrc1_minting_account(): Query<Opt<Account>> {
    return state.minting_account;
}

export function icrc1_name(): Query<string> {
    return state.name;
}

export function icrc1_supported_standards(): Query<SupportedStandard[]> {
    return state.supported_standards;
}

export function icrc1_symbol(): Query<string> {
    return state.symbol;
}

export function icrc1_total_supply(): Query<nat> {
    return state.total_supply;
}

export {
    icrc1_transfer
} from './transfer';
