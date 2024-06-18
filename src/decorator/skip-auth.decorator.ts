import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'skipAuth';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
