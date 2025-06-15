import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const since = searchParams.get('since')
    
    // Buscar eventos recentes com informações do Super Pixel e Pixels
    const events = await prisma.event.findMany({
      where: since ? {
        createdAt: {
          gt: new Date(since)
        }
      } : undefined,
      include: {
        superPixel: {
          include: {
            pixels: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Formatar eventos para o terminal
    const formattedEvents = events.map(event => {
      let eventData
      try {
        eventData = JSON.parse(event.eventData)
      } catch {
        eventData = {}
      }

      // Extrair informações do site
      const pageData = eventData.page || {}
      const utmData = eventData.utm || {}
      const deviceData = eventData.device || {}
      
      return {
        id: event.id,
        timestamp: event.createdAt,
        eventName: event.eventName,
        superPixel: {
          id: event.superPixel.id,
          name: event.superPixel.name
        },
        pixels: event.superPixel.pixels.map(pixel => ({
          id: pixel.id,
          name: pixel.name,
          pixelId: pixel.pixelId,
          isActive: pixel.isActive
        })),
        site: {
          url: pageData.url || 'N/A',
          title: pageData.title || 'N/A',
          referrer: pageData.referrer || 'N/A'
        },
        utm: {
          source: utmData.source || 'N/A',
          medium: utmData.medium || 'N/A',
          campaign: utmData.campaign || 'N/A'
        },
        device: {
          type: deviceData.type || 'N/A',
          browser: deviceData.browser || 'N/A',
          os: deviceData.os || 'N/A'
        },
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
        rawData: eventData
      }
    })

    return NextResponse.json({
      events: formattedEvents,
      total: formattedEvents.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 