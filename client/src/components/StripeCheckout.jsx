import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const StripeCheckout = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on the server
      const { data } = await axios.post('/api/create-payment-intent', { amount });

      // 2. Confirm the payment on the client
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl space-y-4">
      <h3 className="text-xl font-black text-white flex items-center gap-2">
        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        SECURE CHECKOUT
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-gray-950 border border-gray-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': { color: '#4b5563' },
                  iconColor: '#3b82f6',
                },
                invalid: { color: '#ef4444' },
              },
            }} 
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 px-4 bg-gray-800 text-gray-400 font-bold rounded-2xl hover:bg-gray-700 transition-all active:scale-95"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className="flex-[2] py-4 px-4 bg-blue-600 text-white font-black tracking-widest rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>PROCESSING...</span>
              </div>
            ) : (
              `PAY $${amount}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripeCheckout;
