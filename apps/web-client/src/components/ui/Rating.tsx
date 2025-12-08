import React from 'react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { star: 'w-4 h-4', text: 'text-sm', gap: 'gap-0.5' },
  md: { star: 'w-5 h-5', text: 'text-base', gap: 'gap-1' },
  lg: { star: 'w-6 h-6', text: 'text-lg', gap: 'gap-1.5' },
};

const StarIcon: React.FC<{ filled: boolean; partial?: number; className?: string }> = ({
  filled,
  partial,
  className = '',
}) => {
  if (partial !== undefined && partial > 0 && partial < 1) {
    return (
      <div className={`relative ${className}`}>
        <svg
          className="w-full h-full text-charcoal-200"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${partial * 100}%` }}
        >
          <svg
            className="w-full h-full text-gold-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <svg
      className={`${className} ${filled ? 'text-gold-500' : 'text-charcoal-200'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
};

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  showNumber = true,
  reviewCount,
  size = 'md',
  className = '',
}) => {
  const styles = sizeStyles[size];

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starNumber = index + 1;
    if (rating >= starNumber) {
      return <StarIcon key={index} filled className={styles.star} />;
    } else if (rating > starNumber - 1) {
      return <StarIcon key={index} filled={false} partial={rating - (starNumber - 1)} className={styles.star} />;
    }
    return <StarIcon key={index} filled={false} className={styles.star} />;
  });

  return (
    <div className={`inline-flex items-center ${styles.gap} ${className}`}>
      <div className={`flex items-center ${styles.gap}`}>
        {stars}
      </div>
      {showNumber && (
        <span className={`font-semibold text-charcoal-900 ${styles.text}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-charcoal-500 ${styles.text}`}>
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
};

export default Rating;
