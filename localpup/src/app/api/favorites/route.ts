import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma, favoritesService } from '@/lib/db-service'
import { z } from 'zod'

const favoriteSchema = z.object({
  itemId: z.string(),
  itemType: z.enum(['hotel', 'attraction', 'restaurant']),
})

// GET /api/favorites - 获取用户收藏
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const favorites = await favoritesService.getByUserId(session.user.id)

    // 获取收藏项的详细信息
    const items = await Promise.all(
      favorites.map(async (fav) => {
        let item = null
        switch (fav.itemType) {
          case 'hotel':
            item = await prisma.hotel.findUnique({
              where: { id: fav.itemId },
              include: { images: { take: 1 } },
            })
            break
          case 'attraction':
            item = await prisma.attraction.findUnique({
              where: { id: fav.itemId },
              include: { images: { take: 1 } },
            })
            break
          case 'restaurant':
            item = await prisma.restaurant.findUnique({
              where: { id: fav.itemId },
              include: { images: { take: 1 } },
            })
            break
        }

        return {
          ...fav,
          item,
        }
      })
    )

    return NextResponse.json({
      success: true,
      favorites: items,
      total: items.length,
    })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - 添加收藏
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = favoriteSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { itemId, itemType } = validated.data

    // 验证项目存在
    let item = null
    switch (itemType) {
      case 'hotel':
        item = await prisma.hotel.findUnique({ where: { id: itemId } })
        break
      case 'attraction':
        item = await prisma.attraction.findUnique({ where: { id: itemId } })
        break
      case 'restaurant':
        item = await prisma.restaurant.findUnique({ where: { id: itemId } })
        break
    }

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const favorite = await favoritesService.add(session.user.id, itemId, itemType)

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      favorite,
    })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - 取消收藏
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const itemType = searchParams.get('itemType') as 'hotel' | 'attraction' | 'restaurant' | null

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: 'Missing itemId or itemType' },
        { status: 400 }
      )
    }

    await favoritesService.remove(session.user.id, itemId, itemType)

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
