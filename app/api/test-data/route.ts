import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // 1. Create a test merchant
    const merchantId = uuidv4();
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .insert({
        id: merchantId,
        email: `test-merchant-${Date.now()}@example.com`,
        business_name: `Test Merchant ${Math.floor(Math.random() * 1000)}`,
        status: 'active',
        tier: 'premium',
        metadata: { test: true }
      })
      .select()
      .single();

    if (merchantError) throw merchantError;

    // 2. Create test transactions
    const transactions = Array.from({ length: 5 }).map((_, i) => ({
      merchant_id: merchantId,
      transaction_id: `tx_${Date.now()}_${i}`,
      amount: Math.floor(Math.random() * 10000) / 100, // Random amount between 0-100
      currency: 'USD',
      status: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)],
      customer_email: `customer${i}@example.com`,
      customer_ip: `192.168.1.${i + 1}`,
      metadata: { test: true, iteration: i }
    }));

    const { data: createdTransactions, error: txError } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();

    if (txError) throw txError;

    // 3. Create test alerts
    const alerts = createdTransactions.map((tx, i) => ({
      merchant_id: merchantId,
      transaction_id: tx.id,
      alert_type: ['suspicious', 'high_value', 'unusual_location'][i % 3],
      title: `Alert ${i + 1}`,
      description: `Test alert for transaction ${tx.transaction_id}`,
      status: 'open',
      severity: ['low', 'medium', 'high'][i % 3],
      metadata: { test: true }
    }));

    const { data: createdAlerts, error: alertError } = await supabase
      .from('alerts')
      .insert(alerts)
      .select();

    if (alertError) throw alertError;

    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      data: {
        merchant,
        transactions: createdTransactions,
        alerts: createdAlerts
      }
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create test data',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}