import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

const ItemModal = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleCustomizationChange = (customization, isChecked) => {
    setSelectedCustomizations(prev => {
      if (isChecked) {
        return [...prev, customization];
      } else {
        return prev.filter(c => c.id !== customization.id);
      }
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price * quantity;
    const customizationPrice = selectedCustomizations.reduce((sum, c) => sum + c.price, 0) * quantity;
    return basePrice + customizationPrice;
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addItem(item, quantity, selectedCustomizations);
      onClose();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img
            src={item.image || '/placeholder-food.jpg'}
            alt={item.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-food.jpg';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 p-2 rounded-full hover:bg-opacity-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Item Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-4">{item.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-orange-600">
                  {formatPrice(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
              
              {item.rating && (
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-gray-600">{item.rating.toFixed(1)} ({item.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            {/* Dietary Info */}
            {item.dietaryInfo && item.dietaryInfo.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.dietaryInfo.map((info, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                  >
                    {info}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Customizations */}
          {item.customizations && item.customizations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customize Your Order</h3>
              <div className="space-y-3">
                {item.customizations.map((customization) => (
                  <div key={customization.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={customization.id}
                        onChange={(e) => handleCustomizationChange(customization, e.target.checked)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor={customization.id} className="ml-3">
                        <span className="text-gray-900 font-medium">{customization.name}</span>
                        {customization.description && (
                          <p className="text-sm text-gray-500">{customization.description}</p>
                        )}
                      </label>
                    </div>
                    {customization.price > 0 && (
                      <span className="text-gray-600">+{formatPrice(customization.price)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
              placeholder="Any special requests for this item..."
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isLoading || !item.isAvailable}
              className={`px-6 py-3 rounded-lg font-medium ${
                isLoading || !item.isAvailable
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </div>
              ) : !item.isAvailable ? (
                'Out of Stock'
              ) : (
                `Add to Cart • ${formatPrice(calculateTotalPrice())}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;