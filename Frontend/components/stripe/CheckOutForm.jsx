"use client";
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement
} from '@stripe/react-stripe-js';

const CheckoutForm = ({ 
  clientSecret, 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  orderData 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
          payment_method_data: {
            billing_details: {
              name: `${orderData.firstName} ${orderData.lastName}`,
              email: orderData.email,
              phone: orderData.phone,
              address: {
                line1: orderData.billingAddress.address,
                city: orderData.billingAddress.city,
                postal_code: orderData.billingAddress.pincode,
                country: orderData.billingAddress.country,
              }
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred.');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-purple-950 mb-4">
          Payment Details
        </h3>
        <div className="p-4 border border-stone-200 rounded-md bg-white">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{paymentError}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-lg text-purple-950">
          Total Amount:
        </span>
        <span className="font-semibold text-purple-950 text-xl">
          ${(amount / 100).toFixed(2)}
        </span>
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-purple-600 disabled:bg-purple-300 rounded-md hover:bg-purple-700 py-3 text-sm font-medium text-white uppercase tracking-wide"
      >
        {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;