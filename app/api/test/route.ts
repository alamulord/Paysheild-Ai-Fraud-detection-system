import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-11-17.clover'
});

export async function GET() {
  try {
    // 1. Test Supabase connection
    const { data: alerts, error: alertError } = await supabase
      .from('alerts')
      .select('*')
      .limit(1);
      
    if (alertError) {
      console.error('Supabase error:', alertError);
      throw alertError;
    }

    // 2. Test Stripe connection
    let stripeTest;
    try {
      stripeTest = await stripe.balance.retrieve();
    } catch (error) {
      const stripeError = error as Error;
      console.error('Stripe error:', stripeError);
      throw new Error(`Stripe connection failed: ${stripeError.message}`);
    }

    // 3. Test merchants table
    const { data: merchants, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .limit(1);

    if (merchantError) {
      console.error('Merchants query error:', merchantError);
      throw merchantError;
    }

    return NextResponse.json({
      success: true,
      message: 'All tests passed successfully!',
      results: {
        supabase_connection: '✅ Connected',
        stripe_connection: stripeTest ? '✅ Connected' : '❌ Failed',
        tables: {
          alerts: alerts ? `✅ Found (${alerts.length} records)` : '❌ Not found',
          merchants: merchants ? `✅ Found (${merchants.length} records)` : '❌ Not found'
        }
      }
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Test failed',
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}



// import { createClient } from '@supabase/supabase-js';
// import { NextResponse } from 'next/server';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function GET() {
//   try {
//     // Test database connection
//     const { data, error } = await supabase
//       .from('alerts')
//       .select('*')
//       .limit(1);
      
//     if (error) {
//       console.error('Supabase error:', error);
//       throw error;
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: 'Database connection successful',
//       data: data || []
//     });
    
//   } catch (error) {
//     console.error('Test endpoint error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Database test failed',
//         error: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }