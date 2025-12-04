// Sample data to be used across the application
// This ensures consistency in the UI when real data is not available

// Sample transaction data
export const sampleTransactions = [
  {
    id: 'tx_sample_123',
    amount: 125.75,
    currency: 'USD',
    status: 'approved',
    customer_email: 'customer1@example.com',
    customer_id: 'cus_12345',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    risk_score: 25,
    payment_method: 'credit_card',
    payment_method_details: {
      card_type: 'visa',
      last4: '4242'
    }
  },
  {
    id: 'tx_sample_456',
    amount: 879.99,
    currency: 'USD',
    status: 'under_review',
    customer_email: 'customer2@example.com',
    customer_id: 'cus_67890',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    risk_score: 78,
    payment_method: 'paypal',
    payment_method_details: {
      email: 'customer2@example.com'
    }
  },
  {
    id: 'tx_sample_789',
    amount: 42.50,
    currency: 'USD',
    status: 'approved',
    customer_email: 'customer3@example.com',
    customer_id: 'cus_13579',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    risk_score: 15,
    payment_method: 'bank_transfer',
    payment_method_details: {
      account_holder_name: 'Customer Three',
      last4: '1234'
    }
  }
];

// Sample alert data
export const sampleAlerts = [
  {
    id: 'alert-1',
    title: 'Suspicious Login Attempt',
    description: 'Unusual login from a new device',
    severity: 'high',
    status: 'open',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    transaction_id: 'tx_sample_123',
    type: 'suspicious_activity',
    metadata: {
      ip_address: '192.168.1.100',
      location: 'New York, US',
      device: 'iPhone 13, iOS 15.4'
    }
  },
  {
    id: 'alert-2',
    title: 'High Risk Transaction',
    description: 'Transaction amount exceeds normal pattern',
    severity: 'critical',
    status: 'open',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    transaction_id: 'tx_sample_456',
    type: 'unusual_activity',
    metadata: {
      amount: 879.99,
      currency: 'USD',
      previous_max: 200.00
    }
  },
  {
    id: 'alert-3',
    title: 'Multiple Failed Login Attempts',
    description: '5 failed login attempts detected',
    severity: 'medium',
    status: 'acknowledged',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    type: 'security_alert',
    metadata: {
      attempts: 5,
      ip_address: '203.0.113.42',
      location: 'London, UK'
    }
  }
];

// Helper function to get sample data
export const getSampleData = (type: 'transactions' | 'alerts', filter = {}) => {
  if (type === 'transactions') {
    return {
      transactions: sampleTransactions,
      total: sampleTransactions.length,
      has_more: false
    };
  }
  
  if (type === 'alerts') {
    return {
      alerts: sampleAlerts,
      total: sampleAlerts.length,
      has_more: false
    };
  }
  
  return { data: [], total: 0, has_more: false };
};
