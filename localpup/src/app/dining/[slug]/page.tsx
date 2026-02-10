import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Phone, Award, ChefHat, Info, Calendar, ArrowLeft, Utensils } from 'lucide-react'

const restaurantData = {
  id: '1',
  name: '楼外楼',
  nameEn: 'Lou Wai Lou',
  slug: 'lou-wai-lou',
  address: '30 Gushan Road, Xihu District, Hangzhou',
  city: 'Hangzhou',
  district: 'West Lake',
  description: 'Founded in 1848, Lou Wai Lou is one of Hangzhou\'s most famous and historic restaurants. Located on the picturesque Gushan Island in the middle of West Lake, it has hosted numerous dignitaries and celebrities over its 170+ year history.',
  descriptionEn: 'Founded in 1848, Lou Wai Lou is one of Hangzhou\'s most famous and historic restaurants.',
  aiSummary: `Lou Wai Lou is not just a restaurant; it's a living piece of Hangzhou history. Founded in 1848, this iconic establishment has been serving authentic Hangzhou cuisine for over 170 years.

The restaurant's location on Gushan Island offers breathtaking views of West Lake, making it the perfect setting for a memorable dining experience. The traditional architecture and elegant decor transport you back to the Qing Dynasty era.

The must-try dishes include the famous West Lake Fish in Vinegar Gravy (西湖醋鱼), Dongpo Pork (东坡肉), and Longjing Shrimp (龙井虾仁). Each dish is prepared using time-honored recipes and the freshest local ingredients.

While prices are on the higher side, the combination of historical significance, lake views, and authentic cuisine makes it worth the splurge for special occasions. Reservations are highly recommended, especially for window seats.`,
  cuisine: ['Hangzhou Cuisine', 'Chinese'],
  priceRange: '$$$',
  pricePerPerson: 280,
  openTime: '10:30-14:00, 16:30-21:00',
  openDays: 'Daily',
  reservationPhone: '+86 571 8796 9682',
  reservationRequired: true,
  specialties: ['西湖醋鱼', '东坡肉', '龙井虾仁', '叫化鸡', '宋嫂鱼羹'],
  features: ['Lake View', 'Historic Building', 'Private Rooms', 'Famous Chef'],
  rating: 4.5,
  reviewCount: 5234,
  dianpingRating: 4.4,
  dianpingReviewCount: 4892,
  isMichelin: false,
  michelinStars: null,
  images: [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1200&q=80',
  ],
  nearbyHotels: [
    { name: 'Four Seasons Hotel Hangzhou', slug: 'four-seasons-hangzhou', distance: '0.8 km' },
    { name: 'Grand Hyatt Hangzhou', slug: 'grand-hyatt-hangzhou', distance: '1.5 km' },
  ],
}

export default function RestaurantDetailPage({ params }: { params: { slug: string } }) {
  const restaurant = restaurantData

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-4 max-w-7xl mx-auto">
          <Link href="/dining" className="flex items-center gap-2 text-slate-600 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Restaurants
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={restaurant.images[0]}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 mb-4">
              {restaurant.isMichelin && (
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Michelin {restaurant.michelinStars || 1} Star
                </span>
              )}
              {restaurant.cuisine.map((c) => (
                <span key={c} className="px-3 py-1 bg-white/90 text-slate-800 text-sm font-medium rounded-full">
                  {c}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{restaurant.name}</h1>
            <p className="text-xl text-white/80 mb-4">{restaurant.nameEn}</p>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-white" />
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-sm">({restaurant.reviewCount.toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <ChefHat className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Price Range</p>
                  <p className="font-semibold text-slate-900">{restaurant.priceRange}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Utensils className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Per Person</p>
                  <p className="font-semibold text-slate-900">¥{restaurant.pricePerPerson}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Hours</p>
                  <p className="font-semibold text-slate-900">{restaurant.openTime}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Open</p>
                  <p className="font-semibold text-slate-900">{restaurant.openDays}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed">{restaurant.description}</p>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Dining Guide</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                {restaurant.aiSummary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-900">Signature Dishes</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {restaurant.specialties.map((dish) => (
                  <div key={dish} className="p-4 bg-amber-50 rounded-xl text-center">
                    <span className="font-medium text-amber-900">{dish}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {restaurant.images.map((img, idx) => (
                  <div key={idx} className="relative h-48 rounded-xl overflow-hidden">
                    <Image src={img} alt={`${restaurant.name} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reservation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Reservation</h3>
              {restaurant.reservationRequired && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg mb-4">
                  <Info className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-amber-800">Reservation recommended</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{restaurant.reservationPhone}</span>
              </div>
              <button className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                Call to Reserve
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Features</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.features.map((feature) => (
                  <span key={feature} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Nearby Hotels */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Nearby Hotels</h3>
              <div className="space-y-3">
                {restaurant.nearbyHotels.map((hotel) => (
                  <Link
                    key={hotel.slug}
                    href={`/hotels/${hotel.slug}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-medium text-slate-900">{hotel.name}</span>
                    <span className="text-sm text-slate-500">{hotel.distance}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Booking CTA */}
            <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-xl mb-2">Need Help?</h3>
              <p className="text-accent-100 mb-4">Let us arrange your dining experience</p>
              <button className="w-full py-3 bg-white text-accent-600 font-semibold rounded-xl hover:bg-accent-50 transition-colors">
                Concierge Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
