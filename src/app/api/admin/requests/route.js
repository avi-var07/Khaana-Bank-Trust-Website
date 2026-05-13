import { NextResponse } from 'next/server';

function disabledResponse() {
  return NextResponse.json(
    {
      error: 'Public admin requests are disabled. Admin onboarding is invite-only.',
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

