import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnapModule } from './snap/snap.module';

@Module({
  imports: [SnapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
