import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const menus = await prisma.permission.findMany({
      where: { parent_id: null },
      orderBy: { sort_order: 'desc' },
      include: { children: { orderBy: { sort_order: 'desc' } } }
    })
    
    return NextResponse.json({
      code: 200,
      data: menus.map(menu => ({
        id: menu.permission_id,
        name: menu.permission_name,
        icon: menu.icon,
        path: menu.path,
        children: menu.children
      }))
    })
  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: '获取菜单失败'
    })
  }
}
