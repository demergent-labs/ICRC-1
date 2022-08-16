<a href="https://github.com/demergent-labs/ICRC-1/actions/workflows/test.yml?query=branch%3Amain">
    <img src="https://github.com/demergent-labs/ICRC-1/actions/workflows/test.yml/badge.svg" alt="Coverage Status">
</a>

CAUTION: This project is built with Azle Beta and inherits its [disclaimer](https://github.com/demergent-labs/azle#disclaimer). This project has not been audited or well tested.

# ICRC-1

Reference implementation of the [ICRC-1 standard](https://github.com/dfinity/ICRC-1) in TypeScript.

## Installation

```bash
# Azle must be setup locally: https://github.com/demergent-labs/azle#installation
git clone https://github.com/demergent-labs/ICRC-1
npm install
```

## Deployment

```bash
npm run dfx_install
```

## Testing

```bash
npm test
```

## Configuration

Edit the initial arguments Candid record found in `ICRC-1/init_args.txt` to configure your token on canister installation.

The initial arguments record looks like this in Candid:

```typescript
type InitArgs = record {
    "decimals": nat8;
    "fee": nat;
    "initial_account_balances": vec InitialAccountBalance;
    "metadata": vec Metadatum;
    "minting_account": opt Account;
    "name": text;
    "permitted_drift_nanos": opt nat64;
    "supported_standards": vec SupportedStandard;
    "symbol": text;
    "transaction_window_nanos": opt nat64;
};

type InitialAccountBalance = record {
    "account": Account;
    "balance": nat;
};

type Metadatum = record { text; Value };

type Account = record {
    "owner": principal;
    "subaccount": opt blob;
};

type SupportedStandard = record {
    "name": text;
    "url": text;
};
```

The initial arguments record looks like this in TypeScript:

```typescript
type InitArgs = {
    decimals: nat8;
    fee: nat;
    initial_account_balances: InitialAccountBalance[];
    metadata: Metadatum[];
    minting_account: Opt<Account>;
    name: string;
    permitted_drift_nanos: Opt<nat64>;
    supported_standards: SupportedStandard[];
    symbol: string;
    transaction_window_nanos: Opt<nat64>;
};

type InitialAccountBalance = {
    account: Account;
    balance: nat;
};

type Metadatum = [string, Value];

type Account = {
    owner: Principal;
    subaccount: Opt<Subaccount>;
};

type SupportedStandard = {
    name: string;
    url: string;
};
```

## Candid

Here's [the Candid file](/src/index.did) which shows you the interface of the [ICRC-1 standard](https://github.com/dfinity/ICRC-1), with other types specific to this implementation.

```typescript
type Transaction = record {
    "args": opt TransferArgs;
    "fee": nat;
    "from": opt Account;
    "kind": TransactionKind;
    "timestamp": nat64;
};

type Account = record {
    "owner": principal;
    "subaccount": opt blob;
};

type Metadatum = record { text; Value };

type SupportedStandard = record {
    "name": text;
    "url": text;
};

type TransferArgs = record {
    "amount": nat;
    "created_at_time": opt nat64;
    "fee": opt nat;
    "from_subaccount": opt blob;
    "memo": opt blob;
    "to": Account;
};

type InitArgs = record {
    "decimals": nat8;
    "fee": nat;
    "initial_account_balances": vec InitialAccountBalance;
    "metadata": vec Metadatum;
    "minting_account": opt Account;
    "name": text;
    "permitted_drift_nanos": opt nat64;
    "supported_standards": vec SupportedStandard;
    "symbol": text;
    "transaction_window_nanos": opt nat64;
};

type InitialAccountBalance = record {
    "account": Account;
    "balance": nat;
};

type TransferResult = variant { "Ok": nat; "Err": TransferError };

type TransferError = variant { "BadBurn": record { "min_burn_amount": nat; }; "BadFee": record { "expected_fee": nat; }; "CreatedInFuture": record { "ledger_time": nat64; }; "Duplicate": record { "duplicate_of": nat; }; "GenericError": record { "error_code": nat; "message": text; }; "InsufficientFunds": record { "balance": nat; }; "TemporarilyUnavailable": null; "TooOld": null };

type TransactionKind = variant { "Burn": null; "Mint": null; "Transfer": null };

type Value = variant { "Blob": blob; "Int": int; "Nat": nat; "Text": text };

service: (InitArgs) -> {
    "get_transactions": (opt nat64, opt nat64) -> (vec Transaction) query;
    "icrc1_balance_of": (Account) -> (nat) query;
    "icrc1_decimals": () -> (nat8) query;
    "icrc1_fee": () -> (nat) query;
    "icrc1_metadata": () -> (vec Metadatum) query;
    "icrc1_minting_account": () -> (opt Account) query;
    "icrc1_name": () -> (text) query;
    "icrc1_supported_standards": () -> (vec SupportedStandard) query;
    "icrc1_symbol": () -> (text) query;
    "icrc1_total_supply": () -> (nat) query;
    "icrc1_transfer": (TransferArgs) -> (TransferResult);
}
```
