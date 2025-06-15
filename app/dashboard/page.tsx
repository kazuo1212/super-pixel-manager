'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Activity, Eye, Settings, Trash2 } from 'lucide-react'
import CreateSuperPixelDialog from '@/components/CreateSuperPixelDialog'
import EventsTerminal from '@/components/EventsTerminal'

interface SuperPixel {
  id: string
  name: string
  description: string
  isActive: boolean
  pixels: Array<{
    id: string
    name: string
    pixelId: string
    isActive: boolean
  }>
  _count: {
    events: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [superPixels, setSuperPixels] = useState<SuperPixel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSuperPixels()
  }, [])

  const fetchSuperPixels = async () => {
    try {
      const response = await fetch('/api/super-pixels')
      if (response.ok) {
        const data = await response.json()
        setSuperPixels(data)
      }
    } catch (error) {
      console.error('Erro ao buscar super pixels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSuperPixel = async (superPixelId: string, superPixelName: string) => {
    const pixelCount = superPixels.find(sp => sp.id === superPixelId)?.pixels.length || 0
    const eventCount = superPixels.find(sp => sp.id === superPixelId)?._count.events || 0
    
    const confirmMessage = `⚠️ ATENÇÃO - EXCLUSÃO PERMANENTE!\n\nTem certeza que deseja APAGAR PERMANENTEMENTE o Super Pixel "${superPixelName}"?\n\n📊 DADOS QUE SERÃO PERDIDOS:\n• ${pixelCount} pixel(s) configurado(s)\n• ${eventCount} evento(s) capturado(s)\n• Todas as configurações\n\n❌ Esta ação NÃO PODE ser desfeita!\n\nClique OK para confirmar a exclusão PERMANENTE.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch(`/api/super-pixels/${superPixelId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert(`✅ Super Pixel "${superPixelName}" foi removido com sucesso!\n\n📊 Dados removidos:\n• ${pixelCount} pixel(s)\n• ${eventCount} evento(s)`)
        fetchSuperPixels()
      } else {
        alert('❌ Erro ao remover Super Pixel. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao remover super pixel:', error)
      alert('❌ Erro ao remover Super Pixel. Verifique sua conexão.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Gerencie seus Super Pixels do Facebook</p>
          </div>
          <CreateSuperPixelDialog onSuperPixelCreated={fetchSuperPixels} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Super Pixels</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superPixels.length}</div>
              <p className="text-xs text-muted-foreground">
                {superPixels.filter(sp => sp.isActive).length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pixels</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {superPixels.reduce((acc, sp) => acc + sp.pixels.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pixels configurados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Hoje</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {superPixels.reduce((acc, sp) => acc + sp._count.events, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Eventos capturados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terminal de Eventos */}
        <div className="mb-8">
          <EventsTerminal />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {superPixels.map((superPixel) => (
            <Card key={superPixel.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{superPixel.name}</CardTitle>
                    <CardDescription>{superPixel.description}</CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    superPixel.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {superPixel.isActive ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pixels configurados:</span>
                    <span className="font-medium">{superPixel.pixels.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Eventos capturados:</span>
                    <span className="font-medium">{superPixel._count.events}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/super-pixel/${superPixel.id}`)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/super-pixel/${superPixel.id}`)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    Configurar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteSuperPixel(superPixel.id, superPixel.name)}
                    className="text-white bg-red-600 hover:bg-red-700"
                    title={`Apagar Super Pixel "${superPixel.name}"`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {superPixels.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum Super Pixel criado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece criando seu primeiro Super Pixel para gerenciar seus pixels do Facebook
              </p>
              <CreateSuperPixelDialog onSuperPixelCreated={fetchSuperPixels} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 