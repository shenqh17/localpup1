import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Ticket, Calendar } from 'lucide-react'

// 示例数据
const attractions = [
  {
    id: '1',
    name: '西湖',
    nameEn: 'West Lake',
    slug: 'west-lake',
    image: 'https://images.unsplash.com/photo-1597743057129-30193259b26c?w=800&q=80',
    category: 'Nature',
    rating: 4.9,
    reviewCount: 15890,
    isUnesco: true,
    isFree: true,
    visitDuration: '3-4 hours',
    bestTimeToVisit: 'Spring (March-May)',
    description: 'A UNESCO World Heritage site and the crown jewel of Hangzhou, featuring stunning landscapes that have inspired poets and artists for centuries.',
  },
  {
    id: '2',
    name: '灵隐寺',
    nameEn: 'Lingyin Temple',
    slug: 'lingyin-temple',
    image: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80',
    category: 'Historical',
    rating: 4.7,
    reviewCount: 8923,
    isUnesco: false,
    ticketPrice: 75,
    visitDuration: '2-3 hours',
    bestTimeToVisit: 'Early morning',
    description: 'One of the wealthiest and most famous Buddhist monasteries in China, nestled in the mountains with stunning rock carvings.',
  },
  {
    id: '3',
    name: '西溪湿地',
    nameEn: 'Xixi National Wetland Park',
    slug: 'xixi-wetland',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    category: 'Nature',
    rating: 4.6,
    reviewCount: 5234,
    isUnesco: false,
    ticketPrice: 80,
    visitDuration: '4-5 hours',
    bestTimeToVisit: 'Autumn (September-November)',
    description: 'China\'s first national wetland park, offering boat rides through tranquil waterways and traditional village experiences.',
  },
  {
    id: '4',
    name: '雷峰塔',
    nameEn: 'Leifeng Pagoda',
    slug: 'leifeng-pagoda',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80',
    category: 'Historical',
    rating: 4.5,
    reviewCount: 6789,
    isUnesco: false,
    ticketPrice: 40,
    visitDuration: '1-2 hours',
    bestTimeToVisit: 'Sunset',
    description: 'Iconic pagoda with panoramic views of West Lake, especially beautiful at sunset.',
  },
  {
    id: '5',
    name: '宋城',
    nameEn: 'Songcheng',
    slug: 'songcheng',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    category: 'Cultural',
    rating: 4.4,
    reviewCount: 4567,
    isUnesco: false,
    ticketPrice: 320,
    visitDuration: 'Full day',
    bestTimeToVisit: 'Evening for shows',
    description: 'A theme park recreating Song Dynasty culture with spectacular live performances.',
  },
  {
    id: '6',
    name: '京杭大运河',
    nameEn: 'Grand Canal',
    slug: 'grand-canal',
    image: 'https://images.unsplash.com/photo-1569078875997-6cb7c39087a9?w=800&q=80',
    category: 'Historical',
    rating: 4.5,
    reviewCount: 3456,
    isUnesco: true,
    isFree: true,
    visitDuration: '2-3 hours',
    bestTimeToVisit: 'Evening boat ride',
    description: 'The world\'s longest artificial waterway and UNESCO World Heritage site.',
  },
]

const categories = ['All', 'Nature', 'Historical', 'Cultural', 'Modern']

export default function AttractionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="section-padding py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Attractions in Hangzhou
          </h1>
          <p className="text-slate-600">
            Discover {attractions.length} must-visit places and experiences
          </p>
        </div>
      </div>

      <div className="section-padding py-8 max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                category === 'All'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction) => (
            <Link
              key={attraction.id}
              href={`/attractions/${attraction.slug}`}
              className="card group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={attraction.image}
                  alt={attraction.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {attraction.isUnesco && (
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      UNESCO
                    </span>
                  )}
                  {attraction.isFree && (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      FREE
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-slate-800 text-sm font-medium rounded-full">
                    {attraction.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-green-600 text-green-600" />
                    <span className="font-bold text-green-700">{attraction.rating}</span>
                  </div>
                  <span className="text-slate-500 text-sm">({attraction.reviewCount.toLocaleString()} reviews)</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-1">{attraction.name}</h3>
                <p className="text-slate-500 text-sm mb-3">{attraction.nameEn}</p>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{attraction.description}</p>

                {/* Info Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{attraction.visitDuration}</span>
                  </div>
                  {attraction.ticketPrice ? (
                    <div className="flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      <span>¥{attraction.ticketPrice}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600">
                      <Ticket className="w-4 h-4" />
                      <span>Free Entry</span>
                    </div>
                  )}
                </div>

                {/* Best Time */}
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800">
                    <span className="font-medium">Best time:</span> {attraction.bestTimeToVisit}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
