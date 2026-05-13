import { NextResponse } from 'next/server';

function disabledResponse() {
  return NextResponse.json(
    {
      error: 'Legacy public approval flow is disabled. Use admin invite flow instead.',
    },
    { status: 410 }
  );
}

export async function GET() {
  return disabledResponse();
}

export async function POST() {
  return disabledResponse();
}
