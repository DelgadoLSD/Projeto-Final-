import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  RefreshCw,
  Calendar,
  MapPin,
  TrendingUp,
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Importar Leaflet via CDN no index.html
declare global {
  interface Window {
    L: any;
  }
}

interface Farm {
  id: string
  name: string
  ccm: string
  latitude: string
  longitude: string
  area: number
  status: 'healthy' | 'warning' | 'critical'
  lastInspection: string
  producerName: string
  producerCpf: string
}

interface ImageData {
  nome: string
  lat: number
  lng: number
  anomala: boolean
}

const HeatMapContainer = `
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  width: 100%;
  overflow-x: hidden;
`

const ContentContainer = `
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
`

const PageHeader = `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const ActionsContainer = `
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const ActionButton = `
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #3182ce;
  color: white;
  
  &:hover {
    background: #2c5aa0;
    transform: translateY(-1px);
  }
`

const MapContainer = `
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`

const FarmInfoCard = `
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`

export function HeatMap() {
  const { farmId } = useParams<{ farmId: string }>()
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  
  const [farm, setFarm] = useState<Farm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data baseado no seu HTML
  const mockFarm: Farm = {
    id: farmId || '1',
    name: 'Fazenda Vista Verde',
    ccm: '12345678',
    latitude: '-20.7596',
    longitude: '-42.8736',
    area: 45.5,
    status: 'warning',
    lastInspection: '2024-06-15',
    producerName: 'João Silva',
    producerCpf: '123.456.789-00'
  }

  // Mock de dados de imagens para simular o heatmap
  const mockImages: ImageData[] = [
    { nome: 'IMG_001', lat: -20.7596, lng: -42.8736, anomala: true },
    { nome: 'IMG_002', lat: -20.7598, lng: -42.8738, anomala: false },
    { nome: 'IMG_003', lat: -20.7594, lng: -42.8734, anomala: true },
    { nome: 'IMG_004', lat: -20.7600, lng: -42.8740, anomala: false },
    { nome: 'IMG_005', lat: -20.7592, lng: -42.8732, anomala: true },
    { nome: 'IMG_006', lat: -20.7602, lng: -42.8742, anomala: true },
    { nome: 'IMG_007', lat: -20.7590, lng: -42.8730, anomala: false },
    { nome: 'IMG_008', lat: -20.7604, lng: -42.8744, anomala: true },
    { nome: 'IMG_009', lat: -20.7588, lng: -42.8728, anomala: false },
    { nome: 'IMG_010', lat: -20.7606, lng: -42.8746, anomala: true },
  ]

  useEffect(() => {
    setFarm(mockFarm)
    setIsLoading(false)
  }, [farmId])

  useEffect(() => {
    if (!farm || !mapRef.current || !window.L) return

    const centro = {
      lat: parseFloat(farm.latitude),
      lng: parseFloat(farm.longitude)
    }
    const raio_km = Math.sqrt(farm.area / Math.PI) // Aproximação do raio baseado na área
    const raio_m = raio_km * 1000

    // Limpa mapa anterior se existir
    if (mapInstance.current) {
      mapInstance.current.remove()
    }

    // 1) Cria o mapa e adiciona camada base
    const mapa = window.L.map(mapRef.current).setView([centro.lat, centro.lng], 15)
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapa)

    // 2) Desenha o círculo verde da fazenda
    window.L.circle([centro.lat, centro.lng], {
      radius: raio_m,
      color: 'green',
      fillColor: 'lightgreen',
      fillOpacity: 0.2
    }).addTo(mapa)

    // 3) Prepara dados para o heatmap: só anômalas, peso = 1
    const heatData = mockImages
      .filter(img => img.anomala)
      .map(img => [img.lat, img.lng, 1])

    // 4) Cria o heatmap (interpolação suave) - verifica se o plugin está disponível
    if (window.L.heatLayer) {
      window.L.heatLayer(heatData, {
        radius: 25,   // alcance de cada ponto, em pixels
        blur: 15,     // quanto mais, mais suave
        maxZoom: 17,
        gradient: {
          0.3: 'green',
          0.5: 'yellow',
          0.7: 'orange',
          1.0: 'red'
        }
      }).addTo(mapa)
    }

    // 5) Adiciona marcadores para imagens normais
    mockImages
      .filter(img => !img.anomala)
      .forEach(img => {
        window.L.circleMarker([img.lat, img.lng], {
          radius: 6,
          fillColor: 'blue',
          color: '#000',
          weight: 1,
          fillOpacity: 0.6
        }).bindPopup(`${img.nome}<br><strong>Normal</strong>`)
          .addTo(mapa)
      })

    mapInstance.current = mapa

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
      }
    }
  }, [farm])

  const handleGoBack = () => {
    // Verifica a origem e navega para a página correspondente
  const previousPage = farm?.producerName ? '/area-produtor' : '/area-mosaiqueiro';
  navigate(previousPage);
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simula recarregamento dos dados
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleDownload = () => {
    alert('Funcionalidade de download será implementada')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle style={{ color: '#38a169' }} />
      case 'warning':
        return <AlertTriangle style={{ color: '#ed8936' }} />
      case 'critical':
        return <XCircle style={{ color: '#e53e3e' }} />
      default:
        return <CheckCircle style={{ color: '#38a169' }} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Saudável'
      case 'warning':
        return 'Atenção'
      case 'critical':
        return 'Crítico'
      default:
        return 'Saudável'
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Carregando mapa...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Erro: {error}</div>
      </div>
    )
  }

  if (!farm) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Fazenda não encontrada</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', width: '100%', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '2rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={handleGoBack}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                background: '#6c757d', 
                color: 'white' 
              }}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#1a202c', margin: '0', fontWeight: '700' }}>
                Mapa de Calor - {farm.name}
              </h1>
              <p style={{ color: '#4a5568', margin: '0.5rem 0 0 0' }}>
                Visualização das anomalias detectadas na fazenda
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleRefresh}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                background: '#3182ce', 
                color: 'white' 
              }}
            >
              <RefreshCw size={20} />
              Atualizar
            </button>
            <button 
              onClick={handleDownload}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease', 
                background: '#28a745', 
                color: 'white' 
              }}
            >
              <Download size={20} />
              Exportar
            </button>
          </div>
        </div>

        {/* Informações da Fazenda */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} style={{ color: '#3182ce' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>Coordenadas</div>
                <div style={{ fontWeight: '600', color: '#000' }}>{farm.latitude}, {farm.longitude}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} style={{ color: '#3182ce' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>Área</div>
                <div style={{ fontWeight: '600', color: '#000' }}>{farm.area} hectares</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: '#3182ce' }} />
              <div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>Última Inspeção</div>
                <div style={{ fontWeight: '600', color: '#000' }}>{new Date(farm.lastInspection).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getStatusIcon(farm.status)}
              <div>
                <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>Status</div>
                <div style={{ fontWeight: '600', color: '#000' }}>{getStatusText(farm.status)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Container do Mapa */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1a202c' }}>Mapa de Calor das Anomalias</h3>
          <div 
            ref={mapRef}
            style={{ 
              height: '500px', 
              width: '100%', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          />
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1rem' }}>Legenda:</h4>
            <div style={{ display: 'flex', gap: '2rem', color:'#000',  flexWrap: 'wrap', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px' , height: '12px', background: 'lightgreen', border: '1px solid green', borderRadius: '50%' }}></div>
                <span>Área da Fazenda</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px' , height: '12px', background: 'red', borderRadius: '50%' }}></div>
                <span>Áreas com Anomalias (Heatmap)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: 'blue', borderRadius: '50%' }}></div>
                <span>Pontos Normais</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}