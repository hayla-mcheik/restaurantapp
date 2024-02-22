import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    cartCount: 0,
    cartDetails: [],
    itemQuantities:[],
  },
  reducers: {
    setInitialCartCount: (state, action) => {
      state.cartCount = action.payload;
      console.log('cart count:' , state.cartCount);
    },

    setCart: (state , action) => {
      state.cartDetails = action.payload;
      console.log('set cart : ' , action.payload);
    },

    manageItemQuantities: (state, action) => {
      const { itemId, quantity } = action.payload;
      state.itemQuantities[itemId] = quantity;
    },
    
    addToCart: (state, action) => {
      const itemInCartIndex = state.cart.findIndex((item) => item.id === action.payload.id);
      
      if (itemInCartIndex !== -1) {
        state.cart[itemInCartIndex].quantity += action.payload.quantity;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }  
      state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cart.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        state.cart[itemIndex].quantity = quantity;
      }
      state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    },



    removeFromCart: (state, action) => {
      const removeFromCart = state.cart.filter((item) => item.id !== action.payload.id);
      console.log('remove from cart:' , removeFromCart);
      state.cart = removeFromCart;
      state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    },

    incrementQuantity: (state, action) => {
      const itemInCart = state.cart.find((item) => item.id === action.payload.id);
      itemInCart.quantity++;
      state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    },

    decrementQuantity: (state, action) => {
      const itemInCartIndex = state.cart.findIndex((item) => item.id === action.payload.id);
      if (itemInCartIndex !== -1) {
        state.cart[itemInCartIndex].quantity -= action.payload.quantity;
    
        if (state.cart[itemInCartIndex].quantity <= 0) {
          state.cart.splice(itemInCartIndex, 1);
        }
    
      } 
    
      state.cartCount = state.cart.length;
    },
    
    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
    },

    updateCartDetails: (state, action) => {

      const itemInCartIndex = state.cart.findIndex((item) => item.id === action.payload.id);

      if (itemInCartIndex !== -1) {
        const cartItem = state.cart[itemInCartIndex];
        cartItem.details = action.payload.details;
        state.cartDetails = state.cart.map(cartItem => ({
          ...cartItem,
          details: state.cartDetails.find(detail => detail.id === cartItem.id)?.details || [],
        }));
      }
    },

  },
});

export const {setCart , manageItemQuantities ,  addToCart, updateCartItemQuantity , setInitialCartCount, removeFromCart, incrementQuantity, decrementQuantity, clearCart , updateCartDetails, } = cartSlice.actions;
export const selectCart = (state) => state.cart.cartDetails;
export const selectCartCount = (state) => state.cart.cartCount;
export default cartSlice.reducer;
