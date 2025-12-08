import React, { useState } from 'react';
import { Button, Input } from './ui';
import { Language } from '../types';

interface FilterPanelProps {
  lang: Language;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

export interface FilterState {
  priceMin?: number;
  priceMax?: number;
  starRatings: number[];
  propertyTypes: string[];
  amenities: string[];
  mealPlans: string[];
}

const ChevronIcon: React.FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onClear?: () => void;
  showClear?: boolean;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isOpen,
  onToggle,
  onClear,
  showClear,
  children,
}) => (
  <div className="border-b border-charcoal-100 last:border-b-0">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <span className="font-medium text-charcoal-900">{title}</span>
      <div className="flex items-center gap-2">
        {showClear && onClear && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-xs text-brand-900 hover:text-brand-950 cursor-pointer"
          >
            Clear
          </span>
        )}
        <ChevronIcon isOpen={isOpen} className="text-charcoal-400" />
      </div>
    </button>
    {isOpen && <div className="pb-4">{children}</div>}
  </div>
);

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange, icon }) => (
  <label className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => onChange(!checked)}>
    <div
      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
        checked
          ? 'bg-brand-800 border-brand-800'
          : 'border-charcoal-300 group-hover:border-charcoal-400'
      }`}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white" />}
    </div>
    {icon && <span className="text-charcoal-500">{icon}</span>}
    <span className="text-charcoal-700 group-hover:text-charcoal-900">{label}</span>
  </label>
);

const StarIcon: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-brand-600' : 'text-charcoal-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PROPERTY_TYPES = [
  { value: 'hotel', labelEn: 'Hotel', labelAr: 'فندق' },
  { value: 'resort', labelEn: 'Resort', labelAr: 'منتجع' },
  { value: 'villa', labelEn: 'Villa', labelAr: 'فيلا' },
  { value: 'apartment', labelEn: 'Apartment', labelAr: 'شقة' },
  { value: 'boutique', labelEn: 'Boutique Hotel', labelAr: 'فندق بوتيكي' },
];

const AMENITIES = [
  { value: 'pool', labelEn: 'Pool', labelAr: 'مسبح', icon: '🏊' },
  { value: 'spa', labelEn: 'Spa & Wellness', labelAr: 'سبا وعافية', icon: '💆' },
  { value: 'beachfront', labelEn: 'Beachfront', labelAr: 'على الشاطئ', icon: '🏖️' },
  { value: 'parking', labelEn: 'Free Parking', labelAr: 'موقف مجاني', icon: '🅿️' },
  { value: 'kids', labelEn: 'Kids Friendly', labelAr: 'مناسب للأطفال', icon: '👶' },
  { value: 'adults', labelEn: 'Adults Only', labelAr: 'للبالغين فقط', icon: '🔞' },
  { value: 'wifi', labelEn: 'Free WiFi', labelAr: 'واي فاي مجاني', icon: '📶' },
  { value: 'restaurant', labelEn: 'Restaurant', labelAr: 'مطعم', icon: '🍽️' },
  { value: 'gym', labelEn: 'Gym/Fitness', labelAr: 'صالة رياضية', icon: '🏋️' },
];

const MEAL_PLANS = [
  { value: 'room_only', labelEn: 'Room Only', labelAr: 'غرفة فقط' },
  { value: 'breakfast', labelEn: 'Breakfast Included', labelAr: 'إفطار شامل' },
  { value: 'half_board', labelEn: 'Half Board', labelAr: 'نصف إقامة' },
  { value: 'full_board', labelEn: 'Full Board', labelAr: 'إقامة كاملة' },
  { value: 'all_inclusive', labelEn: 'All Inclusive', labelAr: 'شامل كلياً' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  lang,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  className = '',
}) => {
  const isArabic = lang === Language.AR;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    stars: true,
    propertyType: false,
    amenities: true,
    mealPlan: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleStarChange = (star: number, checked: boolean) => {
    const newStars = checked
      ? [...filters.starRatings, star]
      : filters.starRatings.filter((s) => s !== star);
    onFiltersChange({ ...filters, starRatings: newStars });
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.propertyTypes, type]
      : filters.propertyTypes.filter((t) => t !== type);
    onFiltersChange({ ...filters, propertyTypes: newTypes });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter((a) => a !== amenity);
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const handleMealPlanChange = (plan: string, checked: boolean) => {
    const newPlans = checked
      ? [...filters.mealPlans, plan]
      : filters.mealPlans.filter((p) => p !== plan);
    onFiltersChange({ ...filters, mealPlans: newPlans });
  };

  return (
    <div className={`bg-white rounded-3xl shadow-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-charcoal-900">
          {isArabic ? 'تصفية النتائج' : 'Filter Results'}
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-brand-900 hover:text-brand-950 font-medium"
        >
          {isArabic ? 'مسح الكل' : 'Clear All'}
        </button>
      </div>

      <FilterSection
        title={isArabic ? 'نطاق السعر' : 'Price Range'}
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
        showClear={filters.priceMin !== undefined || filters.priceMax !== undefined}
        onClear={() => onFiltersChange({ ...filters, priceMin: undefined, priceMax: undefined })}
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-charcoal-500 mb-1 block">
              {isArabic ? 'الحد الأدنى' : 'Min'}
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters.priceMin || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMin: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="text-sm"
            />
          </div>
          <div className="flex items-end pb-3 text-charcoal-400">—</div>
          <div className="flex-1">
            <label className="text-xs text-charcoal-500 mb-1 block">
              {isArabic ? 'الحد الأقصى' : 'Max'}
            </label>
            <Input
              type="number"
              placeholder="5000"
              value={filters.priceMax || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMax: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-charcoal-400 mt-2">
          {isArabic ? 'السعر لكل ليلة بالريال السعودي' : 'Price per night in SAR'}
        </p>
      </FilterSection>

      <FilterSection
        title={isArabic ? 'تصنيف النجوم' : 'Star Rating'}
        isOpen={openSections.stars}
        onToggle={() => toggleSection('stars')}
        showClear={filters.starRatings.length > 0}
        onClear={() => onFiltersChange({ ...filters, starRatings: [] })}
      >
        <div className="space-y-1">
          {[5, 4, 3].map((star) => (
            <label
              key={star}
              className="flex items-center gap-3 py-2 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                  filters.starRatings.includes(star)
                    ? 'bg-brand-800 border-brand-800'
                    : 'border-charcoal-300 group-hover:border-charcoal-400'
                }`}
                onClick={() => handleStarChange(star, !filters.starRatings.includes(star))}
              >
                {filters.starRatings.includes(star) && (
                  <CheckIcon className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: star }).map((_, i) => (
                  <StarIcon key={i} filled />
                ))}
                {Array.from({ length: 5 - star }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="text-sm text-charcoal-500">
                {star} {isArabic ? 'نجوم' : 'Stars'}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title={isArabic ? 'نوع العقار' : 'Property Type'}
        isOpen={openSections.propertyType}
        onToggle={() => toggleSection('propertyType')}
        showClear={filters.propertyTypes.length > 0}
        onClear={() => onFiltersChange({ ...filters, propertyTypes: [] })}
      >
        <div className="space-y-1">
          {PROPERTY_TYPES.map((type) => (
            <CheckboxItem
              key={type.value}
              label={isArabic ? type.labelAr : type.labelEn}
              checked={filters.propertyTypes.includes(type.value)}
              onChange={(checked) => handlePropertyTypeChange(type.value, checked)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title={isArabic ? 'المرافق' : 'Amenities'}
        isOpen={openSections.amenities}
        onToggle={() => toggleSection('amenities')}
        showClear={filters.amenities.length > 0}
        onClear={() => onFiltersChange({ ...filters, amenities: [] })}
      >
        <div className="space-y-1">
          {AMENITIES.map((amenity) => (
            <CheckboxItem
              key={amenity.value}
              label={isArabic ? amenity.labelAr : amenity.labelEn}
              checked={filters.amenities.includes(amenity.value)}
              onChange={(checked) => handleAmenityChange(amenity.value, checked)}
              icon={<span className="text-sm">{amenity.icon}</span>}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title={isArabic ? 'خطة الوجبات' : 'Meal Plan'}
        isOpen={openSections.mealPlan}
        onToggle={() => toggleSection('mealPlan')}
        showClear={filters.mealPlans.length > 0}
        onClear={() => onFiltersChange({ ...filters, mealPlans: [] })}
      >
        <div className="space-y-1">
          {MEAL_PLANS.map((plan) => (
            <CheckboxItem
              key={plan.value}
              label={isArabic ? plan.labelAr : plan.labelEn}
              checked={filters.mealPlans.includes(plan.value)}
              onChange={(checked) => handleMealPlanChange(plan.value, checked)}
            />
          ))}
        </div>
      </FilterSection>

      <div className="pt-4 mt-4 border-t border-charcoal-100">
        <Button variant="primary" fullWidth onClick={onApply}>
          {isArabic ? 'تطبيق الفلاتر' : 'Apply Filters'}
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
