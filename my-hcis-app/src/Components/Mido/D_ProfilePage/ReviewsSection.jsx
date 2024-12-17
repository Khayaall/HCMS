import React, { useState } from "react";
import Profile_Reviews from "./Profile_Reviews";


const ReviewsSection = () => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews = [
    { id: 1, title: "Great Doctor", content: "Dr. John Doe is very professional and kind.", rating: 5, date: "2023-01-01" },
    { id: 2, title: "Highly Recommend", content: "I had a great experience with Dr. John Doe.", rating: 4.5, date: "2023-02-15" },
    { id: 3, title: "Very Satisfied", content: "Dr. John Doe is very knowledgeable.", rating: 4, date: "2023-03-10" },
    { id: 4, title: "Excellent Service", content: "Dr. John Doe provided excellent service.", rating: 5, date: "2023-04-05" },
    { id: 5, title: "Friendly and Professional", content: "Dr. John Doe is friendly and professional.", rating: 4.5, date: "2023-05-20" },
    { id: 6, title: "Friendly and Professional", content: "Dr. John Doe is friendly and professional.", rating: 4.5, date: "2023-05-20" },
    { id: 7, title: "Friendly and Professional", content: "Dr. John Doe is friendly and professional.", rating: 4.5, date: "2023-05-20" },
    // Add more reviews as needed
  ];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  return (
    <div className="reviews-section">
      <h4>Reviews</h4>
      <div className="review-cards">
        {displayedReviews.map((review) => (
          <Profile_Reviews
            key={review.id}
            img="https://via.placeholder.com/150"
            name="Dr. John Doe"
            specialty="Cardiologist"
            date={review.date}
            ratings={review.rating}
            content={review.content}
          />
        ))}
      </div>
      {reviews.length > 4 && (
        <button className="see-more-button" onClick={() => setShowAllReviews(!showAllReviews)}>
          {showAllReviews ? "Show Less" : "+ See More"}
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;