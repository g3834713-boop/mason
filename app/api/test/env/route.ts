import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
      url_exists: !!url,
      url_sample: url ? url.substring(0, 30) + '...' : 'MISSING',
      key_exists: !!key,
      key_length: key ? key.length : 0,
      key_sample: key ? key.substring(0, 20) + '...' : 'MISSING',
      key_starts_with_eyJ: key?.startsWith('eyJ') ? 'YES (JWT format)' : 'NO',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
