import 'server-only';

import baseSlugify from 'slugify';
import { transliterate } from 'transliteration';

export const slugify = (str: string | null | undefined): string => {
  if (str === null || str === undefined) return '';

  // Normalize slashes (with or without spaces) to ' - ' for consistent dash conversion
  const normalized = str.replace(/\s*\/\s*/g, ' - ');

  const transliterated = transliterate(normalized);
  const slug = baseSlugify(transliterated, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  return slug;
};
