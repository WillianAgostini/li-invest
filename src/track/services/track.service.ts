import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from '../entities/track';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async increment(id: string): Promise<Track> {
    if (!id) {
      const track = this.createNewTrack();
      return await this.trackRepository.save(track);
    }

    let track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      track = this.createNewTrack(id);
    } else {
      track.accessCount += 1;
      track.updatedAt = new Date();
    }

    return await this.trackRepository.save(track);
  }

  private createNewTrack(id?: string): Track {
    return this.trackRepository.create({
      id,
      accessCount: 1,
      updatedAt: new Date(),
    });
  }
}
