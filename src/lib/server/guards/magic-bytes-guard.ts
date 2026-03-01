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

/** Returns the MIME type matching the file's magic bytes, or null if unrecognized. */
export const detectMimeType = (buffer: ArrayBuffer): string | null => {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  if (bytes.length < 4) return null;
  if (matchesSignature(bytes, PDF_MAGIC)) return 'application/pdf';
  if (matchesSignature(bytes, DOC_MAGIC)) return 'application/msword';
  if (matchesSignature(bytes, DOCX_MAGIC))
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return null;
};

export const checkMagicBytes = (buffer: ArrayBuffer): GuardResult => {
  if (detectMimeType(buffer) !== null) return null;

  const bytes = new Uint8Array(buffer.slice(0, 8));
  if (bytes.length < 4) {
    return guardError('File too small to identify', 400);
  }

  return guardError(
    'File content does not match expected format. Accepted: PDF, DOC, DOCX',
    400,
  );
};
