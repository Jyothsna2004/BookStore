import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  wishlistItems: [],
  isLoading: false,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId) => {
    const response = await axios.get(`http://localhost:5000/api/shop/wishlist/${userId}`);
    return response.data.data.map(item => item.productId);
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }) => {
    const response = await axios.post("http://localhost:5000/api/shop/wishlist/add", { userId, productId });
    return response.data.data.map(item => item.productId);
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }) => {
    const response = await axios.delete("http://localhost:5000/api/shop/wishlist/remove", { data: { userId, productId } });
    return response.data.data.map(item => item.productId);
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.isLoading = false;
        state.wishlistItems = [];
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 