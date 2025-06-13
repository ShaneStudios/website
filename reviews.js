import { reviews } from './ratings.js';
document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('average-rating-summary');
    const listContainer = document.getElementById('review-list-container');
    if (!summaryContainer || !listContainer) {
        console.error("Required containers not found on the page.");
        return;
    }
    if (!reviews || reviews.length === 0) {
        summaryContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star-half-alt"></i>
                <p>There are no reviews yet. Be the first to share your feedback!</p>
                <div class="empty-state-actions">
                    <a href="contact.html" class="action-button">Submit a Review</a>
                    <a href="review_guidelines.html" class="action-button secondary">View Guidelines</a>
                </div>
            </div>
        `;
        return;
    }
    const ratingValues = reviews.map(r => r.rating);
    const totalCount = reviews.length;
    const sumOfRatings = ratingValues.reduce((acc, val) => acc + val, 0);
    const averageRating = sumOfRatings / totalCount;
    const roundedAverage = Math.round(averageRating * 10) / 10;
    const createStarsHTML = (rating) => {
        const percentage = (rating / 5) * 100;
        return `
            <div class="stars-container" title="${rating} out of 5 stars">
                <div class="stars-background">
                    <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
                </div>
                <div class="stars-foreground" style="width: ${percentage}%">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
            </div>
        `;
    };
    summaryContainer.innerHTML = `
        <div class="summary-display">
            <div class="summary-score">${roundedAverage.toFixed(1)}</div>
            <div class="summary-details">
                ${createStarsHTML(roundedAverage)}
                <div class="summary-count">Based on ${totalCount} reviews</div>
            </div>
        </div>
        <div class="guidelines-link-container">
            <a href="review_guidelines.html">Read Our Review Guidelines</a>
        </div>
    `;
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';

        card.innerHTML = `
            <div class="review-header">
                <span class="name">${review.name}</span>
                <span class="date">${new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="review-body">
                ${createStarsHTML(review.rating)}
                <p>${review.message}</p>
            </div>
        `;
        listContainer.appendChild(card);
    });
});