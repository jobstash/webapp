import { describe, expect, it } from 'vitest';

import { checkFilename } from '../filename-guard';

describe('checkFilename', () => {
  it('allows valid filenames', () => {
    expect(checkFilename('resume.pdf')).toBeNull();
    expect(checkFilename('my-resume_v2.docx')).toBeNull();
    expect(checkFilename('John Doe Resume.doc')).toBeNull();
  });

  it('rejects path traversal with ..', () => {
    const result = checkFilename('../../../etc/passwd');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('rejects forward slashes', () => {
    const result = checkFilename('path/to/file.pdf');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('rejects backslashes', () => {
    const result = checkFilename('path\\to\\file.pdf');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('rejects null bytes', () => {
    const result = checkFilename('resume.pdf\0.exe');
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('rejects filenames longer than 255 characters', () => {
    const longName = 'a'.repeat(256) + '.pdf';
    const result = checkFilename(longName);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('allows filenames exactly 255 characters', () => {
    const name = 'a'.repeat(251) + '.pdf';
    expect(checkFilename(name)).toBeNull();
  });
});
