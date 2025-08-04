import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 text-orange-400">FoodieHub</h4>
            <p className="text-gray-300">Delivering happiness one meal at a time.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-orange-400">Menu</a></li>
              <li><a href="#" className="hover:text-orange-400">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact Info</h5>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <Phone size={16} className="mr-2" /> +254 123 456 789
              </p>
              <p className="flex items-center">
                <MapPin size={16} className="mr-2" /> Nairobi, Kenya
              </p>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Hours</h5>
            <div className="text-gray-300">
              <p>Mon-Sun: 9:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FoodieHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;