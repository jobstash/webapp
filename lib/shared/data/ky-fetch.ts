import ky from 'ky';

export const kyFetch = ky.create({
  credentials: 'include',
  mode: 'cors',
  // headers: {
  //   'ETag': '...',
  //   'If-None-Match': '...'
  // },
  // hooks: {
  //   beforeRequest: [() => console.log('...')],
  //   afterResponse: [() => console.log('...')],
  // },
});
