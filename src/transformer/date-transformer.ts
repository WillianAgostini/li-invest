import { ValueTransformer } from 'typeorm';

export class DateTransformer implements ValueTransformer {
  to(value?: Date): Date | undefined {
    return value;
  }

  from(value?: string): Date | undefined {
    if (value) return new Date(value);
  }
}
