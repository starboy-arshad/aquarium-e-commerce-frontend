import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token ? {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userInfo.token}`,
    } : {
      'Content-Type': 'application/json',
    };
  };


  // Handle auth state changes - load appropriate cart based on login status
  useEffect(() => {
    if (user) {
      // User logged in - load database cart and merge with any local cart
      const loadAndMergeCarts = async () => {
        try {
          setIsLoading(true);
          const response = await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/cart', {
            headers: getAuthHeaders(),
          });
          
          if (response.ok) {
            const cartData = await response.json();
            const dbItems = cartData.items.map(item => ({
              id: item.product?._id || item.productId || item.product,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            }));

            // Merge guest cart (if any) with database cart
            const mergedItems = [...dbItems];
            cartItems.forEach(localItem => {
              const existingItem = mergedItems.find(item => item.id === localItem.id);
              if (existingItem) {
                existingItem.quantity += localItem.quantity;
              } else {
                mergedItems.push(localItem);
              }
            });

            setCartItems(mergedItems);
            // Sync merged cart to database
            await syncCartItemsToDatabase(mergedItems);
          } else {
            // No database cart exists, sync local cart to database
            await syncCartItemsToDatabase(cartItems);
          }
        } catch (error) {
          console.error('Error loading and merging carts:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadAndMergeCarts();
    } else {
      // User logged out - load cart from localStorage
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('cart');
        setCartItems([]);
      }
    }
  }, [user]);

  // Save cart to localStorage whenever cartItems change (only if not logged in)
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    console.log('addToCart called with:', { product, quantity, user });
    
    if (user) {
      // Sync with database
      try {
        console.log('Adding to cart for logged-in user');
        const response = await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/cart', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
          }),
        });
        console.log('Cart API response:', response.status);
        if (response.ok) {
          const cartData = await response.json();
          console.log('Cart data received:', cartData);
          // Update local state with database response
          const transformedItems = cartData.items.map(item => ({
            id: item.product?._id || item.productId || item.product,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }));
          setCartItems(transformedItems);
          console.log('Cart items updated:', transformedItems);
        } else {
          console.error('Failed to add to cart, response status:', response.status);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Update local state only
      console.log('Adding to cart for guest user');
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product._id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevItems, {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
          }];
        }
      });
      console.log('Guest cart updated');
    }
  };

  const removeFromCart = async (id) => {
    if (user) {
      try {
        const deleteResponse = await fetch(`https://p01--backend--fbt2wjdzbm9v.code.run/api/cart/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (deleteResponse.ok) {
          // Update local state only if delete was successful
          setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } else {
          console.error('Failed to delete item from cart, response status:', deleteResponse.status);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Update local state only
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (user) {
      try {
        const updateResponse = await fetch(`https://p01--backend--fbt2wjdzbm9v.code.run/api/cart/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ quantity }),
        });
        if (updateResponse.ok) {
          // Update local state
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          );
        } else {
          console.error('Failed to update cart quantity, response status:', updateResponse.status);
        }
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    } else {
      // Update local state only
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Helper function to sync cart items to database
  const syncCartItemsToDatabase = async (items) => {
    if (!user) return;

    try {
      // Clear existing cart and add all items
      await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/cart', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      // Add each item to database
      for (const item of items) {
        await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/cart', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }),
        });
      }
    } catch (error) {
      console.error('Error syncing cart to database:', error);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/cart', {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
