import 'server-only';

import baseSlugify from 'slugify';
import { transliterate } from 'transliteration';

export const slugify = (str: string | null | undefined): string => {
  if (str === null || str === undefined) return '';
  const transliterated = transliterate(str);
  const slug = baseSlugify(transliterated, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  if (slug === '') return str.trim().toLowerCase();
  return slug;
};
