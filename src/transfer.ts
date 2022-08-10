import { Update } from 'azle';
import { TransferArgs, TransferResult } from './types';

export function icrc1_transfer(args: TransferArgs): Update<TransferResult> {
    return {
        Ok: 0n
    };
}
