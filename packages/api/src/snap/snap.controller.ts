import { Controller, Get, Param, Query } from '@nestjs/common';
import { SnapService } from './snap.service';

@Controller('snap')
export class SnapController {
  constructor(private readonly snapService: SnapService) {}

  @Get('address/:address')
  async getAddressDetails(
    @Param('address') address: `0x${string}`,
    @Query('inputData') inputData: `0x${string}`,
    @Query('chainId') caipChainId: string, // Ref: https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md
  ) {
    const erc20TransferDetails = await this.snapService.decodeERC20Transfer(
      inputData,
    );

    const chainId = Number(caipChainId.replace('eip155:', ''));

    const receiver =
      (erc20TransferDetails?.args?.[0] as `0x${string}`) || address;

    const promises = [
      this.snapService.getEnsName(receiver),
      this.snapService.getLensProfile(receiver),
      this.snapService.getUD(receiver),
      this.snapService.getTransactionCount(receiver),
      this.snapService.isContract(chainId, receiver),
      this.snapService.isGnosisSafe(chainId, receiver),
    ];

    const data = await Promise.all(promises);

    return {
      ensName: data[0],
      lens: data[1],
      ud: data[2],
      transactionCount: data[3],
      isContract: data[4],
      isGnosisSafe: data[5],
      erc20TransferDetails,
    };
  }

  @Get('ens/:address')
  getEnsName(@Param('address') address: `0x${string}`) {
    return this.snapService.getEnsName(address);
  }
}
