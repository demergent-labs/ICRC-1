import { balance_of } from './account';
import { nat, nat8, nat64, Opt, Query } from 'azle';
import { state } from './state';
import { Account, Metadatum, SupportedStandard, Transaction } from './types';

export function get_transactions(
    start: Opt<nat64>,
    end: Opt<nat64>
): Query<Transaction[]> {
    return state.transactions.slice(
        start === null ? 0 : Number(start),
        end === null ? state.transactions.length : Number(end)
    );
}

export function icrc1_balance_of(account: Account): Query<nat> {
    return balance_of(account);
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

export { icrc1_transfer } from './transfer';
