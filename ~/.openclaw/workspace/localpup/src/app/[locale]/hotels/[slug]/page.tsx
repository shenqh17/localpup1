import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Check, ArrowLeft } from 'lucide-react'

// 模拟数据 - 实际应从数据库/API获取
const hotelData = {
  id: '1',
  name: 'Four Seasons Hotel Hangzhou',
  nameCn: '杭州西子湖四季酒店',
  slug: 'four-seasons-hangzhou',
  address: '5 Lingyin Road, Xihu District, Hangzhou',
  location: 'West Lake',
  description: 'Set amidst tranquil gardens and serene waterways, Four Seasons Hotel Hangzhou offers an idyllic retreat just steps from the legendary West Lake. The property seamlessly blends traditional Chinese architecture with contemporary luxury, featuring elegant rooms and suites with private gardens or water views.',
  aiSummary: `This exceptional lakeside sanctuary offers an unparalleled blend of traditional Chinese elegance and modern luxury. Guests consistently praise the meticulously landscaped gardens that create a peaceful retreat from the bustling city, while the prime location provides easy access to West Lake's most scenic spots.

The spacious rooms feature authentic Chinese design elements with contemporary comforts, including premium bedding and marble bathrooms. The award-winning spa offers traditional Chinese treatments, and multiple dining venues serve exceptional local and international cuisine.

The attentive staff receives universal acclaim for their warm hospitality and attention to detail, making every guest feel like royalty. The hotel's private boat tours of West Lake are highly recommended as an exclusive experience not available to regular tourists.`,
  rating: 4.9,
  reviewCount: 2847,
  bookingRating: 4.9,
  bookingReviewCount: 1847,
  ctripRating: 4.8,
  ctripReviewCount: 2156,
  tripadvisorRating: 4.9,
  price: 2800,
  currency: 'CNY',
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80',
  ],
  amenities: [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Car, name: 'Free Parking' },
    { icon: Coffee, name: 'Coffee Shop' },
    { icon: Dumbbell, name: 'Fitness Center' },
    { icon: Waves, name: 'Swimming Pool' },
    { icon: Utensils, name: 'Restaurant' },
  ],
  highlights: [
    'Stunning traditional Chinese garden setting',
    'Private boat tours of West Lake',
    'Award-winning spa with Chinese treatments',
    'Multiple acclaimed restaurants on-site',
    'Exceptional service with attention to detail',
    'Prime location near Lingyin Temple',
  ],
  bookingUrl: 'https://www.booking.com/hotel/cn/four-seasons-hangzhou.html',
  ctripUrl: 'https://hotels.ctrip.com/hotels/123456.html',
}

export default function HotelDetailPage({ params }: { params: { slug: string } }) {
  const hotel = hotelData // 实际应根据 params.slug 从数据库获取

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-4 max-w-7xl mx-auto">
          <Link href="/hotels" className="flex items-center gap-2 text-slate-600 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Hotels
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Thumbnail Strip */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 overflow-x-auto">
            {hotel.images.map((img, idx) => (
              <div
                key={idx}
                className={`w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                  idx === 0 ? 'border-white' : 'border-transparent'
                }`}
              >
                <Image src={img} alt={`${hotel.name} ${idx + 1}`} width={96} height={64} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{hotel.name}</h1>
                  <p className="text-lg text-slate-500">{hotel.nameCn}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">¥{hotel.price}</p>
                  <p className="text-sm text-slate-500">per night</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{hotel.address}</span>
              </div>

              {/* Ratings */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                  <span className="text-2xl font-bold text-green-700">{hotel.bookingRating}</span>
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Booking.com</p>
                    <p className="text-green-600">{hotel.bookingReviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <span className="text-2xl font-bold text-blue-700">{hotel.ctripRating}</span>
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Ctrip</p>
                    <p className="text-blue-600">{hotel.ctripReviewCount} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                  <div className="text-sm">
                    <p className="text-2xl font-bold text-amber-700">{hotel.rating}</p>
                    <p className="text-amber-600">Overall Rating</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-3">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity.name}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg"
                  >
                    <amenity.icon className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About This Hotel</h2>
              <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">AI-Curated Summary</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                {hotel.aiSummary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Generated from {hotel.reviewCount}+ verified reviews
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotel.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Book Your Stay</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Check-in</p>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Check-out</p>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Guests</p>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none">
                    <option>2 Adults</option>
                    <option>1 Adult</option>
                    <option>2 Adults, 1 Child</option>
                    <option>2 Adults, 2 Children</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Price per night</span>
                  <span className="font-semibold">¥{hotel.price}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>¥{hotel.price * 2}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Book on Booking.com
                </a>
                <a
                  href={hotel.ctripUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-sky-500 text-white text-center font-semibold rounded-xl hover:bg-sky-600 transition-colors"
                >
                  Book on Ctrip
                </a>
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                Best price guarantee • Free cancellation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
