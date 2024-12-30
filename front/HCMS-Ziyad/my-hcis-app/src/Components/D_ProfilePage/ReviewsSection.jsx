import React, { useState, useContext } from "react";
import Profile_Reviews from "./Profile_Reviews";
import { ReviewsDataContext } from "../D_PatientList/RevWithPatients";

const ReviewsSection = () => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewsData = useContext(ReviewsDataContext);

  const displayedReviews = showAllReviews ? reviewsData : reviewsData.slice(0, 4);

  return (
    <div className="reviews-section">
      <h4>Reviews</h4>
      <div className="review-cards">
        {displayedReviews.map((review) => (
          <Profile_Reviews
            key={review.patient_id}
            img={review.image}
            name={review.patientName}
            job={review.job}
            date={review.date}
            ratings={review.rating}
            content={review.comment}
          />
        ))}
      </div>
      {reviewsData.length > 4 && (
        <button className="see-more-button" onClick={() => setShowAllReviews(!showAllReviews)}>
          {showAllReviews ? "Show Less" : "+ See More"}
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;