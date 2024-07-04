import { Module } from '@nestjs/common';
import { TrackService } from './services/track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
