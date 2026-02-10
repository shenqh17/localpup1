import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Ticket, Calendar, Sun, Info, Camera, Car, Utensils, Store, ArrowLeft } from 'lucide-react'

// 示例数据
const attractionData = {
  id: '1',
  name: '西湖',
  nameEn: 'West Lake',
  slug: 'west-lake',
  address: 'Xihu District, Hangzhou',
  city: 'Hangzhou',
  district: 'West Lake',
  latitude: 30.2435,
  longitude: 120.1456,
  description: 'West Lake is a freshwater lake in Hangzhou, China. It is divided into five sections by three causeways. There are numerous temples, pagodas, gardens, and artificial islands within the lake.',
  descriptionCn: '西湖是中国杭州的一个淡水湖，被三条堤道分成五个部分。湖中有众多寺庙、宝塔、花园和人造岛屿。',
  aiSummary: `West Lake is undoubtedly the crown jewel of Hangzhou and a must-visit destination for any traveler. This UNESCO World Heritage site offers breathtaking natural beauty combined with rich cultural heritage.

The lake is perfect for a leisurely stroll along the Su Causeway, where you can enjoy willow trees swaying in the breeze and lotus flowers in summer. Don't miss the iconic Three Pools Mirroring the Moon, best viewed by boat.

The evening music fountain show near Hubin Road is spectacular. For the best experience, rent a bike and cycle around the lake, or take a traditional wooden boat for a romantic sunset cruise.`,
  category: 'Nature',
  visitDuration: '3-4 hours',
  bestTimeToVisit: 'Spring (March to May) and Autumn (September to November)',
  tips: 'Visit early morning to avoid crowds. Bring comfortable walking shoes. Boat rides are highly recommended.',
  isFree: true,
  ticketPrice: 0,
  openTime: 'Open 24 hours',
  openDays: 'Daily',
  rating: 4.9,
  reviewCount: 15890,
  googleRating: 4.8,
  ctripRating: 4.9,
  isUnesco: true,
  facilities: ['Boat Rental', 'Bicycle Rental', 'Restrooms', 'Restaurants', 'Souvenir Shops'],
  activities: ['Boat Cruise', 'Cycling', 'Walking', 'Photography', 'Tea Ceremony'],
  images: [
    'https://images.unsplash.com/photo-1597743057129-30193259b26c?w=1200&q=80',
    'https://images.unsplash.com/photo-1569078875997-6cb7c39087a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
  ],
  nearbyHotels: [
    { name: 'Four Seasons Hotel Hangzhou', slug: 'four-seasons-hangzhou', distance: '0.5 km' },
    { name: 'Grand Hyatt Hangzhou', slug: 'grand-hyatt-hangzhou', distance: '1.2 km' },
  ],
}

export default function AttractionDetailPage({ params }: { params: { slug: string } }) {
  const attraction = attractionData

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-4 max-w-7xl mx-auto">
          <Link href="/attractions" className="flex items-center gap-2 text-slate-600 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Attractions
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={attraction.images[0]}
          alt={attraction.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 section-padding pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 mb-4">
              {attraction.isUnesco && (
                <span className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                  UNESCO World Heritage
                </span>
              )}
              <span className="px-3 py-1 bg-white/90 text-slate-800 text-sm font-medium rounded-full">
                {attraction.category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{attraction.name}</h1>
            <p className="text-xl text-white/80 mb-4">{attraction.nameEn}</p>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{attraction.address}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-white" />
                <span className="font-bold">{attraction.rating}</span>
                <span className="text-sm">({attraction.reviewCount.toLocaleString()})</span>
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
                  <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-semibold text-slate-900">{attraction.visitDuration}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Ticket className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Entry Fee</p>
                  <p className="font-semibold text-slate-900">
                    {attraction.isFree ? 'Free' : `¥${attraction.ticketPrice}`}
                  </p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Sun className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Open Hours</p>
                  <p className="font-semibold text-slate-900">{attraction.openTime}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Open Days</p>
                  <p className="font-semibold text-slate-900">{attraction.openDays}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{attraction.description}</p>
              <p className="text-slate-500">{attraction.descriptionCn}</p>
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Travel Guide</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                {attraction.aiSummary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900">Travel Tips</h2>
              </div>
              <p className="text-amber-800">{attraction.tips}</p>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {attraction.images.map((img, idx) => (
                  <div key={idx} className="relative h-48 rounded-xl overflow-hidden">
                    <Image src={img} alt={`${attraction.name} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Time */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-slate-900">Best Time to Visit</h3>
              </div>
              <p className="text-slate-600">{attraction.bestTimeToVisit}</p>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-slate-900">Activities</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {attraction.activities.map((activity) => (
                  <span key={activity} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Facilities</h3>
              <ul className="space-y-3">
                {attraction.facilities.map((facility) => (
                  <li key={facility} className="flex items-center gap-2 text-slate-600">
                    {facility.includes('Boat') && <Car className="w-4 h-4" />}
                    {facility.includes('Restaurant') && <Utensils className="w-4 h-4" />}
                    {facility.includes('Shop') && <Store className="w-4 h-4" />}
                    {!facility.includes('Boat') && !facility.includes('Restaurant') && !facility.includes('Shop') && (
                      <Info className="w-4 h-4" />
                    )}
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nearby Hotels */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Nearby Hotels</h3>
              <div className="space-y-3">
                {attraction.nearbyHotels.map((hotel) => (
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

            {/* Book Now */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-xl mb-2">Plan Your Visit</h3>
              <p className="text-primary-100 mb-4">Book guided tours and activities</p>
              <button className="w-full py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
                View Tour Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
