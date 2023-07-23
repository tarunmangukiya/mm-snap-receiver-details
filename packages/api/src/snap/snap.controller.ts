import { Controller, Get, Param } from '@nestjs/common';
import { SnapService } from './snap.service';

@Controller('snap')
export class SnapController {
  constructor(private readonly snapService: SnapService) {}

  @Get('ens/:address')
  getEnsName(@Param('address') address: `0x${string}`) {
    return this.snapService.getEnsName(address);
  }
}
