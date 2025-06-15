'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Settings, Code, Eye, Trash2 } from 'lucide-react'

interface Pixel {
  id: string
  name: string
  pixelId: string
  accessToken: string
  isActive: boolean
}

interface SuperPixel {
  id: string
  name: string
  description: string
  isActive: boolean
  pixels: Pixel[]
  _count: {
    events: number
  }
}

export default function SuperPixelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [superPixel, setSuperPixel] = useState<SuperPixel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddPixel, setShowAddPixel] = useState(false)
  const [showCode, setShowCode] = useState(false)
  
  // Form states for adding pixel
  const [pixelName, setPixelName] = useState('')
  const [pixelId, setPixelId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isAddingPixel, setIsAddingPixel] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchSuperPixel()
    }
  }, [params.id])

  const fetchSuperPixel = async () => {
    try {
      const response = await fetch(`/api/super-pixels/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSuperPixel(data)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Erro ao buscar super pixel:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPixel = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pixelName.trim() || !pixelId.trim()) {
      alert('Nome e ID do pixel são obrigatórios')
      return
    }

    setIsAddingPixel(true)

    try {
      const response = await fetch(`/api/super-pixels/${params.id}/pixels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pixelName.trim(),
          pixelId: pixelId.trim(),
          accessToken: accessToken.trim()
        }),
      })

      if (response.ok) {
        setPixelName('')
        setPixelId('')
        setAccessToken('')
        setShowAddPixel(false)
        fetchSuperPixel()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao adicionar pixel')
      }
    } catch (error) {
      alert('Erro ao adicionar pixel')
    } finally {
      setIsAddingPixel(false)
    }
  }

  const togglePixelStatus = async (pixelId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/pixels/${pixelId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchSuperPixel()
      }
    } catch (error) {
      console.error('Erro ao alterar status do pixel:', error)
    }
  }

  const deletePixel = async (pixelId: string) => {
    if (!confirm('Tem certeza que deseja remover este pixel?')) {
      return
    }

    try {
      const response = await fetch(`/api/pixels/${pixelId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSuperPixel()
      }
    } catch (error) {
      console.error('Erro ao remover pixel:', error)
    }
  }

  const generateCode = () => {
    if (!superPixel) return ''
    
    return `<!-- Configuração do Super Pixel -->
<script>
  window.SUPER_PIXEL_ID = '${superPixel.id}';
  window.SUPER_PIXEL_DEBUG = false; // Altere para true durante desenvolvimento
</script>

<!-- Script do Super Pixel -->
<script src="${window.location.origin}/super-pixel.js" async></script>

<!-- Pixels do Facebook (opcional, mas recomendado) -->
${superPixel.pixels.map(pixel => `<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', '${pixel.pixelId}');
  fbq('track', 'PageView');
</script>`).join('\n\n')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!superPixel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Super Pixel não encontrado</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{superPixel.name}</h1>
            <p className="text-gray-600 mt-1">{superPixel.description}</p>
          </div>
          <div className={`ml-auto px-3 py-1 rounded-full text-sm ${
            superPixel.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {superPixel.isActive ? 'Ativo' : 'Inativo'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pixels Configurados</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superPixel.pixels.length}</div>
              <p className="text-xs text-muted-foreground">
                {superPixel.pixels.filter(p => p.isActive).length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Capturados</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superPixel._count.events}</div>
              <p className="text-xs text-muted-foreground">
                Total de eventos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {superPixel.isActive ? 'Ativo' : 'Inativo'}
              </div>
              <p className="text-xs text-muted-foreground">
                Status atual
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pixels do Facebook</CardTitle>
                  <CardDescription>
                    Gerencie os pixels associados a este Super Pixel
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddPixel(!showAddPixel)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pixel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddPixel && (
                <form onSubmit={handleAddPixel} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-4">Adicionar Novo Pixel</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome do Pixel *</label>
                      <Input
                        placeholder="Ex: Pixel Principal"
                        value={pixelName}
                        onChange={(e) => setPixelName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">ID do Pixel do Facebook *</label>
                      <Input
                        placeholder="Ex: 123456789012345"
                        value={pixelId}
                        onChange={(e) => setPixelId(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Token de Acesso (Conversions API)</label>
                      <Input
                        placeholder="Token para Conversions API (opcional)"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        type="password"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isAddingPixel}>
                        {isAddingPixel ? 'Adicionando...' : 'Adicionar'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddPixel(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {superPixel.pixels.map((pixel) => (
                  <div key={pixel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{pixel.name}</h4>
                      <p className="text-sm text-gray-600">ID: {pixel.pixelId}</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                        pixel.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pixel.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePixelStatus(pixel.id, pixel.isActive)}
                      >
                        {pixel.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePixel(pixel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {superPixel.pixels.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum pixel configurado</p>
                    <p className="text-sm">Adicione seu primeiro pixel do Facebook</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Código de Implementação</CardTitle>
                  <CardDescription>
                    Copie e cole este código no &lt;head&gt; da sua página
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setShowCode(!showCode)}>
                  <Code className="h-4 w-4 mr-2" />
                  {showCode ? 'Ocultar' : 'Mostrar'} Código
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showCode && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Código HTML para implementação:
                    </label>
                    <textarea
                      className="w-full h-64 p-3 border rounded-lg font-mono text-sm bg-gray-50"
                      value={generateCode()}
                      readOnly
                    />
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generateCode())
                      alert('Código copiado para a área de transferência!')
                    }}
                    className="w-full"
                  >
                    Copiar Código
                  </Button>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Instruções:</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Copie o código acima</li>
                      <li>Cole no &lt;head&gt; da sua página HTML</li>
                      <li>O Super Pixel começará a capturar dados automaticamente</li>
                      <li>Monitore os eventos no dashboard</li>
                    </ol>
                  </div>
                </div>
              )}
              
              {!showCode && (
                <div className="text-center py-8 text-gray-500">
                  <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Clique em "Mostrar Código" para ver</p>
                  <p className="text-sm">o código de implementação</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 