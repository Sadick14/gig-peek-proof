import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  Star,
  Clock,
  DollarSign,
  User,
  Grid3X3,
  List
} from 'lucide-react';
import { SearchFilters } from '@/types';
import { CATEGORIES, SORT_OPTIONS, DELIVERY_TIME_OPTIONS, SELLER_LEVEL_OPTIONS } from '@/constants';

interface MarketplaceSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults?: number;
}

export function MarketplaceSearch({
  filters,
  onFiltersChange,
  onSearch,
  isLoading = false,
  viewMode,
  onViewModeChange,
  totalResults = 0
}: MarketplaceSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = { query: localFilters.query || '' };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    key => key !== 'query' && localFilters[key as keyof SearchFilters] !== undefined
  );

  const selectedCategory = CATEGORIES.find(cat => cat.id === localFilters.category);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for services..."
                value={localFilters.query || ''}
                onChange={(e) => updateFilter('query', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary text-primary-foreground' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {Object.keys(localFilters).filter(key => 
                    key !== 'query' && localFilters[key as keyof SearchFilters] !== undefined
                  ).length}
                </Badge>
              )}
            </Button>
            <Button onClick={onSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {totalResults.toLocaleString()} services available
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select 
            value={localFilters.sortBy || 'relevance'} 
            onValueChange={(value) => updateFilter('sortBy', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Filter Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Category</Label>
                <Select 
                  value={localFilters.category || ''} 
                  onValueChange={(value) => updateFilter('category', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Subcategory Filter */}
                {selectedCategory && (
                  <Select 
                    value={localFilters.subcategory || ''} 
                    onValueChange={(value) => updateFilter('subcategory', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subcategories</SelectItem>
                      {selectedCategory.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range (ETH)
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Delivery Time
                </Label>
                <div className="space-y-2">
                  {DELIVERY_TIME_OPTIONS.map((option) => (
                    <div key={option.label} className="flex items-center space-x-2">
                      <Checkbox
                        id={`delivery-${option.label}`}
                        checked={
                          localFilters.deliveryTime?.[0] === option.value[0] &&
                          localFilters.deliveryTime?.[1] === option.value[1]
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('deliveryTime', option.value);
                          } else {
                            updateFilter('deliveryTime', undefined);
                          }
                        }}
                      />
                      <Label htmlFor={`delivery-${option.label}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Level */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  <User className="w-4 h-4 inline mr-1" />
                  Seller Level
                </Label>
                <div className="space-y-2">
                  {SELLER_LEVEL_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${option.value}`}
                        checked={localFilters.sellerLevel?.includes(option.value) || false}
                        onCheckedChange={(checked) => {
                          const currentLevels = localFilters.sellerLevel || [];
                          if (checked) {
                            updateFilter('sellerLevel', [...currentLevels, option.value]);
                          } else {
                            updateFilter('sellerLevel', currentLevels.filter(level => level !== option.value));
                          }
                        }}
                      />
                      <Label htmlFor={`level-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pro-delivery"
                    checked={localFilters.proDelivery || false}
                    onCheckedChange={(checked) => updateFilter('proDelivery', checked || undefined)}
                  />
                  <Label htmlFor="pro-delivery" className="text-sm">Pro Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="online-sellers"
                    checked={localFilters.onlineSellers || false}
                    onCheckedChange={(checked) => updateFilter('onlineSellers', checked || undefined)}
                  />
                  <Label htmlFor="online-sellers" className="text-sm">Online Sellers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="min-rating"
                    checked={(localFilters.rating || 0) >= 4.5}
                    onCheckedChange={(checked) => updateFilter('rating', checked ? 4.5 : undefined)}
                  />
                  <Label htmlFor="min-rating" className="text-sm flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    4.5+ Rating
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={onSearch} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}