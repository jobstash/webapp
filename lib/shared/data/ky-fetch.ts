import { addBreadcrumb } from '@sentry/nextjs';
import ky from 'ky';

const DEFAULT_TIMEOUT = 60_000;

export const kyFetch = ky.create({
  credentials: 'include',
  mode: 'cors',
  timeout: DEFAULT_TIMEOUT,
  cache: 'no-store',
  hooks: {
    beforeRequest: [
      (req, options) => {
        addBreadcrumb({
          category: 'http',
          message: `kyFetch::beforeRequest`,
          level: 'info',
          data: {
            url: req.url,
            method: req.method,
            next: options.next,
          },
        });
      },
    ],
    afterResponse: [
      (req, options, res) => {
        addBreadcrumb({
          category: 'http',
          message: `kyFetch::afterResponse`,
          level: 'info',
          data: {
            url: req.url,
            status: res.status,
            next: options.next,
          },
        });
      },
    ],
  },
  // headers: {
  //   'ETag': '...',
  //   'If-None-Match': '...'
  // },
});
