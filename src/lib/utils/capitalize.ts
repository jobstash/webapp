export const capitalize = (str: string, lowercase = false) => {
  if (!str) return '';

  const s1 = str.charAt(0).toUpperCase();
  const s2 = lowercase ? str.slice(1).toLowerCase() : str.slice(1);

  return s1 + s2;
};

export const capitalizeSlug = (slug: string, capitalizeAllWords = true) => {
  if (!slug) return '';

  const spacedString = slug.replace(/-/g, ' ');

  if (capitalizeAllWords) {
    return spacedString
      .split(' ')
      .map((word) => capitalize(word))
      .join(' ');
  }

  return capitalize(spacedString);
};
