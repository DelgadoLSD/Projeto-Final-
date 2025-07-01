import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Download, 
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Camera,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts'

import { Container, MaxWidthWrapper, HeaderSection, HeaderTitleContainer, BackButton, ReportTitle, ReportSubtitle, DownloadButton, 
  QuickStatsGrid, StatCard, StatContent, AnomalyStatValue, HealthStatValue, StatusIndicator, FarmInfoSection, FarmInfoTitle, FarmInfoGrid, FarmInfoItem,
  TabsSection, TabNav, TabButton, TabContent, TwoColumnGrid, ChartContainer, ThreeColumnGrid, AnomalyTypeCard, AnomalyTypeColorIndicator,
  RecommendationCard, RecommendationHeader, PriorityTag, RecommendationDescription, ActionRecommendedBox
 } from './styled'


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
  totalImages: number
  anomalousImages: number
  normalImages: number
}

interface ReportData {
  weeklyAnalysis: Array<{
    week: string
    anomalias: number
    normal: number
    total: number
  }>
  anomalyTypes: Array<{
    name: string
    value: number
    color: string
  }>
  monthlyTrend: Array<{
    month: string
    anomalias: number
    eficiencia: number
  }>
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    action: string
  }>
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

export default function FarmReport() {
  const [farmId] = useState('1') // Mock farmId
  
  const [farm, setFarm] = useState<Farm | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'recommendations'>('overview')

  // Mock data
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
    producerCpf: '123.456.789-00',
    totalImages: 150,
    anomalousImages: 32,
    normalImages: 118
  }

  const mockReportData: ReportData = {
    weeklyAnalysis: [
      { week: 'Sem 1', anomalias: 8, normal: 22, total: 30 },
      { week: 'Sem 2', anomalias: 12, normal: 18, total: 30 },
      { week: 'Sem 3', anomalias: 6, normal: 24, total: 30 },
      { week: 'Sem 4', anomalias: 6, normal: 24, total: 30 },
      { week: 'Sem 5', anomalias: 0, normal: 30, total: 30 }
    ],
    anomalyTypes: [
      { name: 'Pragas', value: 45, color: '#ef4444' },
      { name: 'Doenças', value: 25, color: '#f97316' },
      { name: 'Deficiência Nutricional', value: 20, color: '#eab308' },
      { name: 'Estresse Hídrico', value: 10, color: '#22c55e' }
    ],
    monthlyTrend: [
      { month: 'Jan', anomalias: 15, eficiencia: 85 },
      { month: 'Fev', anomalias: 22, eficiencia: 78 },
      { month: 'Mar', anomalias: 18, eficiencia: 82 },
      { month: 'Abr', anomalias: 12, eficiencia: 88 },
      { month: 'Mai', anomalias: 8, eficiencia: 92 },
      { month: 'Jun', anomalias: 32, eficiencia: 68 }
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'Controle de Pragas Urgente',
        description: 'Detectado aumento significativo de pragas na região sudeste da propriedade.',
        action: 'Aplicar inseticida específico nas coordenadas identificadas no prazo de 48h.'
      },
      {
        priority: 'medium',
        title: 'Monitoramento Nutricional',
        description: 'Sinais de deficiência nutricional em 20% das áreas analisadas.',
        action: 'Realizar análise de solo e ajustar programa de adubação.'
      },
      {
        priority: 'low',
        title: 'Otimização de Irrigação',
        description: 'Oportunidade de melhoria na distribuição de água.',
        action: 'Revisar sistema de irrigação para melhor uniformidade.'
      }
    ]
  }

  useEffect(() => {
    setFarm(mockFarm)
    setReportData(mockReportData)
    setIsLoading(false)
  }, [farmId])

  const handleGoBack = () => {
    alert('Voltar para página anterior')
  }

  const handleDownloadReport = () => {
    alert('Relatório será gerado em PDF e baixado automaticamente')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Média'
      case 'low': return 'Baixa'
      default: return 'Baixa'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Carregando relatório...</div>
      </div>
    )
  }

  if (!farm || !reportData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Dados não encontrados</div>
      </div>
    )
  }

  const anomalyPercentage = ((farm.anomalousImages / farm.totalImages) * 100).toFixed(1)
  const healthScore = (100 - parseFloat(anomalyPercentage)).toFixed(0)

  return (
    <Container> {/* Substitui a div principal */}
      <MaxWidthWrapper> {/* Substitui max-w-7xl mx-auto */}
        {/* Header */}
        <HeaderSection> {/* Substitui bg-white rounded-2xl shadow-lg p-6 mb-6 */}
          <HeaderTitleContainer> {/* Substitui flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 */}
            <BackButton onClick={handleGoBack}> {/* Substitui button */}
              <ArrowLeft size={20} />
              Voltar
            </BackButton>
            <div>
              <ReportTitle> {/* Substitui h1 */}
                Relatório - {farm.name}
              </ReportTitle>
              <ReportSubtitle> {/* Substitui p */}
                Análise detalhada da propriedade rural
              </ReportSubtitle>
            </div>
          </HeaderTitleContainer>

          <DownloadButton onClick={handleDownloadReport}> {/* Substitui button */}
            <Download size={20} />
            Baixar Relatório
          </DownloadButton>
        </HeaderSection>

        {/* Quick Stats */}
        <QuickStatsGrid> {/* Substitui grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 */}
          <StatCard> {/* Substitui bg-white rounded-xl shadow-lg p-6 */}
            <StatContent> {/* Substitui div */}
              <p>Imagens Analisadas</p>
              <p>{farm.totalImages}</p>
            </StatContent>
            <Camera className="w-10 h-10 text-blue-500" />
          </StatCard>

          <StatCard>
            <AnomalyStatValue> {/* Usa o styled component específico para anomalias */}
              <p>Anomalias Detectadas</p>
              <p>{farm.anomalousImages}</p>
              <p>{anomalyPercentage}% do total</p>
            </AnomalyStatValue>
            <AlertTriangle className="w-10 h-10 text-orange-500" />
          </StatCard>

          <StatCard>
            <HealthStatValue> {/* Usa o styled component específico para saúde */}
              <p>Índice de Saúde</p>
              <p>{healthScore}%</p>
            </HealthStatValue>
            <Leaf className="w-10 h-10 text-green-500" />
          </StatCard>

          <StatCard>
            <StatContent>
              <p>Status Geral</p>
              <StatusIndicator> {/* Substitui div flex items-center gap-2 mt-2 */}
                {getStatusIcon(farm.status)}
                <span>{getStatusText(farm.status)}</span>
              </StatusIndicator>
            </StatContent>
            <Activity className="w-10 h-10 text-purple-500" />
          </StatCard>
        </QuickStatsGrid>

        {/* Farm Info */}
        <FarmInfoSection> {/* Reutiliza HeaderSection base */}
          <FarmInfoTitle>Informações da Propriedade</FarmInfoTitle>
          <FarmInfoGrid>
            <FarmInfoItem>
              <MapPin className="w-5 h-5 text-blue-500" />
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
            <FarmInfoItem>
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p>Última Inspeção</p>
                <p>{new Date(farm.lastInspection).toLocaleDateString('pt-BR')}</p>
              </div>
            </FarmInfoItem>
            <FarmInfoItem>
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p>CCM</p>
                <p>{farm.ccm}</p>
              </div>
            </FarmInfoItem>
          </FarmInfoGrid>
        </FarmInfoSection>

        {/* Tabs */}
        <TabsSection> {/* Reutiliza HeaderSection base */}
          <TabNav>
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'analysis', label: 'Análise Detalhada', icon: PieChart },
              { id: 'recommendations', label: 'Recomendações', icon: Zap }
            ].map((tab) => (
              <TabButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                $isActive={activeTab === tab.id} // Propriedade para controle de estilo
              >
                <tab.icon size={18} />
                {tab.label}
              </TabButton>
            ))}
          </TabNav>

          <TabContent>
            {activeTab === 'overview' && (
              <div className="space-y-6"> {/* Manter space-y-6 ou criar um styled */}
                <TwoColumnGrid> {/* Substitui grid grid-cols-1 lg:grid-cols-2 gap-6 */}
                  <ChartContainer>
                    <h3>Análise Semanal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.weeklyAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="normal" stackId="a" fill="#22c55e" name="Normal" />
                        <Bar dataKey="anomalias" stackId="a" fill="#ef4444" name="Anomalias" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <ChartContainer>
                    <h3>Distribuição de Anomalias</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={reportData.anomalyTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {reportData.anomalyTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TwoColumnGrid>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6"> {/* Manter space-y-6 ou criar um styled */}
                <ChartContainer>
                  <h3>Tendência Mensal</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={reportData.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="anomalias" fill="#ef4444" name="Anomalias" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="eficiencia"
                        stroke="#22c55e"
                        strokeWidth={3}
                        name="Eficiência (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <ThreeColumnGrid> {/* Substitui grid grid-cols-1 md:grid-cols-3 gap-6 */}
                  {reportData.anomalyTypes.map((type, index) => (
                    <AnomalyTypeCard key={index}> {/* Substitui div */}
                      <div className="flex items-center gap-3 mb-2">
                        <AnomalyTypeColorIndicator $color={type.color} />
                        <h4>{type.name}</h4>
                      </div>
                      <p>{type.value}%</p>
                      <p>do total de anomalias</p>
                    </AnomalyTypeCard>
                  ))}
                </ThreeColumnGrid>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-4"> {/* Manter space-y-4 ou criar um styled */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendações de Ação</h3>
                {reportData.recommendations.map((rec, index) => (
                  <RecommendationCard key={index}> {/* Substitui div */}
                    <RecommendationHeader> {/* Substitui div */}
                      <h4>{rec.title}</h4>
                      <PriorityTag $priorityColor={rec.priority}> {/* Propriedade para estilo */}
                        Prioridade {getPriorityText(rec.priority)}
                      </PriorityTag>
                    </RecommendationHeader>
                    <RecommendationDescription>{rec.description}</RecommendationDescription>
                    <ActionRecommendedBox> {/* Substitui div */}
                      <p>Ação Recomendada:</p>
                      <p>{rec.action}</p>
                    </ActionRecommendedBox>
                  </RecommendationCard>
                ))}
              </div>
            )}
          </TabContent>
        </TabsSection>
      </MaxWidthWrapper>
    </Container>
  )
}