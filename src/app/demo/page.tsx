'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Zod schema for JSONPlaceholder post
const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

type Post = z.infer<typeof postSchema>;

const fetchPost = async (): Promise<Post> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.status}`);
  }
  const json: unknown = await res.json();
  return postSchema.parse(json);
};

const getDisplayContent = (
  isFetching: boolean,
  isError: boolean,
  error: Error | null,
  data: Post | undefined,
) => {
  if (isFetching) return 'Loading data...';
  if (isError) {
    return (
      <span className='text-destructive'>
        Error: {error?.message ?? 'Failed to load data'}
      </span>
    );
  }
  if (data) return JSON.stringify(data, null, 2);
  return 'Click button to load data';
};

const DemoPage = () => {
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['demo-post'],
    queryFn: fetchPost,
    enabled: shouldFetch,
  });

  const isEmptyState = !data && !isError && !isFetching;

  return (
    <div className='flex min-h-screen flex-col items-center gap-6 p-8'>
      <h1 className='text-2xl font-semibold'>Demo Page</h1>

      <Button onClick={() => setShouldFetch(true)} disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Load Data'}
      </Button>

      <pre
        className={cn(
          'w-full max-w-2xl rounded-lg border bg-card p-6 text-sm',
          isEmptyState && 'text-muted-foreground',
        )}
      >
        {getDisplayContent(isFetching, isError, error, data)}
      </pre>
    </div>
  );
};

export default DemoPage;
