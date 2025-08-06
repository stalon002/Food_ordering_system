import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import OrderTimer from './OrderTimer';

const OrderConfirmation = ({ orderId, onClose }) => {
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      clearCart(); // Clear cart after successful order
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        setError('Failed to load order details');
      }
    } catch (error) {
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Order Details */}
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">Order ID</span>
            <span className="text-sm font-mono text-gray-900">#{order.id}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">Restaurant</span>
            <span className="text-sm text-gray-900">{order.restaurant?.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">Total Amount</span>
            <span className="text-sm font-bold text-gray-900">KSh {order.total?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Payment Method</span>
            <span className="text-sm text-gray-900">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
          <div className="text-sm text-gray-600">
            <p>{order.deliveryAddress?.fullName}</p>
            <p>{order.deliveryAddress?.streetAddress}</p>
            <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
            <p>{order.deliveryAddress?.phone}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {item.customizations.map(c => c.name).join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  KSh {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery Time */}
        <div className="mb-6">
          <OrderTimer 
            estimatedTime={order.estimatedDeliveryTime} 
            status={order.status}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = `/orders/${order.id}/track`}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700"
          >
            Track Your Order
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Need help? Contact us at +254 700 000 000</p>
          <p>or email support@foodapp.com</p>
        </div>
      </div>
    </div>
  );
};
export default OrderConfirmation;