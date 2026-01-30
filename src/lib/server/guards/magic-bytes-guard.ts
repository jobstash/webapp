import type { GuardResult } from './types';
import { guardError } from './types';

// PDF: %PDF
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46];

// DOC (OLE2 Compound Document): D0 CF 11 E0 A1 B1 1A E1
const DOC_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

// DOCX (ZIP archive): PK\x03\x04
const DOCX_MAGIC = [0x50, 0x4b, 0x03, 0x04];

const matchesSignature = (bytes: Uint8Array, signature: number[]): boolean =>
  signature.every((byte, i) => bytes[i] === byte);

export const checkMagicBytes = (buffer: ArrayBuffer): GuardResult => {
  const bytes = new Uint8Array(buffer.slice(0, 8));

  if (bytes.length < 4) {
    return guardError('File too small to identify', 400);
  }

  const isValid =
    matchesSignature(bytes, PDF_MAGIC) ||
    matchesSignature(bytes, DOC_MAGIC) ||
    matchesSignature(bytes, DOCX_MAGIC);

  if (!isValid) {
    return guardError(
      'File content does not match expected format. Accepted: PDF, DOC, DOCX',
      400,
    );
  }

  return null;
};
