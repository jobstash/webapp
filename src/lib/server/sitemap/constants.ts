import 'server-only';

// Google rejects sitemap files over 50,000 URLs / 50MB; chunk well below that.
export const JOBS_CHUNK_SIZE = 5000;
export const PILLAR_CHUNK_SIZE = 3000;
