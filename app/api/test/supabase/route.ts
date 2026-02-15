import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('📋 Environment variables:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ MISSING');
    console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ SET (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : '❌ MISSING');

    const supabase = getSupabaseServerClient();
    console.log('✅ Supabase client created');

    // Try to list buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return NextResponse.json({
        status: 'error',
        message: 'Failed to list buckets',
        error: bucketsError.message,
        details: bucketsError
      }, { status: 500 });
    }

    console.log('✅ Successfully listed buckets:', buckets?.map(b => b.name));

    // Check if 'documents' bucket exists
    const documentsExists = buckets?.some(b => b.name === 'documents');
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      buckets: buckets?.map(b => ({ name: b.name, id: b.id })),
      documentsExists
    }, { status: 200 });
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Supabase connection test failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
