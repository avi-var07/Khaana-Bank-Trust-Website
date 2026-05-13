import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Legacy public rejection flow is disabled. Use admin invite flow instead.',
    },
    { status: 410 }
  );
}
