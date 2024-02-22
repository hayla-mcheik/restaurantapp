// Wishlist Reducer
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "WishlistList",
  initialState: {
    WishlistList: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.WishlistList = action.payload.WishlistList;
    },
    addToWishlist: (state, action) => {
      const newItem = action.payload;
        state.WishlistList.push(newItem);
    },
    
    removefromWishlist: (state, action) => {
      state.WishlistList = state.WishlistList.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setWishlist, addToWishlist, removefromWishlist } = wishlistSlice.actions;

export const selectWishlist = (state) => state.wishlist.WishlistList;


export default wishlistSlice.reducer;
