import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

// Add a new review
export const addReview = createAsyncThunk(
  "review/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/review/add",
        {
          productId: reviewData.productId,
          rating: reviewData.rating,
          comment: reviewData.comment.trim(),
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add review"
      );
    }
  }
);

// Get reviews for a product
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/review/product/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/shop/review/delete/${reviewId}`,
        {
          withCredentials: true,
        }
      );
      return { reviewId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "shopReview",
  initialState,
  reducers: {
    resetReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.review) {
          state.reviews.push(action.payload.review);
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      // Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.reviewId) {
          state.reviews = state.reviews.filter(
            (review) => review._id !== action.payload.reviewId
          );
        }
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetReviews } = reviewSlice.actions;
export default reviewSlice.reducer;