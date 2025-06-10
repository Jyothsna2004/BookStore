import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect } from "react";
import { getReviews } from "@/store/shop/review-slice";
import ReviewForm from "../ReviewForm";
import PropTypes from 'prop-types';

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} items in stock`,
            description: `You already have ${getQuantity} in your cart`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Success!",
          description: "Product added to cart",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add product to cart",
          variant: "destructive",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  // Fetch reviews when dialog opens with product details
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails?._id, dispatch]);

  // Calculate average rating
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + (reviewItem.rating || reviewItem.reviewValue), 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="relative max-w-4xl w-full max-h-[90vh] p-0 bg-white rounded-lg shadow-lg">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <DialogDescription className="sr-only">View and purchase product details</DialogDescription>
        {/* Close Button */}
        <button
          onClick={handleDialogClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
          {/* Left Column: Book Image and Basic Info */}
          <div className="flex flex-col items-center justify-start p-8 border-r border-gray-200 bg-gray-50">
            <div className="w-full max-w-sm">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="w-full h-auto max-h-80 object-cover rounded-lg mb-6 shadow-md"
              />
              
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">{productDetails?.title}</h1>
                
                {/* Rating Display */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <StarRatingComponent rating={averageReview} />
                  <span className="text-sm text-gray-600">
                    ({averageReview.toFixed(1)}) • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {productDetails?.salePrice > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        ₹{productDetails?.price}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{productDetails?.salePrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{productDetails?.price}
                    </span>
                  )}
                </div>

                {/* Add to Cart or Download PDF Button */}
                <div className="w-full">
                  {productDetails?.isDigital ? (
                    productDetails?.pdfUrl ? (
                      <Button
                        className="w-full"
                        onClick={() => window.open(productDetails.pdfUrl, '_blank')}
                      >
                        Download PDF
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        disabled
                        variant="secondary"
                      >
                        PDF Not Available
                      </Button>
                    )
                  ) : (
                    productDetails?.totalStock === 0 ? (
                      <Button 
                        className="w-full" 
                        disabled
                        variant="secondary"
                      >
                        Out of Stock
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleAddToCart(productDetails?._id, productDetails?.totalStock)
                        }
                      >
                        Add to Cart
                      </Button>
                    )
                  )}
                  
                  {!productDetails?.isDigital && productDetails?.totalStock > 0 && productDetails?.totalStock <= 5 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Only {productDetails.totalStock} left in stock!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Description and Reviews */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {productDetails?.description}
              </p>
              {productDetails?.isDigital && (
                <p className="text-sm text-blue-600 mt-2">
                  This is a digital book. After purchase, you can download the PDF version.
                </p>
              )}
            </div>

            {/* Reviews Section - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <ReviewForm productId={productDetails?._id} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
    isDigital: PropTypes.bool,
    pdfUrl: PropTypes.string,
  }),
};

export default ProductDetailsDialog;