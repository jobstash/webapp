import { NextResponse } from 'next/server';

export const HEAD = async () => new NextResponse(null, { status: 200 });
export const GET = async () => NextResponse.json({ status: 'OK' });
