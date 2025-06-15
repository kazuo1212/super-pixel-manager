import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      superPixelId,
      eventName,
      eventData,
      timestamp,
      sessionId,
      userId,
      device,
      page,
      utm,
      ecommerce,
      performance,
      engagement
    } = data

    if (!superPixelId || !eventName) {
      return NextResponse.json(
        { error: 'superPixelId e eventName são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o Super Pixel existe
    const superPixel = await prisma.superPixel.findUnique({
      where: { id: superPixelId },
      include: { pixels: true }
    })

    if (!superPixel) {
      return NextResponse.json(
        { error: 'Super Pixel não encontrado' },
        { status: 404 }
      )
    }

    if (!superPixel.isActive) {
      return NextResponse.json(
        { error: 'Super Pixel inativo' },
        { status: 403 }
      )
    }

    // Preparar dados do evento
    const eventDataToStore = {
      ...eventData,
      sessionId,
      userId,
      device,
      page,
      utm,
      ecommerce,
      performance,
      engagement
    }

    // Salvar evento no banco
    const event = await prisma.event.create({
      data: {
        eventName,
        eventData: JSON.stringify(eventDataToStore),
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        superPixelId
      }
    })

    // Enviar para pixels do Facebook configurados
    await sendToFacebookPixels(superPixel.pixels, eventName, eventDataToStore)

    return NextResponse.json({ 
      success: true, 
      eventId: event.id 
    })

  } catch (error) {
    console.error('Erro ao processar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para enviar eventos para os pixels do Facebook
async function sendToFacebookPixels(pixels: any[], eventName: string, eventData: any) {
  for (const pixel of pixels) {
    if (!pixel.isActive) continue

    try {
      // Aqui você implementaria a integração com a API do Facebook
      // Por exemplo, usando a Conversions API
      await sendToFacebookConversionsAPI(pixel, eventName, eventData)
    } catch (error) {
      console.error(`Erro ao enviar para pixel ${pixel.pixelId}:`, error)
    }
  }
}

// Função para enviar via Conversions API do Facebook
async function sendToFacebookConversionsAPI(pixel: any, eventName: string, eventData: any) {
  const facebookApiUrl = `https://graph.facebook.com/v18.0/${pixel.pixelId}/events`
  
  // Mapear eventos para formato do Facebook
  const fbEventData = {
    event_name: mapEventNameToFacebook(eventName),
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: eventData.page?.url,
    user_data: {
      client_ip_address: eventData.ipAddress,
      client_user_agent: eventData.userAgent,
      fbc: eventData.utm?.fbclid ? `fb.1.${Date.now()}.${eventData.utm.fbclid}` : undefined,
      fbp: eventData.device?.cookieEnabled ? `fb.1.${Date.now()}.${Math.random()}` : undefined
    },
    custom_data: {
      currency: 'BRL',
      value: eventData.ecommerce?.price ? parseFloat(eventData.ecommerce.price.replace(/[^\d.-]/g, '')) : undefined,
      content_name: eventData.ecommerce?.productName,
      content_type: 'product',
      ...eventData.eventData
    }
  }

  const payload = {
    data: [fbEventData],
    access_token: pixel.accessToken
  }

  const response = await fetch(facebookApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Facebook API error: ${response.status}`)
  }

  return response.json()
}

// Mapear nomes de eventos para o formato do Facebook
function mapEventNameToFacebook(eventName: string): string {
  const eventMap: { [key: string]: string } = {
    'page_view': 'PageView',
    'purchase': 'Purchase',
    'add_to_cart': 'AddToCart',
    'initiate_checkout': 'InitiateCheckout',
    'lead': 'Lead',
    'complete_registration': 'CompleteRegistration',
    'search': 'Search',
    'view_content': 'ViewContent',
    'button_click': 'ClickButton',
    'link_click': 'ClickLink',
    'form_interaction': 'SubmitApplication'
  }

  return eventMap[eventName] || 'CustomEvent'
} 