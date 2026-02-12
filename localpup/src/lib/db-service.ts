import { PrismaClient, Hotel, Attraction, Restaurant } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Hotel Service
export const hotelService = {
  async getAll(options?: {
    city?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    amenities?: string[]
    isFeatured?: boolean
    page?: number
    limit?: number
    sortBy?: 'price-asc' | 'price-desc' | 'rating-desc' | 'recommended'
  }) {
    const {
      city = 'Hangzhou',
      minPrice,
      maxPrice,
      minRating,
      amenities,
      isFeatured,
      page = 1,
      limit = 20,
      sortBy = 'recommended'
    } = options || {}

    const where: Record<string, any> = {
      city,
      isActive: true,
    }

    if (minPrice !== undefined) where.priceRangeMin = { gte: minPrice }
    if (maxPrice !== undefined) where.priceRangeMax = { lte: maxPrice }
    if (minRating !== undefined) where.overallRating = { gte: minRating }
    if (isFeatured !== undefined) where.isFeatured = isFeatured
    if (amenities && amenities.length > 0) {
      where.amenities = { hasEvery: amenities }
    }

    const [results, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: (() => {
          switch (sortBy) {
            case 'price-asc': return { priceRangeMin: 'asc' }
            case 'price-desc': return { priceRangeMax: 'desc' }
            case 'rating-desc': return { overallRating: 'desc' }
            default: return [{ isFeatured: 'desc' }, { overallRating: 'desc' }]
          }
        })(),
        include: {
          images: {
            where: { isOfficial: true },
            take: 5,
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.hotel.count({ where })
    ])

    return { results, total, page, totalPages: Math.ceil(total / limit) }
  },

  async getById(id: string) {
    return prisma.hotel.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        reviews: { take: 50, orderBy: { createdAt: 'desc' } }
      }
    })
  },

  async getBySlug(slug: string) {
    return prisma.hotel.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        reviews: { take: 50, orderBy: { createdAt: 'desc' } }
      }
    })
  },

  async search(query: string, options?: { limit?: number }) {
    const searchQuery = query.toLowerCase()
    return prisma.hotel.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { nameEn: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { location: { contains: searchQuery, mode: 'insensitive' } },
        ]
      },
      take: options?.limit || 20,
      orderBy: { overallRating: 'desc' }
    })
  },

  async create(data: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.hotel.create({ data })
  },

  async update(id: string, data: Partial<Hotel>) {
    return prisma.hotel.update({
      where: { id },
      data
    })
  },

  async delete(id: string) {
    return prisma.hotel.delete({ where: { id } })
  }
}

// Attraction Service
export const attractionService = {
  async getAll(options?: {
    city?: string
    category?: string
    isFree?: boolean
    isUnesco?: boolean
    page?: number
    limit?: number
  }) {
    const {
      city = 'Hangzhou',
      category,
      isFree,
      isUnesco,
      page = 1,
      limit = 20
    } = options || {}

    const where: Record<string, any> = { city, isActive: true }
    if (category && category !== 'All') where.category = category
    if (isFree !== undefined) where.isFree = isFree
    if (isUnesco !== undefined) where.isUnesco = isUnesco

    const [results, total] = await Promise.all([
      prisma.attraction.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { overallRating: 'desc' },
        include: {
          images: {
            where: { isOfficial: true },
            take: 3,
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.attraction.count({ where })
    ])

    return { results, total, page, totalPages: Math.ceil(total / limit) }
  },

  async getBySlug(slug: string) {
    return prisma.attraction.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } }
      }
    })
  },

  async search(query: string) {
    return prisma.attraction.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 20
    })
  }
}

// Restaurant Service
export const restaurantService = {
  async getAll(options?: {
    city?: string
    cuisine?: string
    priceRange?: string
    isMichelin?: boolean
    page?: number
    limit?: number
  }) {
    const {
      city = 'Hangzhou',
      cuisine,
      priceRange,
      isMichelin,
      page = 1,
      limit = 20
    } = options || {}

    const where: Record<string, any> = { city, isActive: true }
    if (cuisine && cuisine !== 'All') where.cuisine = { has: cuisine }
    if (priceRange) where.priceRange = priceRange
    if (isMichelin !== undefined) where.isMichelin = isMichelin

    const [results, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { overallRating: 'desc' },
        include: {
          images: {
            take: 3,
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.restaurant.count({ where })
    ])

    return { results, total, page, totalPages: Math.ceil(total / limit) }
  },

  async getBySlug(slug: string) {
    return prisma.restaurant.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } }
      }
    })
  },

  async search(query: string) {
    return prisma.restaurant.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { cuisine: { has: query } }
        ]
      },
      take: 20
    })
  }
}

// Favorites Service
export const favoritesService = {
  async getByUserId(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async add(userId: string, itemId: string, itemType: 'hotel' | 'attraction' | 'restaurant') {
    // 检查是否已存在
    const existing = await prisma.favorite.findFirst({
      where: { userId, itemId, itemType }
    })

    if (existing) {
      return existing
    }

    return prisma.favorite.create({
      data: { userId, itemId, itemType }
    })
  },

  async remove(userId: string, itemId: string, itemType: 'hotel' | 'attraction' | 'restaurant') {
    return prisma.favorite.deleteMany({
      where: { userId, itemId, itemType }
    })
  },

  async isFavorite(userId: string, itemId: string, itemType: 'hotel' | 'attraction' | 'restaurant') {
    const favorite = await prisma.favorite.findFirst({
      where: { userId, itemId, itemType }
    })
    return !!favorite
  }
}

export default {
  hotel: hotelService,
  attraction: attractionService,
  restaurant: restaurantService,
  favorites: favoritesService
}
