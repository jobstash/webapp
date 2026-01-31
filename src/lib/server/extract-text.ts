import 'server-only';
import 'pdf-parse/worker';

import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

const WORDS_PER_PAGE_ESTIMATE = 600;

export interface ExtractedText {
  text: string;
  pageCount: number;
}

export const extractText = async (
  buffer: ArrayBuffer,
  mimeType: string,
): Promise<ExtractedText> => {
  if (mimeType === 'application/pdf') {
    const pdf = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await pdf.getText();
    return { text: result.text, pageCount: result.total };
  }

  if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(buffer),
    });
    const wordCount = result.value.split(/\s+/).filter(Boolean).length;
    const pageCount = Math.max(
      1,
      Math.ceil(wordCount / WORDS_PER_PAGE_ESTIMATE),
    );
    return { text: result.value, pageCount };
  }

  throw new Error('Unsupported file type');
};
