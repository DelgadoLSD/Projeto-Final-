import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  MapPin, 
  TrendingUp,
  Leaf,
  Map,
  LogOut
} from 'lucide-react'
import {
  ProducerContainer,
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
  LogoutButton
} from './styled'
import { MapSelector } from '../../components/Map/MapSelector'


interface Farm {
  id: string
  name: string
  ccm: string
  latitude: string
  longitude: string
  area: number
}

export function Producer() {
  const navigate = useNavigate()
  const [farms, setFarms] = useState<Farm[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isHeatMapModalOpen, setIsHeatMapModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ccm: '',
    latitude: '',
    longitude: '',
    area: '',
  })

  const handleLogout = () => {
    // lógica de logout (limpar tokens, etc.)
    // localStorage.removeItem('authToken')
    // sessionStorage.clear()
    
    // Redirecionar para a tela de login
    navigate('/login')
  }

  const handleAddFarm = () => {
    setIsAddModalOpen(true)
  }

  const handleGenerateHeatMap = () => {
    setIsHeatMapModalOpen(true)
  }

  const handleGenerateReport = () => {
    setIsReportModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/area-produtor/fazendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ccm: formData.ccm,
          name: formData.name,
          latitude: formData.latitude,
          longitude: formData.longitude,
          area: formData.area
        })
      });
      const data = await response.json();

      if (data.status === 'success') {
        await carregarFazendas();
        setFormData({ name: '', latitude: '', longitude: '', area: '', ccm: '' });
        setIsAddModalOpen(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Falha de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };


  // MODIFICAÇÃO: AQUI
  const handleFarmSelect = (farmId: string) => {
    // Redirecionar para página do mapa de calor usando a ROTA ESPECÍFICA DO PRODUTOR
    navigate(`/area-produtor/heat-map/${farmId}`) // Nova rota no frontend para o produtor
    setIsHeatMapModalOpen(false)
  }

  const handleReportFarmSelect = (farmId: string) => {
    navigate(`/relatorio/${farmId}`)
    setIsReportModalOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function carregarFazendas() {
    try {
      const res = await fetch('http://localhost:5000/area-produtor/fazendas', {
        method: 'GET',
        credentials: 'include' 
      })
      const data = await res.json()
      if (data.status === 'success') {
        setFarms(data.fazendas)
      } else {
        console.error(data.message)
        setFarms([]); 
      }
    } catch (error) {
      console.error('Erro ao buscar fazendas:', error)
      setFarms([]); 
    }
  }

  useEffect(() => {
    carregarFazendas()
  }, [])

  return (
    <>
      <ProducerContainer>
        <LogoutButton onClick={handleLogout}>
          <LogOut />
          Sair
        </LogoutButton>
        <ContentContainer>
          <PageHeader>
            <h1>Painel do Produtor</h1>
            <p>
              Gerencie suas fazendas e monitore a saúde dos seus mamoeiros através 
              de mapas de calor inteligentes baseados em IA
            </p>
          </PageHeader>

          <ActionsContainer>
            <ActionButton variant="primary" onClick={handleAddFarm}>
              <Plus />
              Adicionar Fazenda
            </ActionButton>
            
            <ActionButton variant="secondary" onClick={handleGenerateHeatMap}>
              <Map />
              Gerar Mapa de Calor
            </ActionButton>

            <ActionButton variant="secondary" onClick={handleGenerateReport}>
              <Map />
              Gerar Relatório
            </ActionButton>
          </ActionsContainer>

          {farms.length === 0 ? (
            <EmptyState>
              <Leaf />
              <h3>Nenhuma fazenda cadastrada</h3>
              <p>
                Comece adicionando sua primeira fazenda para monitorar 
                a saúde dos seus mamoeiros com nossa tecnologia de IA
              </p>
            </EmptyState>
          ) : (
            <FarmsGrid>
              {farms.map(farm => (
                <FarmCard key={farm.id}>
                  <h3>{farm.name}</h3>
                  
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
                </FarmCard>
              ))}
            </FarmsGrid>
          )}
        </ContentContainer>

        {/* Modal Adicionar Fazenda */}
        <Modal isOpen={isAddModalOpen}>
          <ModalContent>
            <h2>Adicionar Nova Fazenda</h2>
            
            <form onSubmit={handleFormSubmit}>
              <FormGroup>
                <label htmlFor="name">Nome da Fazenda *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Fazenda Vista Verde"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="name">CCM *</label>
                <input
                  id="ccm"
                  name="ccm"
                  type="number"
                  value={formData.ccm}
                  onChange={handleInputChange}
                  placeholder="Ex: 12345678"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>Localização no mapa</label>
                <MapSelector
                  onSelectLocation={(lat: number, lng: number) => {
                    setFormData(prev => ({
                      ...prev,
                      latitude: lat.toFixed(6),
                      longitude: lng.toFixed(6)
                    }))
                  }}
                />
                {formData.latitude && formData.longitude && (
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Selecionado: {formData.latitude}, {formData.longitude}
                  </p>
                )}
              </FormGroup>

              
              <FormGroup>
                <label htmlFor="area">Área (hectares) *</label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Ex: 50.5"
                  required
                />
              </FormGroup>
              
              
              <ModalActions>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Adicionar Fazenda'}
                </Button>
              </ModalActions>
            </form>
            
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
              Escolha uma fazenda para gerar o mapa de calor
            </p>
            
            {farms.length === 0 ? (
              <EmptyState>
                <Leaf />
                <h3>Nenhuma fazenda disponível</h3>
                <p>Adicione uma fazenda primeiro para gerar mapas de calor</p>
              </EmptyState>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {farms.map(farm => (
                  <FarmCard 
                    key={farm.id} 
                    onClick={() => handleFarmSelect(farm.id)} // ESTE É O BOTÃO QUE REDIRECIONA
                    style={{ margin: 0 }}
                  >
                    <h3>{farm.name}</h3>
                    <div className="farm-info">
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.latitude}</span>
                      </div>
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.longitude} </span>
                      </div>
                      <div className="info-item">
                        <TrendingUp />
                        <span>{farm.area} hectares</span>
                      </div>
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

        {/* Modal Selecionar Fazenda para gerar relatorio */}
        <Modal isOpen={isReportModalOpen}>
          <ModalContent>
            <h2>Selecionar Fazenda</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
              Escolha uma fazenda para gerar o relatório
            </p>
            
            {farms.length === 0 ? (
              <EmptyState>
                <Leaf />
                <h3>Nenhuma fazenda disponível</h3>
                <p>Adicione uma fazenda primeiro para gerar relatorio</p>
              </EmptyState>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {farms.map(farm => (
                  <FarmCard 
                    key={farm.id} 
                    onClick={() => handleReportFarmSelect(farm.id)}
                    style={{ margin: 0 }}
                  >
                    <h3>{farm.name}</h3>
                    <div className="farm-info">
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.latitude}</span>
                      </div>
                      <div className="info-item">
                        <MapPin />
                        <span>{farm.longitude} </span>
                      </div>
                      <div className="info-item">
                        <TrendingUp />
                        <span>{farm.area} hectares</span>
                      </div>
                    </div>
                  </FarmCard>
                ))}
              </div>
            )}
            
            <ModalActions>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsReportModalOpen(false)}
              >
                Cancelar
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      </ProducerContainer>
    </>
  )
}