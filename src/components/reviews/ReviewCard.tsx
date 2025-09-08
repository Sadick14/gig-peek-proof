import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import { Review } from '@/types';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
  onReply?: (reviewId: string) => void;
  showReplyButton?: boolean;
  className?: string;
}

export function ReviewCard({ 
  review, 
  onHelpful, 
  onNotHelpful, 
  onReply,
  showReplyButton = false,
  className 
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-muted-foreground'
        )}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'text-green-500';
    if (rating >= 4) return 'text-yellow-500';
    if (rating >= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className={cn("bg-gradient-card border-border/50", className)}>
      <CardContent className="p-6">
        {/* Reviewer Info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.displayName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {review.reviewer.displayName?.charAt(0) || review.reviewer.address.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{review.reviewer.displayName || `User ${review.reviewer.address.slice(0, 6)}...`}</h4>
              {review.reviewer.isVerified && (
                <Badge variant="secondary" className="h-5 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{review.reviewer.level.name}</span>
              <span>•</span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {renderStars(review.rating)}
              <span className={cn("font-bold ml-2", getRatingColor(review.rating))}>
                {review.rating}.0
              </span>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="space-y-3">
          <p className="text-foreground leading-relaxed">{review.comment}</p>
          
          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-border/50 cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful?.(review.id)}
              className="text-muted-foreground hover:text-green-500"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful ({review.helpful})
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNotHelpful?.(review.id)}
              className="text-muted-foreground hover:text-red-500"
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              Not Helpful ({review.notHelpful})
            </Button>
          </div>
          
          {showReplyButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReply?.(review.id)}
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>
          )}
        </div>

        {/* Seller Response */}
        {review.response && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-primary">Seller Response</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(review.response.createdAt)}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{review.response.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}