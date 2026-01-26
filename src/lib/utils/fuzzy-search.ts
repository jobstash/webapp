import uFuzzy from '@leeoniya/ufuzzy';

import { type Option } from '@/lib/types';

export const fuzzySearch = (
  searchSpace: string[],
  searchValue: string,
  options: Option[],
) => {
  const uf = new uFuzzy({
    // case-sensitive regexps
    interSplit: "[^A-Za-z\\d']+",
    intraSplit: '[a-z][A-Z]',
  });
  const idxs = uf.filter(searchSpace, searchValue);
  if (!idxs) return [];
  const filteredIdxs = new Set(idxs);
  return options.filter((_, i) => filteredIdxs.has(i));
};
