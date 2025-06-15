'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Terminal, Play, Pause, Trash2, Download } from 'lucide-react'

interface EventLog {
  id: string
  timestamp: string
  eventName: string
  superPixel: {
    id: string
    name: string
  }
  pixels: Array<{
    id: string
    name: string
    pixelId: string
    isActive: boolean
  }>
  site: {
    url: string
    title: string
    referrer: string
  }
  utm: {
    source: string
    medium: string
    campaign: string
  }
  device: {
    type: string
    browser: string
    os: string
  }
  userAgent: string
  ipAddress: string
  rawData: any
}

interface EventsResponse {
  events: EventLog[]
  total: number
  timestamp: string
}

export default function EventsTerminal() {
  const [events, setEvents] = useState<EventLog[]>([])
  const [isRunning, setIsRunning] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchEvents = async (since?: string) => {
    try {
      const url = since 
        ? `/api/events?limit=50&since=${encodeURIComponent(since)}`
        : '/api/events?limit=50'
      
      const response = await fetch(url)
      if (response.ok) {
        const data: EventsResponse = await response.json()
        
        if (since && data.events.length > 0) {
          // Adicionar apenas novos eventos únicos
          setEvents(prev => {
            const newEvents = data.events.filter(newEvent => 
              !prev.some(existingEvent => existingEvent.id === newEvent.id)
            )
            return [...newEvents, ...prev].slice(0, 100) // Manter apenas 100 eventos
          })
        } else if (!since) {
          // Carregar eventos iniciais
          setEvents(data.events)
        }
        
        setLastUpdate(data.timestamp)
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (isRunning && lastUpdate) {
      intervalRef.current = setInterval(() => {
        fetchEvents(lastUpdate)
      }, 3000) // Aumentei para 3 segundos para ser menos agressivo
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, lastUpdate])

  const toggleRunning = () => {
    setIsRunning(!isRunning)
  }

  const clearEvents = () => {
    setEvents([])
    setShowDetails(null)
  }

  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `events-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getEventColor = (eventName: string) => {
    const colors: { [key: string]: string } = {
      'PageView': 'bg-blue-500',
      'Purchase': 'bg-green-500',
      'AddToCart': 'bg-yellow-500',
      'Lead': 'bg-purple-500',
      'ViewContent': 'bg-indigo-500',
      'InitiateCheckout': 'bg-orange-500',
      'CompleteRegistration': 'bg-pink-500',
      'Search': 'bg-gray-500'
    }
    return colors[eventName] || 'bg-gray-500'
  }

  const filteredEvents = events.filter(event => 
    !filter || 
    event.eventName.toLowerCase().includes(filter.toLowerCase()) ||
    event.site.url.toLowerCase().includes(filter.toLowerCase()) ||
    event.superPixel.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Terminal className="h-5 w-5" />
              Terminal de Eventos
              <span className={`px-2 py-1 rounded text-xs ${isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {isRunning ? 'AO VIVO' : 'PAUSADO'}
              </span>
            </CardTitle>
            <CardDescription>
              {filteredEvents.length} eventos • Atualiza a cada 3s
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRunning}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={clearEvents}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportEvents}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Filtrar eventos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={terminalRef}
          className="h-96 overflow-y-auto bg-black text-green-400 font-mono text-sm p-4 space-y-2"
        >
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filter ? 'Nenhum evento encontrado' : 'Aguardando eventos...'}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="border-l-2 border-green-500 pl-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400 text-xs">
                    [{formatTimestamp(event.timestamp)}]
                  </span>
                  <span className={`px-2 py-1 rounded text-xs text-white ${getEventColor(event.eventName)}`}>
                    {event.eventName}
                  </span>
                  <span className="text-blue-400">→</span>
                  <span className="text-yellow-400">{event.superPixel.name}</span>
                  <span className="text-gray-500 text-xs">({event.pixels.length} pixels)</span>
                </div>
                
                <div className="ml-2 space-y-1 text-xs">
                  <div>
                    <span className="text-cyan-400">Site:</span> 
                    <span className="text-white ml-2">{event.site.url}</span>
                  </div>
                  
                  {event.site.title !== 'N/A' && (
                    <div>
                      <span className="text-cyan-400">Título:</span> 
                      <span className="text-gray-300 ml-2">{event.site.title}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-cyan-400">Pixels:</span>
                    {event.pixels.map((pixel, idx) => (
                      <span key={pixel.id} className="ml-2">
                        <span className={pixel.isActive ? 'text-green-400' : 'text-red-400'}>
                          {pixel.name} ({pixel.pixelId.slice(-4)})
                        </span>
                        {idx < event.pixels.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                  
                  {(event.utm.source !== 'N/A' || event.utm.medium !== 'N/A') && (
                    <div>
                      <span className="text-cyan-400">UTM:</span>
                      <span className="text-purple-300 ml-2">
                        {event.utm.source}/{event.utm.medium}
                        {event.utm.campaign !== 'N/A' && ` (${event.utm.campaign})`}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-cyan-400">Device:</span>
                    <span className="text-orange-300 ml-2">
                      {event.device.type} - {event.device.browser} - {event.device.os}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-cyan-400">IP:</span>
                    <span className="text-red-300 ml-2">{event.ipAddress}</span>
                  </div>
                  
                  <div className="pt-1">
                    <button
                      onClick={() => setShowDetails(showDetails === event.id ? null : event.id)}
                      className="text-blue-400 hover:text-blue-300 underline text-xs"
                    >
                      {showDetails === event.id ? '▼ Ocultar JSON' : '▶ Ver JSON'}
                    </button>
                  </div>
                  
                  {showDetails === event.id && (
                    <div className="mt-2 p-2 bg-gray-900 rounded border max-h-32 overflow-y-auto">
                      <pre className="text-xs text-green-300 whitespace-pre-wrap">
                        {JSON.stringify(event.rawData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-600 flex justify-between">
        <span>Status: {isRunning ? '🟢 Monitorando' : '🔴 Pausado'}</span>
        <span>Eventos: {filteredEvents.length}</span>
      </div>
    </Card>
  )
} 