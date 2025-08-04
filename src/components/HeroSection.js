import React from 'react';
import { Star, Clock, Truck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-6">Delicious Food Delivered</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Experience the finest cuisine from the comfort of your home. Fresh ingredients, amazing flavors, delivered fast.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <Clock size={20} />
            <span>30 min delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star size={20} />
            <span>4.8 rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck size={20} />
            <span>Free delivery over $25</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;