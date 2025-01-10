import 'server-only';

export const jobsCacheTags = {
  list: (page: number) => `job-list-${page}`,
};
