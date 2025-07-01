import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
    ArrowLeft, 
    Download, 
    RefreshCw,
    MapPin,
    TrendingUp,
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
    producerName: string
    producerCpf: string
}

interface ImageData {
    nome: string
    lat: number
    lng: number
    anomala: boolean
}

const HeatMapContainer: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%',
    overflowX: 'hidden',
};

const ContentContainer: React.CSSProperties = {
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem',
    flex: 1,
};

const PageHeader: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
};

const ActionsContainer: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
};

const MapContainer: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem',
};

const FarmInfoCard: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem',
};

export function HeatMap() {
    const { farmId } = useParams<{ farmId: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<any>(null)
    
    const [farm, setFarm] = useState<Farm | null>(null)
    const [images, setImages] = useState<ImageData[]>([])
    const [isLoading, setIsLoading] = useState(true) // CORREÇÃO AQUI
    const [error, setError] = useState<string | null>(null)

    // Função auxiliar para montar a URL da API dinamicamente
    const getApiUrl = () => {
        const params = new URLSearchParams(location.search)
        const userType = params.get('userType')

        if (userType === 'produtor') {
            return `http://localhost:5000/area-produtor/mapa-calor/${farmId}`
        }
        // Se não for produtor, usa a rota do mosaiqueiro como padrão
        return `http://localhost:5000/area-mosaiqueiro/mapa-calor/${farmId}`
    }

    useEffect(() => {
        const fetchHeatmapData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const apiUrl = getApiUrl()
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login')
                        return
                    }
                    const errorData = await response.json()
                    throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
                }

                const data = await response.json()

                if (data.status === 'success') {
                    setFarm(data.farm)
                    setImages(data.images)
                } else {
                    throw new Error(data.message || 'Falha ao buscar dados do mapa de calor.')
                }
            } catch (err: any) {
                setError(err.message)
                console.error("Erro ao carregar dados do mapa de calor:", err)
            } finally {
                setIsLoading(false)
            }
        }

        if (farmId) {
            fetchHeatmapData()
        }
    }, [farmId, navigate, location.search])

    // Função para criar interpolação com gradiente vermelho→amarelo para anomalias
    const createAnomalyHeatmap = (map: any, anomalousImages: ImageData[]) => {
        anomalousImages.forEach(img => {
            // Camadas com gradiente vermelho no centro → amarelo nas bordas
            const anomalyLayers = [
                { radius: 45, opacity: 0.08, color: '#ffeb3b' }, // Amarelo mais externo
                { radius: 35, opacity: 0.12, color: '#ffc107' }, // Amarelo-laranja
                { radius: 28, opacity: 0.18, color: '#ff9800' }, // Laranja
                { radius: 22, opacity: 0.25, color: '#ff5722' }, // Laranja-vermelho
                { radius: 16, opacity: 0.32, color: '#f44336' }, // Vermelho
                { radius: 12, opacity: 0.40, color: '#d32f2f' }, // Vermelho escuro
                { radius: 8, opacity: 0.50, color: '#b71c1c' }   // Vermelho muito escuro
            ]

            anomalyLayers.forEach(layer => {
                window.L.circle([img.lat, img.lng], {
                    radius: layer.radius,
                    fillColor: layer.color,
                    color: 'transparent',
                    weight: 0,
                    fillOpacity: layer.opacity
                }).addTo(map)
            })

            // Ponto central vermelho
            window.L.circleMarker([img.lat, img.lng], {
                radius: 3,
                fillColor: '#b71c1c',
                color: '#ffffff',
                weight: 1,
                fillOpacity: 1,
                opacity: 1
            }).bindPopup(`${img.nome}<br><strong>Anomalia Detectada</strong>`)
            .addTo(map)
        })
    }

    // Função para criar interpolação verde para pontos normais
    const createNormalHeatmap = (map: any, normalImages: ImageData[]) => {
        normalImages.forEach(img => {
            // Camadas verdes irradiando
            const normalLayers = [
                { radius: 35, opacity: 0.08, color: '#81c784' }, // Verde claro externo
                { radius: 28, opacity: 0.12, color: '#66bb6a' }, // Verde claro-médio
                { radius: 22, opacity: 0.18, color: '#4caf50' }, // Verde médio
                { radius: 16, opacity: 0.25, color: '#43a047' }, // Verde médio-escuro
                { radius: 12, opacity: 0.32, color: '#388e3c' }, // Verde escuro
                { radius: 8, opacity: 0.40, color: '#2e7d32' }   // Verde muito escuro
            ]

            normalLayers.forEach(layer => {
                window.L.circle([img.lat, img.lng], {
                    radius: layer.radius,
                    fillColor: layer.color,
                    color: 'transparent',
                    weight: 0,
                    fillOpacity: layer.opacity
                }).addTo(map)
            })

            // Ponto central verde
            window.L.circleMarker([img.lat, img.lng], {
                radius: 4,
                fillColor: '#2e7d32',
                color: '#ffffff',
                weight: 1,
                fillOpacity: 1,
                opacity: 1
            }).bindPopup(`${img.nome}<br><strong>Status: Normal</strong>`)
            .addTo(map)
        })
    }

    // Função principal que combina ambos os efeitos
    const createCombinedHeatmap = (map: any, anomalousImages: ImageData[], normalImages: ImageData[]) => {
        // Primeiro renderiza os pontos normais (verdes)
        if (normalImages.length > 0) {
            createNormalHeatmap(map, normalImages)
        }
        
        // Depois renderiza as anomalias (vermelho→amarelo) por cima
        if (anomalousImages.length > 0) {
            createAnomalyHeatmap(map, anomalousImages)
        }
    }

    useEffect(() => {
        if (!farm || !mapRef.current || !window.L) return 

        const initializeMap = () => {
            if (!mapRef.current) return;

            const centro = {
                lat: parseFloat(farm.latitude),
                lng: parseFloat(farm.longitude)
            }
            
            if (isNaN(centro.lat) || isNaN(centro.lng)) {
                console.error("Coordenadas inválidas recebidas da fazenda:", farm.latitude, farm.longitude);
                setError("Coordenadas da fazenda são inválidas.");
                return;
            }

            const raio_km = Math.sqrt(farm.area / Math.PI)
            const raio_m = raio_km * 1000

            if (mapInstance.current) {
                mapInstance.current.remove()
            }

            const mapa = window.L.map(mapRef.current).setView([centro.lat, centro.lng], 15)
            
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapa)

            // Área da fazenda
            window.L.circle([centro.lat, centro.lng], {
                radius: raio_m,
                color: 'green',
                fillColor: 'lightgreen',
                fillOpacity: 0.2,
                weight: 3
            }).addTo(mapa)

            if (images.length > 0) {
                // Separar imagens anômalas e normais
                const anomalousImages = images.filter(img => img.anomala)
                const normalImages = images.filter(img => !img.anomala)

                // Criar efeito de heatmap combinado com interpolação
                createCombinedHeatmap(mapa, anomalousImages, normalImages)

                console.log(`Mapa criado com ${anomalousImages.length} anomalias e ${normalImages.length} pontos normais`)
            }

            mapInstance.current = mapa
            mapa.invalidateSize();
        };

        const timeoutId = setTimeout(initializeMap, 0);

        return () => {
            clearTimeout(timeoutId);
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        }
    }, [farm, images]) 

    const handleGoBack = () => {
        const params = new URLSearchParams(location.search)
        const userType = params.get('userType')

        if(userType === 'produtor'){
            navigate('/area-produtor')
        } else {
            navigate('/area-mosaiqueiro')
        }
    }

    const handleRefresh = () => {
        if (farmId) {
            const refreshData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const apiUrl = getApiUrl();
                    const response = await fetch(apiUrl, { 
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.status === 'success') {
                        setFarm(data.farm);
                        setImages(data.images);
                    } else {
                        throw new Error(data.message || 'Falha ao recarregar dados.');
                    }
                } catch (err: any) {
                    setError(err.message);
                    console.error("Erro ao recarregar dados do mapa de calor:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            refreshData();
        }
    }

    const handleDownload = () => {
        alert('Funcionalidade de download será implementada')
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
                <div>Fazenda não encontrada ou dados não carregados.</div>
            </div>
        )
    }

    return (
        <div style={HeatMapContainer}>
            <div style={ContentContainer}>
                <div style={PageHeader}>
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
                    
                    <div style={ActionsContainer}>
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
                <div style={FarmInfoCard}>
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
                    </div>
                </div>

                {/* Container do Mapa */}
                <div style={MapContainer}>
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
                                <div style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    background: 'radial-gradient(circle, #b71c1c 0%, #ffeb3b 100%)', 
                                    borderRadius: '50%',
                                    position: 'relative',
                                    border: '1px solid #b71c1c' 
                                }}>
                                    {/* Removido o ponto vermelho interno para a legenda de Plantas Anômalas */}
                                </div>
                                <span>Plantas Anômalas</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    background: 'radial-gradient(circle, #2e7d32 0%, #81c784 100%)', 
                                    borderRadius: '50%',
                                    border: '1px solid #2e7d32' 
                                }}></div>
                                <span>Plantas Normais</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}