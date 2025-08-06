import React, { useState, useEffect } from 'react';

const OrderTimer = ({ estimatedTime, status }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (estimatedTime && status !== 'delivered' && status !== 'cancelled') {
      const targetTime = new Date(estimatedTime).getTime();
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const difference = targetTime - now;
        
        if (difference > 0) {
          setTimeLeft(Math.floor(difference / 1000));
        } else {
          setTimeLeft(0);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [estimatedTime, status]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600';
      case 'preparing':
        return 'text-yellow-600';
      case 'ready':
        return 'text-purple-600';
      case 'out_for_delivery':
        return 'text-orange-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Processing';
    }
  };

  if (status === 'delivered') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-green-800">Order Delivered!</span>
        </div>
        <p className="text-sm text-green-600 mt-1">Thank you for your order</p>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-medium text-red-800">Order Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <div className="animate-pulse w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {timeLeft > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Estimated delivery: {formatTime(timeLeft)}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">
            {timeLeft > 0 ? formatTime(timeLeft) : '--'}
          </div>
          <p className="text-xs text-gray-500">remaining</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confirmed</span>
          <span>Preparing</span>
          <span>Ready</span>
          <span>Delivered</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: status === 'confirmed' ? '25%' : 
                     status === 'preparing' ? '50%' : 
                     status === 'ready' || status === 'out_for_delivery' ? '75%' : 
                     status === 'delivered' ? '100%' : '0%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimer;