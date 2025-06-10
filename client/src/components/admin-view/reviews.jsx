import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews, deleteReview } from "@/store/shop/review-slice";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function AdminReviews() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { reviews, isLoading } = useSelector((state) => state.shopReview);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const result = await dispatch(deleteReview(reviewId));
      if (deleteReview.fulfilled.match(result)) {
        toast({
          title: "Success!",
          description: "Review deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setSelectedReview(null);
      } else {
        throw new Error(result.payload || "Failed to delete review");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div className="p-4">Loading reviews...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review.product?.title || "N/A"}</TableCell>
                  <TableCell>{review.userName || review.user?.userName || "Anonymous"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating || review.reviewValue)}
                      <span className="ml-1">({review.rating || review.reviewValue})</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.reviewMessage}
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedReview(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedReview && handleDeleteReview(selectedReview._id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminReviews; 