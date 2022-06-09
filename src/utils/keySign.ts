import * as ed25519 from '@stablelib/ed25519';
import { Auth } from 'aws-amplify';
import holderKeyApi from 'api/holderKey';

import { arrayBufferToBase64 } from 'utils/arrayBufferToBase64';

export async function getSk() {
  let session;
  try {
    session = await Auth.currentSession();
  } catch (err) {
    throw new Error('Unauthorized');
  }
  const { payload } = session.getIdToken();
  const storageKey = `${payload.sub}_signing_key`;
  const storageKeyId = `${payload.sub}_signing_key_id`;
  const savedSK = localStorage.getItem(storageKey);

  if (!savedSK) {
    const { secretKey: sk, publicKey: pk } = ed25519.generateKeyPair();

    const base64Sk = arrayBufferToBase64(sk);
    const base64Pk = arrayBufferToBase64(pk);

    const keySpec = {
      publicKey: base64Pk,
      type: 'Ed25519Signature2018',
      device: navigator.userAgent,
    };

    const [response, err] = await holderKeyApi.submitKey(keySpec);
    if (err) {
      throw new Error('Cannot create key');
    }

    localStorage.setItem(storageKey, base64Sk);
    localStorage.setItem(storageKeyId, response.publicKeyId);
    return {
      secretKey: base64Sk,
      publicKeyId: response.publicKeyId,
    };
  }
  return {
    secretKey: savedSK,
    publicKeyId: localStorage.getItem(storageKeyId),
  };
}
