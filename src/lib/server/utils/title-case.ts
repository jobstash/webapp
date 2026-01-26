import 'server-only';

export const titleCase = (text: string) =>
  text
    ?.replaceAll('_', ' ')
    .toLowerCase()
    .replaceAll(/\b\w/g, (s) => s.toUpperCase());
