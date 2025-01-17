import { faker } from '@faker-js/faker';

export const fakeJobTags = (
  { min, max }: { min?: number; max?: number } = { min: 2, max: 12 },
) => {
  const length = faker.number.int({ min, max });
  return Array.from({ length }).map(() => {
    const name = faker.lorem.word().toUpperCase();
    const normalizedName = name.toLowerCase();
    const colorIndex = faker.number.int({ min: 1, max: 12 });
    return { name, normalizedName, colorIndex };
  });
};
