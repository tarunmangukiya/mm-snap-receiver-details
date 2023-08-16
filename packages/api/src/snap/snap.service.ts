import { Injectable } from '@nestjs/common';
import { PublicClient, createPublicClient, http } from 'viem';
import * as chains from 'viem/chains';
import {
  LensClient,
  PaginatedResult,
  ProfileFragment,
  production,
} from '@lens-protocol/client';
import { decodeFunctionData } from 'viem';
import ERC20Abi from './abi/ERC20';
import { isEmpty, keyBy } from 'lodash';
// import Resolution from '@unstoppabledomains/resolution';
import SafeL2 from './abi/SafeL2';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const chainIdToChain = keyBy(chains, 'id');

@Injectable()
export class SnapService {
  private readonly publicEthereumClient: PublicClient;
  private readonly lensClient: LensClient;
  // private readonly udClient: Resolution;

  constructor() {
    this.publicEthereumClient = createPublicClient({
      chain: chains.mainnet,
      transport: http(),
    });

    this.lensClient = new LensClient({
      environment: production,
    });

    // this.udClient = new Resolution({
    //   sourceConfig: {
    //     uns: {
    //       locations: {
    //         Layer1: {
    //           url: chains.mainnet.rpcUrls.public.http[0],
    //           network: 'mainnet',
    //         },
    //         Layer2: {
    //           url: chains.polygon.rpcUrls.public.http[0],
    //           network: 'polygon-mainnet',
    //         },
    //       },
    //     },
    //   },
    // });
  }

  getEnsName(address: `0x${string}`): Promise<string | null> {
    return this.publicEthereumClient.getEnsName({
      address,
    });
  }

  getLensProfile(
    address: `0x${string}`,
  ): Promise<PaginatedResult<ProfileFragment>> {
    return this.lensClient.profile.fetchAll({
      ownedBy: [address],
    });
  }

  getUD(address: `0x${string}`): Promise<string | null> {
    return null;
    // return this.udClient.reverse(address);
  }

  getTransactionCount(address: `0x${string}`): Promise<number> {
    return this.publicEthereumClient.getTransactionCount({ address });
  }

  decodeERC20Transfer(inputData: `0x${string}`) {
    if (isEmpty(inputData) || inputData === '0x') {
      return null;
    }

    return decodeFunctionData({
      abi: ERC20Abi,
      data: inputData,
    });
  }

  async isContract(chainId: number, address: `0x${string}`): Promise<boolean> {
    if (!chainIdToChain[chainId]) {
      return false;
    }

    const publicClient = createPublicClient({
      chain: chainIdToChain[chainId],
      transport: http(),
    });

    const bytecode = await publicClient.getBytecode({
      address,
    });

    return Boolean(bytecode && bytecode !== '0x');
  }

  async isGnosisSafe(
    chainId: number,
    address: `0x${string}`,
  ): Promise<boolean> {
    if (!chainIdToChain[chainId]) {
      return false;
    }

    const publicClient = createPublicClient({
      chain: chainIdToChain[chainId],
      transport: http(),
    });

    try {
      const owners = publicClient.readContract({
        address,
        abi: SafeL2,
        functionName: 'getOwners',
      });
      const threshold = publicClient.readContract({
        address,
        abi: SafeL2,
        functionName: 'getThreshold',
      });

      await Promise.all([owners, threshold]);

      // If we can get values for both the getters then it's could be Safe

      return true;
    } catch (error) {
      return false;
    }
  }
}
