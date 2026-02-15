import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!url) {
      return NextResponse.json({
        error: 'NEXT_PUBLIC_SUPABASE_URL not set'
      }, { status: 400 });
    }

    console.log('🌐 Testing network connectivity to:', url);
    
    // Try a simple fetch to the Supabase URL
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    
    return NextResponse.json({
      status: 'success',
      message: 'Network connectivity OK',
      url,
      response_status: response.status,
      response_ok: response.ok,
      response_body: text.substring(0, 200)
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Network connectivity test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Network connectivity failed',
      error: error instanceof Error ? error.message : String(error),
      error_name: error instanceof Error ? error.name : typeof error,
    }, { status: 500 });
  }
}
