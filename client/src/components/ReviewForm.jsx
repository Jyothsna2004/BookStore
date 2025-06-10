import React, { useState, useEffect } from 'react';
import { StarIcon, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, getReviews, deleteReview } from '@/store/shop/review-slice';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { reviews, isLoading } = useSelector((state) => state.shopReview);

  useEffect(() => {
    if (productId) {
      dispatch(getReviews(productId));
    }
  }, [productId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a review',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please write a comment for your review',
        variant: 'destructive',
      });
      return;
    }

    try {
      const reviewData = {
        productId,
        rating: rating,
        comment: comment.trim(),
      };

      const result = await dispatch(addReview(reviewData));
      
      if (addReview.fulfilled.match(result)) {
        toast({
          title: 'Success!',
          description: 'Your review has been added successfully',
        });
        // Reset form
        setRating(0);
        setComment('');
        setHoveredRating(0);
      } else {
        throw new Error(result.payload || 'Failed to add review');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (reviewId) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete reviews',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await dispatch(deleteReview(reviewId));
      
      if (deleteReview.fulfilled.match(result)) {
        toast({
          title: 'Success!',
          description: 'Review deleted successfully',
        });
      } else {
        throw new Error(result.payload || 'Failed to delete review');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const canUserDeleteReview = (review) => {
    return user && (user.id === review.user?._id || user.id === review.userId);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
      
      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-colors"
                >
                  <StarIcon
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Your Review</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="min-h-[80px]"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || rating === 0 || !comment.trim()}
            className="w-full"
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}

      {!user && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50 text-blue-800">
          <p className="text-sm">Please log in to write a review.</p>
        </div>
      )}

      <Separator className="my-4" />

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading && reviews.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (review.rating || review.reviewValue)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {review.user?.name || review.userName || 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {canUserDeleteReview(review) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(review._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.comment || review.reviewMessage}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewForm;