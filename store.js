
import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./CartReducer";
import authReducer from './authReducer';
import addressReducer from './addressReducer';
import wishlistReducer from './wishlistReducer';
import thunk from 'redux-thunk';

export default configureStore ({
  reducer: {
    cart: CartReducer,
    auth: authReducer,
    addresses: addressReducer,
    wishlist: wishlistReducer,
  },
  middleware: thunk,
});
