import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [],
};

export const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter((address) => address.id !== action.payload);
    },
  },
});

export const { setAddresses, addAddress, deleteAddress } = addressSlice.actions;

export const selectAddresses = (state) => state.addresses.addresses;

export default addressSlice.reducer;
