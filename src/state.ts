import { State } from './types';

export let state: State = {
    accounts: {},
    decimals: 0,
    fee: 0n,
    metadata: [],
    minting_account: null,
    name: '',
    supported_standards: [],
    symbol: '',
    total_supply: 0n
};
