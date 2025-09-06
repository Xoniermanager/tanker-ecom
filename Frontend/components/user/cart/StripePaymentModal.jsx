import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { FaXmark, FaSpinner } from 'react-icons/fa6';
import api from '../common/api';

import stripePromise from '../../../lib/stripe';

const StripeCheckoutForm = ({ orderId, totalAmount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const initPayment = async () => {
      try {
        const response = await api.post(`/order/payment/${orderId}`);
        setClientSecret(response.data.data.clientSecret);
      } catch (error) {
        onError(error.response?.data?.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      initPayment();
    }
  }, [orderId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details:{
            name: "Mridul Saklani",
            email: "mriduldummy@gmail.com",
            address: {
                city: "Indirapuram",
                country: "IN",
                line1: "Gyan khand galli no 2",
                postal_code: 696969
            }
        },
        
      },
      receipt_email: "mriduldummy@gmail.com"
    });

    setIsProcessing(false);

    if (error) {
      
      onError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
        console.log("payment Intent: ", paymentIntent)
      onSuccess();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <FaSpinner className="animate-spin mx-auto mb-2 text-2xl text-purple-600" />
        <p>Initializing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-stone-200 rounded-md bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium text-purple-950">Total: ${totalAmount}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${totalAmount}`
        )}
      </button>
    </form>
  );
};


// #####################################################################################$$$$



const StripePaymentModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  totalAmount, 
  onSuccess 
}) => {
  const [error, setError] = useState('');

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleOnClose = ()=>{
    setError('')
     onClose()
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 bg-opacity-50 flex items-center justify-center z-1150">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={handleOnClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaXmark size={20} />
        </button>

        <h2 className="text-xl font-semibold text-purple-950 mb-4">
          Complete Payment
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Elements stripe={stripePromise}>
          <StripeCheckoutForm
            orderId={orderId}
            totalAmount={totalAmount}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default StripePaymentModal;