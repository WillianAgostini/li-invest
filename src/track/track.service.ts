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
    if (!id) {
      const track = this.createNewTrack();
      return await this.trackRepository.save(track);
    }

    let track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      track = this.createNewTrack();
    } else {
      track.accessCount += 1;
      track.updatedAt = new Date();
    }

    return await this.trackRepository.save(track);
  }

  private createNewTrack(): Track {
    return this.trackRepository.create({
      accessCount: 1,
      updatedAt: new Date(),
    });
  }
}
