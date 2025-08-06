import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './ui/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmation from './components/order/OrderConfirmation';

function App() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleOrderComplete = (order) => {
    setCompletedOrder(order);
    setShowCheckout(false);
  };

  const handleCloseOrderConfirmation = () => {
    setCompletedOrder(null);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Header onOpenCheckout={() => setShowCheckout(true)} />
            
            <main>
              <HeroSection />
              <MenuSection />
            </main>
            
            <Footer />
            
            {/* Cart Sidebar */}
            <Cart />
            
            {/* Checkout Modal */}
            <CheckoutModal 
              isOpen={showCheckout}
              onClose={() => setShowCheckout(false)}
              onOrderComplete={handleOrderComplete}
            />
            
            {/* Order Confirmation Modal */}
            {completedOrder && (
              <OrderConfirmation 
                orderId={completedOrder.id}
                onClose={handleCloseOrderConfirmation}
              />
            )}
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;