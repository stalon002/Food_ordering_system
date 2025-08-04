import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

const Cart = ({ isOpen, cartItems, updateQuantity, removeFromCart, toggleCart }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-orange-600 font-semibold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-700"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
      
      {showCheckout && (
        <CheckoutModal 
          total={total} 
          onClose={() => setShowCheckout(false)} 
          cartItems={cartItems}
        />
      )}
    </div>
  );
};

export default Cart;