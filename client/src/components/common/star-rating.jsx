import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import PropTypes from 'prop-types';

function StarRatingComponent({ rating = 0, handleRatingChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={`star-${star}`}
          className={`h-5 w-5 ${
            star <= (rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleRatingChange && handleRatingChange(star)}
        />
      ))}
    </div>
  );
}

StarRatingComponent.propTypes = {
  rating: PropTypes.number,
  handleRatingChange: PropTypes.func
};

export default StarRatingComponent;
