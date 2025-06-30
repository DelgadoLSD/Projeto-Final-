import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  UserPlus, 
  MapPin, 
  TrendingUp,
  Leaf,
  Map,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react'
import {
  MosaqueiroContainer,
  ContentContainer,
  PageHeader,
  ActionsContainer,
  ActionButton,
  FarmsGrid,
  FarmCard,
  Modal,
  ModalContent,
  FormGroup,
  ModalActions,
  Button,
  EmptyState,
  LoadingSpinner,
  SearchResults
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
}

export function Mosaiqueiro() {
  const navigate = useNavigate()
  const [associatedFarms, setAssociatedFarms] = useState<Farm[]>([])
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false)
  const [isHeatMapModalOpen, setIsHeatMapModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Farm[]>([])
  const [formData, setFormData] = useState({
    ccir: '',
  })

  // Simulação de fazendas disponíveis no sistema
  const mockFarms: Farm[] = [
    {
      id: '1',
      name: 'Fazenda Vista Verde',
      ccm: '12345678',
      latitude: '-20.7596',
      longitude: '-42.8736',
      area: 45.5,
      status: 'healthy',
      lastInspection: '2024-06-15',
      producerName: 'João Silva',
      producerCpf: '123.456.789-00'
    },
    {
      id: '2',
      name: 'Fazenda Esperança',
      ccm: '87654321',
      latitude: '-20.7850',
      longitude: '-42.9012',
      area: 32.8,
      status: 'warning',
      lastInspection: '2024-06-10',
      producerName: 'Maria Santos',
      producerCpf: '987.654.321-00'
    },
    {
      id: '3',
      name: 'Fazenda Prosperidade',
      ccm: '11223344',
      latitude: '-20.7420',
      longitude: '-42.8956',
      area: 78.2,
      status: 'critical',
      lastInspection: '2024-06-05',
      producerName: 'Carlos Oliveira',
      producerCpf: '456.789.123-00'
    }
  ]

  const handleAssociateFarm = () => {
    setIsAssociateModalOpen(true)
  }

  const handleGenerateHeatMap = () => {
    setIsHeatMapModalOpen(true)
  }

  const handleSearchProducer = async () => {
    setIsLoading(true)
    try {
      const resp = await fetch(
        `http://localhost:5000/area-mosaiqueiro/fazendas?ccir=${formData.ccir}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      )
      const json = await resp.json()
      if (json.status === 'success') {
        setSearchResults(json.fazendas.map((f: any) => ({
          id:    f.id.toString(),
          name:  f.nome,
          ccm:   f.ccm,
          latitude:  f.latitude.toString(),
          longitude: f.longitude.toString(),
          area:      parseFloat(f.area),
          status:    'healthy',
          lastInspection: new Date().toISOString().split('T')[0],
          producerName: ''  // opcional: buscar nome do produtor se quiser
        })))
      } else {
        alert(json.message)
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao buscar fazenda')
    } finally {
      setIsLoading(false)
    }
  }


    // antes de tudo, marque a função como async
  const handleAssociateFarmConfirm = async (farm: Farm) => {
    setIsLoading(true)
    try {
      const resp = await fetch(
        'http://localhost:5000/area-mosaiqueiro/fazendas',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ farm_id: farm.id })
        }
      )
      const json = await resp.json()
      if (json.status === 'success') {
        // só adiciona se não estiver na lista
        setAssociatedFarms(prev =>
          prev.some(f => f.id === farm.id) ? prev : [...prev, farm]
        )
        // limpa o modal
        setSearchResults([])
        setFormData({ ccir: '' })
        setIsAssociateModalOpen(false)
      } else {
        alert(json.message)
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao associar fazenda')
    } finally {
      setIsLoading(false)
    }
  }


  const handleFarmSelect = (farmId: string) => {
    // Redirecionar para página do mapa de calor
    navigate(`/heat-map/${farmId}`)
    setIsHeatMapModalOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle />
      case 'warning':
        return <AlertTriangle />
      case 'critical':
        return <XCircle />
      default:
        return <CheckCircle />
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

  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <>
      <MosaqueiroContainer>
        <ContentContainer>
          <PageHeader>
            <h1>Painel do Mosaiqueiro</h1>
            <p>
              Associe-se às fazendas através do CPF do produtor e monitore 
              a saúde dos mamoeiros com mapas de calor inteligentes
            </p>
          </PageHeader>

          <ActionsContainer>
            <ActionButton variant="primary" onClick={handleAssociateFarm}>
              <UserPlus />
              Associar à Fazenda
            </ActionButton>
            
            <ActionButton variant="secondary" onClick={handleGenerateHeatMap}>
              <Map />
              Ver Mapa de Calor
            </ActionButton>
          </ActionsContainer>

          {associatedFarms.length === 0 ? (
            <EmptyState>
              <Leaf />
              <h3>Nenhuma fazenda associada</h3>
              <p>
                Comece se associando a uma fazenda através do CPF do produtor 
                para monitorar a saúde dos mamoeiros
              </p>
            </EmptyState>
          ) : (
            <FarmsGrid>
              {associatedFarms.map(farm => (
                <FarmCard key={farm.id}>
                  <h3>{farm.name}</h3>
                  <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    Produtor: {farm.producerName}
                  </p>
                  
                  <div className="farm-info">
                    <div className="info-item">
                      <MapPin />
                      <span>{farm.latitude}</span>
                    </div>

                    <div className="info-item">
                      <MapPin />
                      <span>{farm.longitude}</span>
                    </div>
                    
                    <div className="info-item">
                      <TrendingUp />
                      <span>{farm.area} hectares</span>
                    </div>
                  </div>
                  
                  <div className={`farm-status ${farm.status}`}>
                    {getStatusIcon(farm.status)}
                    {getStatusText(farm.status)}
                  </div>
                </FarmCard>
              ))}
            </FarmsGrid>
          )}
        </ContentContainer>

        {/* Modal Associar à Fazenda */}
        <Modal isOpen={isAssociateModalOpen}>
          <ModalContent>
            <h2>Associar à Fazenda</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
              Digite o CPF do produtor para encontrar suas fazendas
            </p>
            
            <FormGroup>
              <label htmlFor="ccir">CCIR da Fazenda *</label>
              <input
                id="ccir"
                name="ccir"
                type="text"
                value={formData.ccir}
                onChange={handleInputChange}
                placeholder="Ex: 12345678"
                required
              />
            </FormGroup>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleSearchProducer}
                disabled={isLoading || !formData.ccir}
              >
                <Search style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
                {isLoading ? 'Buscando...' : 'Buscar Fazendas'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <SearchResults>
                <h3>Fazendas encontradas:</h3>
                {searchResults.map(farm => (
                  <FarmCard 
                    key={farm.id}
                    onClick={() => handleAssociateFarmConfirm(farm)}
                    style={{ margin: '0 0 1rem 0' }}
                  >
                    <h3>{farm.name}</h3>
                    <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      Produtor: {farm.producerName} - CPF: {formatCpf(farm.producerCpf)}
                    </p>
                    
                    <div className="farm-info">
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.latitude}</span>
                      </div>
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.longitude}</span>
                      </div>
                      <div className="info-item">
                        <TrendingUp />
                        <span>{farm.area} hectares</span>
                      </div>
                    </div>
                    
                    <div className={`farm-status ${farm.status}`}>
                      {getStatusIcon(farm.status)}
                      {getStatusText(farm.status)}
                    </div>
                  </FarmCard>
                ))}
              </SearchResults>
            )}

            {searchResults.length === 0 && formData.ccir && !isLoading && (
              <EmptyState>
                <Search />
                <h3>Nenhuma fazenda encontrada</h3>
                <p>Não foram encontradas fazendas para este CPF</p>
              </EmptyState>
            )}
            
            <ModalActions>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setIsAssociateModalOpen(false)
                  setSearchResults([])
                  setFormData({ ccir: '' })
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </ModalActions>
            
            {isLoading && (
              <LoadingSpinner>
                <div className="spinner" />
              </LoadingSpinner>
            )}
          </ModalContent>
        </Modal>

        {/* Modal Selecionar Fazenda para Mapa de Calor */}
        <Modal isOpen={isHeatMapModalOpen}>
          <ModalContent>
            <h2>Selecionar Fazenda</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
              Escolha uma fazenda para visualizar o mapa de calor
            </p>
            
            {associatedFarms.length === 0 ? (
              <EmptyState>
                <Leaf />
                <h3>Nenhuma fazenda associada</h3>
                <p>Associe-se a uma fazenda primeiro para visualizar mapas de calor</p>
              </EmptyState>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {associatedFarms.map(farm => (
                  <FarmCard 
                    key={farm.id} 
                    onClick={() => handleFarmSelect(farm.id)}
                    style={{ margin: 0 }}
                  >
                    <h3>{farm.name}</h3>
                    <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      Produtor: {farm.producerName}
                    </p>
                    
                    <div className="farm-info">
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.latitude}</span>
                      </div>
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.longitude}</span>
                      </div>
                      <div className="info-item">
                        <TrendingUp />
                        <span>{farm.area} hectares</span>
                      </div>
                    </div>
                    
                    <div className={`farm-status ${farm.status}`}>
                      {getStatusIcon(farm.status)}
                      {getStatusText(farm.status)}
                    </div>
                  </FarmCard>
                ))}
              </div>
            )}
            
            <ModalActions>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsHeatMapModalOpen(false)}
              >
                Cancelar
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      </MosaqueiroContainer>
    </>
  )
}