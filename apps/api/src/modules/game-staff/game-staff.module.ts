import { Module } from '@nestjs/common';
import { GameStaffService } from './game-staff.service';
import { GameStaffResolver } from './game-staff.resolver';

@Module({
  providers: [GameStaffService, GameStaffResolver],
  exports: [GameStaffService],
})
export class GameStaffModule {}
