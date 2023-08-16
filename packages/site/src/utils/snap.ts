import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke send ether function
 */

export const sendEther = async () => {
  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  await window.ethereum.request({
    method: 'eth_sendTransaction',
    // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
    params: [
      {
        from: accounts[0], // The user's active address.
        to: '0x796fC6401705Ce6358196fCDF20C7d9F6a0eD8f8',
        value: '10000000000000000',
      },
    ],
  });
};

/**
 * Invoke send USDC function
 */

export const sendUSDC = async () => {
  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  await window.ethereum.request({
    method: 'eth_sendTransaction',
    // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
    params: [
      {
        from: accounts[0], // The user's active address.
        to: '0x796fC6401705Ce6358196fCDF20C7d9F6a0eD8f8',
        value: '0',
        input:
          '0xa9059cbb000000000000000000000000796fc6401705ce6358196fcdf20c7d9f6a0ed8f800000000000000000000000000000000000000000000000000000000000f4240',
      },
    ],
  });
};

/**
 * Invoke send to a new wallet
 */

export const sendNew = async () => {
  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  await window.ethereum.request({
    method: 'eth_sendTransaction',
    // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
    params: [
      {
        from: accounts[0], // The user's active address.
        to: '0x5E7C619151570c0D708d959aebd02F8250117152',
        value: '0',
        input:
          '0xa9059cbb000000000000000000000000796fc6401705ce6358196fcdf20c7d9f6a0ed8f800000000000000000000000000000000000000000000000000000000000f4240',
      },
    ],
  });
};

export const sendGnosis = async () => {
  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  await window.ethereum.request({
    method: 'eth_sendTransaction',
    // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
    params: [
      {
        from: accounts[0], // The user's active address.
        to: '0x0DA0C3e52C977Ed3cBc641fF02DD271c3ED55aFe',
        value: '0',
        input:
          '0xa9059cbb000000000000000000000000796fc6401705ce6358196fcdf20c7d9f6a0ed8f800000000000000000000000000000000000000000000000000000000000f4240',
      },
    ],
  });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
