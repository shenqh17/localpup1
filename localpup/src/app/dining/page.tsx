import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Phone, Award, ChefHat } from 'lucide-react'

// 示例数据
const restaurants = [
  {
    id: '1',
    name: '楼外楼',
    nameEn: 'Lou Wai Lou',
    slug: 'lou-wai-lou',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    cuisine: ['Hangzhou Cuisine', 'Chinese'],
    rating: 4.5,
    reviewCount: 5234,
    priceRange: '$$$',
    pricePerPerson: 280,
    isMichelin: false,
    openTime: '10:30-14:00, 16:30-21:00',
    specialties: ['西湖醋鱼', '东坡肉', '龙井虾仁'],
    features: ['Lake View', 'Historic', 'Private Rooms'],
    description: 'A historic restaurant on Gushan Island, famous for traditional Hangzhou cuisine since 1848.',
  },
  {
    id: '2',
    name: '金沙厅',
    nameEn: 'Jin Sha',
    slug: 'jin-sha',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    cuisine: ['Cantonese', 'Chinese'],
    rating: 4.8,
    reviewCount: 1892,
    priceRange: '$$$$',
    pricePerPerson: 680,
    isMichelin: true,
    michelinStars: 1,
    openTime: '11:30-14:30, 17:30-22:00',
    specialties: ['Dim Sum', 'Roasted Meats', 'Seafood'],
    features: ['Michelin Starred', 'Luxury', 'Private Dining'],
    description: 'Michelin-starred Cantonese restaurant offering exquisite dim sum and traditional dishes.',
  },
  {
    id: '3',
    name: '青藤茶馆',
    nameEn: 'Green Vine Teahouse',
    slug: 'green-vine-teahouse',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    cuisine: ['Tea House', 'Snacks'],
    rating: 4.6,
    reviewCount: 3456,
    priceRange: '$$',
    pricePerPerson: 150,
    isMichelin: false,
    openTime: '09:00-23:00',
    specialties: ['Longjing Tea', 'Tea Snacks', 'Desserts'],
    features: ['Tea Culture', 'Traditional', 'Relaxing'],
    description: 'Traditional teahouse offering premium Longjing tea and authentic tea ceremony experience.',
  },
  {
    id: '4',
    name: '柏悦酒店中餐厅',
    nameEn: 'Park Hyatt Chinese Restaurant',
    slug: 'park-hyatt-chinese',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    cuisine: ['Hangzhou Cuisine', 'Fusion'],
    rating: 4.7,
    reviewCount: 1234,
    priceRange: '$$$$',
    pricePerPerson: 520,
    isMichelin: false,
    openTime: '11:30-14:30, 17:30-22:00',
    specialties: ['Modern Hangzhou', 'Creative Dishes'],
    features: ['City View', 'Fine Dining', 'Hotel Restaurant'],
    description: 'Elevated Hangzhou cuisine with modern presentation and stunning city views.',
  },
  {
    id: '5',
    name: '知味观',
    nameEn: 'Zhi Wei Guan',
    slug: 'zhi-wei-guan',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
    cuisine: ['Hangzhou Cuisine', 'Snacks'],
    rating: 4.4,
    reviewCount: 8923,
    priceRange: '$$',
    pricePerPerson: 120,
    isMichelin: false,
    openTime: '07:00-21:00',
    specialties: ['小笼包', '猫耳朵', '片儿川'],
    features: ['Historic', 'Local Favorite', 'Casual'],
    description: 'Iconic local restaurant known for traditional Hangzhou snacks and breakfast items.',
  },
  {
    id: '6',
    name: '法云安缦蒸菜馆',
    nameEn: 'Amanfayun Steam Restaurant',
    slug: 'amanfayun-steam',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    cuisine: ['Vegetarian', 'Healthy'],
    rating: 4.9,
    reviewCount: 567,
    priceRange: '$$$$',
    pricePerPerson: 880,
    isMichelin: false,
    openTime: '11:30-14:00, 17:30-21:00',
    specialties: ['Vegetarian', 'Organic', 'Steam Cooking'],
    features: ['Scenic', 'Healthy', 'Exclusive'],
    description: 'Peaceful vegetarian restaurant in Amanfayun offering organic, steam-cooked cuisine.',
  },
]

const cuisines = ['All', 'Hangzhou Cuisine', 'Cantonese', 'Tea House', 'Vegetarian', 'Fusion']
const priceRanges = ['All', '$', '$$', '$$$', '$$$$']

function PriceRange({ range }: { range: string }) {
  return (
    <span className="text-slate-600">
      {range.split('').map((_, i) => (
        <span key={i} className="text-green-600 font-bold">¥</span>
      ))}
    </span>
  )
}

export default function DiningPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dining in Hangzhou
          </h1>
          <p className="text-slate-600">
            Discover {restaurants.length} exceptional restaurants and culinary experiences
          </p>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-500 py-2">Cuisine:</span>
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cuisine === 'All'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
          
          {/* Price Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-500 py-2">Price:</span>
            {priceRanges.map((price) => (
              <button
                key={price}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  price === 'All'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {price === 'All' ? price : <PriceRange range={price} />}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/dining/${restaurant.slug}`}
              className="card group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {restaurant.isMichelin && (
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Michelin {restaurant.michelinStars}★
                    </span>
                  )}
                </div>

                {/* Price & Rating */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-white/90 px-3 py-1 rounded-full">
                    <PriceRange range={restaurant.priceRange} />
                  </div>
                  <div className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full text-white">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="font-bold">{restaurant.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Cuisine Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {restaurant.cuisine.map((c) => (
                    <span key={c} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-1">{restaurant.name}</h3>
                <p className="text-slate-500 text-sm mb-3">{restaurant.nameEn}</p>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>

                {/* Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.openTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    <span>¥{restaurant.pricePerPerson}/person</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {restaurant.specialties.slice(0, 3).map((specialty) => (
                    <span key={specialty} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
