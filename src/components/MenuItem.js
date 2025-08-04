import React from 'react';
import { Star, Clock, Plus } from 'lucide-react';

const MenuItem = ({ item, addToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-6xl">{item.image}</div>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm text-gray-600">{item.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock size={14} />
            <span className="text-sm">{item.time}</span>
          </div>
          <span className="text-2xl font-bold text-orange-600">${item.price}</span>
        </div>
        
        <button 
          onClick={() => addToCart(item)}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <Plus size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItem;