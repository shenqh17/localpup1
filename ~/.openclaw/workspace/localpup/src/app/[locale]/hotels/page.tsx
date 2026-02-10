import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Filter, SlidersHorizontal } from 'lucide-react'

// 模拟数据
const hotels = [
  {
    id: '1',
    name: 'Four Seasons Hotel Hangzhou',
    slug: 'four-seasons-hangzhou',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.9,
    bookingRating: 4.9,
    ctripRating: 4.8,
    reviewCount: 2847,
    price: 2800,
    location: 'West Lake',
    description: 'Luxury resort nestled among traditional gardens and ponds with stunning West Lake views.',
  },
  {
    id: '2',
    name: 'Park Hyatt Hangzhou',
    slug: 'park-hyatt-hangzhou',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    rating: 4.8,
    bookingRating: 4.8,
    ctripRating: 4.9,
    reviewCount: 1923,
    price: 1800,
    location: 'CBD',
    description: 'Modern luxury hotel with panoramic city views and world-class amenities.',
  },
  {
    id: '3',
    name: 'Amanfayun',
    slug: 'amanfayun-hangzhou',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.9,
    bookingRating: 5.0,
    ctripRating: 4.9,
    reviewCount: 892,
    price: 6500,
    location: 'Lingyin Temple Area',
    description: 'Ancient village restored into an exclusive retreat surrounded by tea fields.',
  },
  {
    id: '4',
    name: 'Grand Hyatt Hangzhou',
    slug: 'grand-hyatt-hangzhou',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    rating: 4.7,
    bookingRating: 4.7,
    ctripRating: 4.8,
    reviewCount: 3421,
    price: 1200,
    location: 'West Lake',
    description: 'Iconic lakeside hotel offering stunning views of West Lake and premium service.',
  },
  {
    id: '5',
    name: 'InterContinental Hangzhou',
    slug: 'intercontinental-hangzhou',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    rating: 4.6,
    bookingRating: 4.6,
    ctripRating: 4.7,
    reviewCount: 2156,
    price: 950,
    location: 'CBD',
    description: 'Contemporary luxury hotel in the heart of Hangzhou business district.',
  },
  {
    id: '6',
    name: 'Banyan Tree Hangzhou',
    slug: 'banyan-tree-hangzhou',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    rating: 4.8,
    bookingRating: 4.8,
    ctripRating: 4.8,
    reviewCount: 1234,
    price: 2200,
    location: 'Xixi Wetland',
    description: 'Luxury resort in Xixi Wetland offering traditional Chinese architecture.',
  },
]

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Hotels in Hangzhou
          </h1>
          <p className="text-slate-600">
            Discover {hotels.length} handpicked accommodations for your perfect stay
          </p>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Filters</h3>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-slate-600">{rating}+ Stars</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Location</h4>
                <div className="space-y-2">
                  {['West Lake', 'CBD', 'Lingyin Temple', 'Xixi Wetland'].map((loc) => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-sm text-slate-600">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Hotel List */}
          <div className="flex-1 space-y-6">
            {/* Sort Bar */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <span className="text-slate-600">{hotels.length} hotels found</span>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select className="text-sm border-none bg-transparent text-slate-700 font-medium focus:outline-none">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>
            </div>

            {/* Hotel Cards */}
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.slug}`}
                className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-72 h-48 md:h-auto relative">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{hotel.name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{hotel.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">¥{hotel.price}</p>
                        <p className="text-sm text-slate-500">per night</p>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-4 line-clamp-2">{hotel.description}</p>

                    {/* Ratings */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded">
                          {hotel.bookingRating}
                        </span>
                        <span className="text-sm text-slate-500">Booking.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded">
                          {hotel.ctripRating}
                        </span>
                        <span className="text-sm text-slate-500">Ctrip</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-900">{hotel.rating}</span>
                        <span className="text-sm text-slate-500">({hotel.reviewCount} reviews)</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <span className="text-primary-600 font-semibold hover:text-primary-700">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
