import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entity/track';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async increment(id: number): Promise<Track> {
    let track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      track = this.trackRepository.create({
        accessCount: 0,
      });
    }

    track.accessCount += 1;
    track.updatedAt = new Date();
    return await this.trackRepository.save(track);
  }
}
