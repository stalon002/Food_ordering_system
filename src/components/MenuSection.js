import React from 'react';
import MenuItem from './MenuItem';

const MenuSection = ({ title, items, addToCart }) => {
  return (
    <div className="mb-12">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <MenuItem key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;