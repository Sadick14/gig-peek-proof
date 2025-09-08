import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { Review } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewSummaryProps {
  reviews: Review[];
  className?: string;
}

export function ReviewSummary({ reviews, className }: ReviewSummaryProps) {
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return (
      <Card className={cn("bg-gradient-card border-border/50", className)}>
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No reviews yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to review this service
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  const roundedRating = Math.round(averageRating * 10) / 10;

  // Calculate rating distribution
  const ratingCounts = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;
    return {
      rating,
      count: reviews.filter(review => review.rating === rating).length,
      percentage: (reviews.filter(review => review.rating === rating).length / totalReviews) * 100
    };
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
              ? 'fill-yellow-400/50 text-yellow-400' 
              : 'text-muted-foreground'
        )}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4.0) return 'text-yellow-500';
    if (rating >= 3.0) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className={cn("bg-gradient-card border-border/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className={cn("text-4xl font-bold", getRatingColor(roundedRating))}>
              {roundedRating}
            </div>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(roundedRating)}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 min-w-[60px]">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress 
                  value={percentage} 
                  className="flex-1 h-2"
                />
                <span className="text-sm text-muted-foreground min-w-[30px]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round((reviews.filter(r => r.rating === 5).length / totalReviews) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">5 Star</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}