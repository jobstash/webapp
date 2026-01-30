import type { GuardResult } from './types';
import { guardError } from './types';

const MAX_FILENAME_LENGTH = 255;

export const checkFilename = (filename: string): GuardResult => {
  if (!filename) {
    return guardError('Missing filename', 400);
  }

  if (filename.length > MAX_FILENAME_LENGTH) {
    return guardError('Filename too long', 400);
  }

  if (filename.includes('\0')) {
    return guardError('Invalid filename', 400);
  }

  if (
    filename.includes('..') ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    return guardError('Invalid filename', 400);
  }

  return null;
};
