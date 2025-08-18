import { NextResponse } from 'next/server';

// TODO: Implement actual user fetching w/ session
export const GET = async () => {
  return NextResponse.json({
    success: true,
    message: 'User fetched successfully',
    data: {
      name: 'John Doe',
    },
  });
};
