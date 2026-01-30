import { describe, expect, it } from 'vitest';

import { checkMagicBytes } from '../magic-bytes-guard';

const toBuffer = (bytes: number[]): ArrayBuffer =>
  new Uint8Array([...bytes, ...Array.from({ length: 100 }, () => 0)]).buffer;

describe('checkMagicBytes', () => {
  it('allows valid PDF files', () => {
    // %PDF
    const buffer = toBuffer([0x25, 0x50, 0x44, 0x46]);
    expect(checkMagicBytes(buffer)).toBeNull();
  });

  it('allows valid DOC files (OLE2)', () => {
    // D0 CF 11 E0 A1 B1 1A E1
    const buffer = toBuffer([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    expect(checkMagicBytes(buffer)).toBeNull();
  });

  it('allows valid DOCX files (ZIP)', () => {
    // PK\x03\x04
    const buffer = toBuffer([0x50, 0x4b, 0x03, 0x04]);
    expect(checkMagicBytes(buffer)).toBeNull();
  });

  it('rejects files with unknown magic bytes', () => {
    const buffer = toBuffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const result = checkMagicBytes(buffer);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('rejects files that are too small', () => {
    const buffer = new Uint8Array([0x25, 0x50]).buffer;
    const result = checkMagicBytes(buffer);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });

  it('rejects a PNG file disguised as PDF', () => {
    // PNG magic bytes
    const buffer = toBuffer([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const result = checkMagicBytes(buffer);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(400);
  });
});
