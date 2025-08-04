import React from 'react';
import { ShoppingCart, MapPin } from 'lucide-react';

const Header = ({ cartItems, toggleCart, isCartOpen }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-orange-600">FoodieHub</h1>
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">Nairobi, Kenya</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#menu" className="text-gray-700 hover:text-orange-600 font-medium">Menu</a>
            <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium">Contact</a>
          </nav>
          
          <button 
            onClick={toggleCart}
            className="relative bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;