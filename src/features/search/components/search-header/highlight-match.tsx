const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');

type Range = { start: number; end: number };

const findWordMatches = (text: string, word: string): Range[] => {
  const normalizedWord = normalize(word);
  if (!normalizedWord) return [];

  const normalizedText = normalize(text);

  // Build index map: normalizedIndex -> originalIndex
  const indexMap: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (!/[\s-]/.test(text[i])) {
      indexMap.push(i);
    }
  }

  const matches: Range[] = [];
  let searchStart = 0;

  while (searchStart <= normalizedText.length - normalizedWord.length) {
    const matchIndex = normalizedText.indexOf(normalizedWord, searchStart);
    if (matchIndex === -1) break;

    matches.push({
      start: indexMap[matchIndex],
      end: indexMap[matchIndex + normalizedWord.length - 1] + 1,
    });

    searchStart = matchIndex + 1;
  }

  return matches;
};

const mergeRanges = (ranges: Range[]): Range[] => {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: Range[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
};

export const HighlightMatch = ({
  text,
  query,
  enabled = true,
}: {
  text: string;
  query: string;
  enabled?: boolean;
}) => {
  const trimmedQuery = query.trim();
  if (!enabled || !trimmedQuery) return <>{text}</>;

  const words = trimmedQuery.split(/\s+/).filter(Boolean);
  const allMatches = words.flatMap((word) => findWordMatches(text, word));
  if (allMatches.length === 0) return <>{text}</>;

  const ranges = mergeRanges(allMatches);
  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (let i = 0; i < ranges.length; i++) {
    const { start, end } = ranges[i];
    if (start > lastEnd) parts.push(text.slice(lastEnd, start));
    parts.push(
      <span key={i} className='font-semibold text-[#a78bfa]'>
        {text.slice(start, end)}
      </span>,
    );
    lastEnd = end;
  }

  if (lastEnd < text.length) parts.push(text.slice(lastEnd));

  return <>{parts}</>;
};
