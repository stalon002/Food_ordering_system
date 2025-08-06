import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import ItemModal from './ItemModal';

const MenuItem = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = async () => {
    if (item.customizations && item.customizations.length > 0) {
      // If item has customizations, show modal instead
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      addItem(item, 1);
      // Optional: Show success toast
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price.toFixed(2)}`;
  };

  const isDiscounted = item.originalPrice && item.originalPrice > item.price;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Item Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={item.image || '/placeholder-food.jpg'}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/placeholder-food.jpg';
            }}
          />
          
          {/* Discount Badge */}
          {isDiscounted && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
            </div>
          )}

          {/* Availability Badge */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          {item.isAvailable && (
            <button
              onClick={handleQuickAdd}
              disabled={isLoading}
              className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors duration-200 shadow-lg"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Item Details */}
        <div className="p-4">
          <div className="mb-2">
            <h3 
              className="font-semibold text-gray-900 text-lg mb-1 cursor-pointer hover:text-orange-600 transition-colors"
              onClick={() => setShowModal(true)}
            >
              {item.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {item.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-orange-600">
                {formatPrice(item.price)}
              </span>
              {isDiscounted && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {item.rating && (
              <div className="flex items-center">
                <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-sm text-gray-600">{item.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Dietary Info */}
          {item.dietaryInfo && item.dietaryInfo.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.dietaryInfo.map((info, index) => (
                <span 
                  key={index}
                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {info}
                </span>
              ))}
            </div>
          )}

          {/* Preparation Time */}
          {item.prepTime && (
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.prepTime} min
            </div>
          )}

          {/* Customization Indicator */}
          {item.customizations && item.customizations.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-orange-600 font-medium">
                Customizable • {item.customizations.length} options
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {showModal && (
        <ItemModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MenuItem;