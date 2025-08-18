import { NextResponse } from 'next/server';

import { PERMISSIONS } from '@/lib/shared/core/constants';

// TODO: Implement actual user fetching w/ session
export const GET = async () => {
  return NextResponse.json({
    success: true,
    message: 'User fetched successfully',
    data: {
      name: 'John Doe',
      token: 'todo-implement-actual',
      permissions: [PERMISSIONS.USER],
    },
  });
};
