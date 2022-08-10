import { Ed25519KeyIdentity } from '@dfinity/identity';
import { decode } from 'pem-file';

export function get_identity(identity_name: string): Ed25519KeyIdentity {
    const pem = require('fs').readFileSync(`identities/${identity_name}.pem`).toString();
    const decoded_pem = decode(pem);
    const identity = Ed25519KeyIdentity.fromSecretKey(Buffer.concat([decoded_pem.slice(16, 48), decoded_pem.slice(53, 85)]));

    return identity;
}
