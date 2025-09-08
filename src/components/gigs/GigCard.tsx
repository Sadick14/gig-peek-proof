import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Heart, Eye, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Gig } from '@/types';
import { cn } from '@/lib/utils';

interface GigCardProps {
  gig: Gig;
  onViewGig?: (gig: Gig) => void;
  onContactSeller?: (sellerId: string) => void;
  onToggleFavorite?: (gigId: string) => void;
  isFavorited?: boolean;
  className?: string;
}

export function GigCard({ 
  gig, 
  onViewGig, 
  onContactSeller, 
  onToggleFavorite, 
  isFavorited = false,
  className 
}: GigCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleViewGig = () => {
    onViewGig?.(gig);
  };

  const handleContactSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContactSeller?.(gig.sellerId);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(gig.id);
  };

  const basicPackage = gig.packages.find(p => p.type === 'basic');
  const lowestPrice = Math.min(...gig.packages.map(p => parseFloat(p.price)));

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-elegant bg-gradient-card border-border/50 overflow-hidden",
        className
      )}
      onClick={handleViewGig}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {gig.images.length > 0 && (
          <>
            <img
              src={gig.images[currentImageIndex]}
              alt={gig.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                isImageLoading && "blur-sm"
              )}
              onLoad={() => setIsImageLoading(false)}
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
          </>
        )}
        
        {/* Image Navigation Dots */}
        {gig.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {gig.images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentImageIndex 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Favorite Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 p-2 h-auto bg-black/20 hover:bg-black/40 text-white"
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={cn(
              "w-4 h-4",
              isFavorited ? "fill-red-500 text-red-500" : "text-white"
            )} 
          />
        </Button>

        {/* Online Status */}
        {gig.seller.isOnline && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-green-500/90 text-white border-none"
          >
            Online
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Seller Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={gig.seller.avatar} alt={gig.seller.displayName} />
            <AvatarFallback className="text-xs">
              {gig.seller.displayName?.charAt(0) || gig.seller.address.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium truncate">
              {gig.seller.displayName || `${gig.seller.address.slice(0, 6)}...`}
            </span>
            <Badge 
              variant="outline" 
              className="text-xs px-1.5 py-0.5 h-auto"
              style={{ 
                borderColor: gig.seller.level.color,
                color: gig.seller.level.color 
              }}
            >
              {gig.seller.level.name}
            </Badge>
            {gig.seller.isVerified && (
              <CheckCircle className="w-3 h-3 text-blue-500" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 leading-5">
          {gig.title}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{gig.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({gig.reviewCount} reviews)
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {gig.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 h-auto">
              {tag}
            </Badge>
          ))}
          {gig.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto">
              +{gig.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {gig.impressions}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {gig.totalOrders}
          </div>
          {basicPackage && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {basicPackage.deliveryTime}d delivery
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Starting at</span>
          <span className="text-lg font-bold">
            {lowestPrice.toFixed(3)} ETH
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleContactSeller}
            className="h-8 px-3 text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Contact
          </Button>
          <Button 
            size="sm" 
            className="h-8 px-3 text-xs bg-primary hover:bg-primary/90"
          >
            View Gig
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}