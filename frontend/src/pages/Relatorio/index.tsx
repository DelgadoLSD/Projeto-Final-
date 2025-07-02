import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom' 
import { 
    ArrowLeft, 
    Download, 
    MapPin,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Activity,
    Camera
} from 'lucide-react'
import { ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, Tooltip } from 'recharts' // Removido Legend do import

import { Container, MaxWidthWrapper, HeaderSection, HeaderTitleContainer, BackButton, ReportTitle, ReportSubtitle, DownloadButton, 
    QuickStatsGrid, StatCard, StatContent, AnomalyStatValue, StatusIndicator, FarmInfoSection, FarmInfoTitle, FarmInfoGrid, FarmInfoItem,
    ChartContainer, // ChartContainer ainda é necessário para o gráfico de pizza
    StyledIcon
   } from './styled' 

interface Farm {
    id: string
    name: string
    ccm: string
    latitude: string
    longitude: string
    area: number
    status: 'healthy' | 'warning' | 'critical'
    producerName: string
    producerCpf: string
    totalImages: number
    anomalousImages: number
    normalImages: number
}

interface ReportData {
    anomalyTypes: Array<{
        name: string
        value: number
        color: string
    }>
}

// COLORS pode ser removido se as cores vêm totalmente do backend, mas não causa problema se ficar
const COLORS = ['#ef4444', '#22c55e'] 

export default function FarmReport() {
    const { farmId } = useParams<{ farmId: string }>()
    const navigate = useNavigate()
    const [farm, setFarm] = useState<Farm | null>(null)
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFarmReport = async () => {
            setIsLoading(true)
            setError(null)
            try {
                if (!farmId) {
                    setError("ID da fazenda não fornecido.");
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5000/area-produtor/relatorio/${farmId}`, {
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
                    setReportData(data.reportData)
                } else {
                    throw new Error(data.message || 'Falha ao buscar dados do relatório.')
                }
            } catch (err: any) {
                setError(err.message)
                console.error("Erro ao carregar dados do relatório:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFarmReport()
    }, [farmId, navigate])

    const handleGoBack = () => {
        navigate('/area-produtor')
    }

    const handleDownloadReport = () => {
        alert('Funcionalidade de download será implementada')
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <StyledIcon as={CheckCircle} iconColor="#22c55e" />
            case 'warning':
                return <StyledIcon as={AlertTriangle} iconColor="#f59e0b" />
            case 'critical':
                return <StyledIcon as={XCircle} iconColor="#ef4444" />
            default:
                return <StyledIcon as={CheckCircle} iconColor="#22c55e" />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'healthy': return 'Saudável'
            case 'warning': return 'Atenção'
            case 'critical': return 'Crítico'
            default: return 'Saudável'
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Carregando relatório...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600">
                <div className="text-lg">Erro ao carregar relatório: {error}</div>
            </div>
        )
    }

    if (!farm || !reportData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Dados da fazenda ou relatório não encontrados.</div>
            </div>
        )
    }

    const anomalyPercentage = ((farm.anomalousImages / farm.totalImages) * 100).toFixed(1)
    
    // Verificação para garantir que anomalyTypes tem dados para o gráfico de pizza
    const hasPieChartData = reportData.anomalyTypes && reportData.anomalyTypes.length > 0;

    return (
        <Container>
            <MaxWidthWrapper>
                {/* Header */}
                <HeaderSection>
                    <HeaderTitleContainer>
                        <BackButton onClick={handleGoBack}>
                            <ArrowLeft size={20} />
                            Voltar
                        </BackButton>
                        <div>
                            <ReportTitle>
                                Relatório - {farm.name}
                            </ReportTitle>
                            <ReportSubtitle>
                                Análise detalhada da propriedade rural
                            </ReportSubtitle>
                        </div>
                    </HeaderTitleContainer>

                    <DownloadButton onClick={handleDownloadReport}>
                        <Download size={20} />
                        Baixar Relatório
                    </DownloadButton>
                </HeaderSection>

                {/* Quick Stats */}
                <QuickStatsGrid>
                    <StatCard>
                        <StatContent>
                            <p>Imagens Analisadas</p>
                            <p>{farm.totalImages}</p>
                        </StatContent>
                        <StyledIcon as={Camera} iconColor="#000" />
                    </StatCard>

                    <StatCard>
                        <AnomalyStatValue>
                            <p>Anomalias Detectadas</p>
                            <p>{farm.anomalousImages}</p>
                            <p>{anomalyPercentage}% do total</p>
                        </AnomalyStatValue>
                        <StyledIcon as={AlertTriangle} iconColor="#f59e0b" />
                    </StatCard>

                    <StatCard>
                        <StatContent>
                            <p>Status Geral</p>
                            <StatusIndicator>
                                {getStatusIcon(farm.status)}
                                <span>{getStatusText(farm.status)}</span>
                            </StatusIndicator>
                        </StatContent>
                        <StyledIcon as={Activity} iconColor="#000" />
                    </StatCard>
                </QuickStatsGrid>

                {/* Farm Info */}
                <FarmInfoSection>
                    <FarmInfoTitle>Informações da Propriedade</FarmInfoTitle>
                    <FarmInfoGrid>
                        <FarmInfoItem>
                            <MapPin className="w-5 h-5 text-blue-500 " />
                            <div>
                                <p>Coordenadas</p>
                                <p>{farm.latitude}, {farm.longitude}</p>
                            </div>
                        </FarmInfoItem>
                        <FarmInfoItem>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <div>
                                <p>Área Total</p>
                                <p>{farm.area} hectares</p>
                            </div>
                        </FarmInfoItem>
                    </FarmInfoGrid>
                </FarmInfoSection>

                {/* Gráfico de Pizza direto, sem abas */}
                <ChartContainer>
                    {/* Removido o título "Distribuição de Anomalias (Total)" */}
                    {hasPieChartData ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsPieChart margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
                                <Pie
                                    data={reportData.anomalyTypes}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8" 
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {reportData.anomalyTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                {/* Removido o componente Legend */}
                                {/* <Legend /> */} 
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
                            Nenhum dado disponível para a distribuição de anomalias.
                            <br/>Certifique-se de que há imagens processadas para esta fazenda.
                        </p>
                    )}
                </ChartContainer>

            </MaxWidthWrapper>
        </Container>
    )
}