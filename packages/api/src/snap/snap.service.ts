import { Injectable } from '@nestjs/common';
import { PublicClient, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

@Injectable()
export class SnapService {
  private readonly publicClient: PublicClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
  }

  getEnsName(address: `0x${string}`): Promise<string | null> {
    return this.publicClient.getEnsName({
      address,
    });
  }
}
