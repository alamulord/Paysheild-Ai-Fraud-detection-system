import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with test API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // Using latest API version for Stripe v20.0.0
  apiVersion: '2025-11-17.clover',
});

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test card numbers from Stripe
const TEST_CARDS = {
  normal: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: new Date().getFullYear() + 1,
    cvc: '123',
  },
  fraud: {
    number: '4000000000003220', // Triggers fraud detection
    exp_month: 12,
    exp_year: new Date().getFullYear() + 1,
    cvc: '123',
  },
  decline: {
    number: '4000000000000002', // Always declines
    exp_month: 12,
    exp_year: new Date().getFullYear() + 1,
    cvc: '123',
  },
};

async function createTestMerchant() {
  const testEmail = `test-merchant-${Date.now()}@example.com`;
  
  // Create a test customer in Stripe
  const customer = await stripe.customers.create({
    email: testEmail,
    name: 'Test Merchant',
  });

  // Create merchant in database
  const { data: merchant, error } = await supabase
    .from('merchants')
    .insert({
      email: testEmail,
      business_name: 'Test Merchant',
      api_key: `test_${Math.random().toString(36).substring(2, 15)}`,
      stripe_customer_id: customer.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating test merchant:', error);
    return null;
  }

  console.log(`Created test merchant: ${merchant.id}`);
  return merchant;
}

async function testPayment(merchant: any, cardType: keyof typeof TEST_CARDS) {
  const card = TEST_CARDS[cardType];
  const amount = Math.floor(Math.random() * 10000) + 100; // $1.00 - $100.00
  
  try {
    console.log(`\nTesting ${cardType} payment of $${(amount / 100).toFixed(2)}`);
    
    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: merchant.stripe_customer_id,
      payment_method: paymentMethod.id,
      confirm: true,
      off_session: true,
      metadata: {
        test_case: cardType,
        merchant_id: merchant.id,
      },
    });

    console.log(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    
    // Save to database
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        merchant_id: merchant.id,
        amount: amount / 100, // Convert to dollars
        currency: 'USD',
        customer_id: `test_customer_${Date.now()}`,
        customer_email: `test_${Date.now()}@example.com`,
        transaction_type: 'purchase',
        status: paymentIntent.status,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_method_id: paymentMethod.id,
        payment_status: paymentIntent.status,
        metadata: {
          test_case: cardType,
          stripe_customer: merchant.stripe_customer_id,
          payment_method: paymentMethod.id,
        },
      })
      .select()
      .single();

    if (txError) {
      console.error('Error saving transaction:', txError);
      return;
    }

    console.log(`Saved transaction: ${transaction.id}`);
    
    // Check for fraud signals
    await checkFraudSignals(transaction.id);
    
    return { transaction, paymentIntent };
  } catch (error: any) {
    console.error(`Error processing ${cardType} payment:`, error.message);
    return { error };
  }
}

async function checkFraudSignals(transactionId: string) {
  // Wait a moment for async processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check for risk assessment
  const { data: riskAssessment } = await supabase
    .from('risk_assessments')
    .select('*')
    .eq('transaction_id', transactionId)
    .single();

  if (riskAssessment) {
    console.log('\nRisk Assessment:');
    console.log(`- Risk Level: ${riskAssessment.risk_level}`);
    console.log(`- Score: ${riskAssessment.overall_risk_score}/100`);
    console.log(`- Is Fraudulent: ${riskAssessment.is_fraudulent ? 'Yes' : 'No'}`);
    console.log(`- Reason: ${riskAssessment.reason || 'None'}`);
  }

  // Check for fraud signals
  const { data: signals } = await supabase
    .from('fraud_signals')
    .select('*')
    .eq('transaction_id', transactionId);

  if (signals && signals.length > 0) {
    console.log('\nFraud Signals:');
    signals.forEach((signal: any) => {
      console.log(`- ${signal.signal_type}: ${signal.description} (${signal.severity})`);
    });
  }

  // Check for alerts
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('transaction_id', transactionId);

  if (alerts && alerts.length > 0) {
    console.log('\nAlerts:');
    alerts.forEach((alert: any) => {
      console.log(`- ${alert.severity.toUpperCase()}: ${alert.title}`);
      console.log(`  ${alert.description}`);
    });
  }
}

async function main() {
  console.log('Starting Stripe fraud detection tests...');
  
  // Create a test merchant
  const merchant = await createTestMerchant();
  if (!merchant) {
    console.error('Failed to create test merchant');
    process.exit(1);
  }

  // Test different payment scenarios
  await testPayment(merchant, 'normal');
  await testPayment(merchant, 'fraud');
  await testPayment(merchant, 'decline');
  
  console.log('\nTest completed!');
  process.exit(0);
}

main().catch(console.error);
