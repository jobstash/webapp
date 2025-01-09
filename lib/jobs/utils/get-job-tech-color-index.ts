const COLOR_COUNT = 12;

export const getJobTechColorIndex = (uuid: string) => {
  let pseudorandomBytes = uuid.slice(0, 14) + uuid.slice(15, 19) + uuid.slice(20);
  pseudorandomBytes = pseudorandomBytes.replaceAll('-', '');
  let accumulator = 0;

  const pseudoMatch = pseudorandomBytes.match(/.{1,8}/g);
  if (!pseudoMatch) return 0;

  for (const a of pseudoMatch) {
    accumulator = (accumulator + (Number.parseInt(a, 16) % COLOR_COUNT)) % COLOR_COUNT;
  }

  return accumulator;
};
