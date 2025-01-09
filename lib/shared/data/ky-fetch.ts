import ky from 'ky';

const DEFAULT_TIMEOUT = 15_000;

export const kyFetch = ky.create({
  credentials: 'include',
  mode: 'cors',
  timeout: DEFAULT_TIMEOUT,
  // headers: {
  //   'ETag': '...',
  //   'If-None-Match': '...'
  // },
  // hooks: {
  //   beforeRequest: [() => console.log('...')],
  //   afterResponse: [() => console.log('...')],
  // },
});
