import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  restaurantId: null,
  deliveryFee: 0,
  tax: 0,
  discount: 0,
  isOpen: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity = 1, customizations = [] } = action.payload;
      const existingItemIndex = state.items.findIndex(
        cartItem => 
          cartItem.id === item.id && 
          JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        const newItem = {
          ...item,
          quantity,
          customizations,
          cartId: Date.now() + Math.random()
        };
        newItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: newItems,
        restaurantId: state.restaurantId || item.restaurantId,
        total: calculateTotal(newItems, state.deliveryFee, state.tax, state.discount),
        itemCount: calculateItemCount(newItems)
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.cartId !== action.payload);
      return {
        ...state,
        items: newItems,
        restaurantId: newItems.length > 0 ? state.restaurantId : null,
        total: calculateTotal(newItems, state.deliveryFee, state.tax, state.discount),
        itemCount: calculateItemCount(newItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { cartId, quantity } = action.payload;
      const newItems = quantity > 0
        ? state.items.map(item =>
            item.cartId === cartId ? { ...item, quantity } : item
          )
        : state.items.filter(item => item.cartId !== cartId);

      return {
        ...state,
        items: newItems,
        restaurantId: newItems.length > 0 ? state.restaurantId : null,
        total: calculateTotal(newItems, state.deliveryFee, state.tax, state.discount),
        itemCount: calculateItemCount(newItems)
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialState,
        isOpen: state.isOpen
      };

    case 'SET_DELIVERY_FEE':
      return {
        ...state,
        deliveryFee: action.payload,
        total: calculateTotal(state.items, action.payload, state.tax, state.discount)
      };

    case 'SET_TAX':
      return {
        ...state,
        tax: action.payload,
        total: calculateTotal(state.items, state.deliveryFee, action.payload, state.discount)
      };

    case 'SET_DISCOUNT':
      return {
        ...state,
        discount: action.payload,
        total: calculateTotal(state.items, state.deliveryFee, state.tax, action.payload)
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };

    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

const calculateTotal = (items, deliveryFee = 0, tax = 0, discount = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.price + (item.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0);
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  return Math.max(0, subtotal + deliveryFee + tax - discount);
};

const calculateItemCount = (items) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      total: state.total,
      itemCount: state.itemCount,
      restaurantId: state.restaurantId,
      deliveryFee: state.deliveryFee,
      tax: state.tax,
      discount: state.discount
    }));
  }, [state.items, state.total, state.itemCount, state.restaurantId, state.deliveryFee, state.tax, state.discount]);

  const addItem = (item, quantity = 1, customizations = []) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { item, quantity, customizations }
    });
  };

  const removeItem = (cartId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const setDeliveryFee = (fee) => {
    dispatch({ type: 'SET_DELIVERY_FEE', payload: fee });
  };

  const setTax = (tax) => {
    dispatch({ type: 'SET_TAX', payload: tax });
  };

  const setDiscount = (discount) => {
    dispatch({ type: 'SET_DISCOUNT', payload: discount });
  };

  const getSubtotal = () => {
    return state.items.reduce((sum, item) => {
      const itemPrice = item.price + (item.customizations?.reduce((sum, custom) => sum + custom.price, 0) || 0);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    setDeliveryFee,
    setTax,
    setDiscount,
    getSubtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};