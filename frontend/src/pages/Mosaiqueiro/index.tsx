import React, { useState, useEffect } from 'react'
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
    Search,
    LogOut
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
    SearchResults,
    LogoutButton
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

    useEffect(() => {
        const fetchAssociatedFarms = async () => {
            try {
                const resp = await fetch('http://localhost:5000/area-mosaiqueiro/fazendas/associadas', {
                    method: 'GET',
                    credentials: 'include'
                })
                const json = await resp.json()
                if (json.status === 'success') {
                    setAssociatedFarms(json.fazendas.map((f: any) => ({
                        id: f.id.toString(),
                        name: f.nome,
                        ccm: f.ccm,
                        latitude: f.latitude.toString(),
                        longitude: f.longitude.toString(),
                        area: parseFloat(f.area),
                        status: 'healthy', // ou ajuste se vier do backend
                        lastInspection: new Date().toISOString().split('T')[0],
                        producerName: '',
                        producerCpf: ''
                    })))
                } else {
                    console.warn('Erro ao buscar fazendas associadas:', json.message)
                }
            } catch (err) {
                console.error('Erro ao carregar fazendas associadas:', err)
            }
        }

        fetchAssociatedFarms()
    }, [])
    
    const handleLogout = () => {
        navigate('/login')
    }

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

            if (!resp.ok) {
                console.error(`Erro HTTP: ${resp.status}`)
                alert('Erro ao buscar fazenda')
                return
            }

            const json = await resp.json()
            console.log('Resposta do backend:', json)

            if (json.status === 'success') {
                setSearchResults(json.fazendas.map((f: any) => ({
                    id: f.id?.toString() || '',
                    name: f.nome || 'Sem nome',
                    ccm: f.ccm || '',
                    latitude: f.latitude?.toString() || '',
                    longitude: f.longitude?.toString() || '',
                    area: parseFloat(f.area) || 0,
                    status: 'healthy',
                    lastInspection: new Date().toISOString().split('T')[0],
                    producerName: f.produtor_nome || '',
                    producerCpf: f.produtor_cpf || ''
                })))
            } else {
                alert(json.message || 'Erro ao buscar fazendas')
            }
        } catch (err) {
            console.error('Erro no fetch:', err)
            alert('Erro de conexão com o servidor')
        } finally {
            setIsLoading(false)
        }
    }

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
                setAssociatedFarms(prev =>
                    prev.some(f => f.id === farm.id) ? prev : [...prev, farm]
                )
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

    // MODIFICAÇÃO CHAVE: Aponta para a rota genérica com o parâmetro de usuário
    const handleFarmSelect = (farmId: string) => {
        navigate(`/heat-map/${farmId}?userType=mosaiqueiro`)
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
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    return (
        <>
            <MosaqueiroContainer>
                <LogoutButton onClick={handleLogout}>
                    <LogOut />
                    Sair
                </LogoutButton>
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

                {/* Modal Associar à Fazenda */}
                <Modal isOpen={isAssociateModalOpen}>
                    <ModalContent>
                        <h2>Associar à Fazenda</h2>
                        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
                            Digite o CCIR da fazenda para encontrá-la
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
                                        style={{ margin: '0 0 1rem 0', cursor: 'pointer' }}
                                    >
                                        <h3>{farm.name}</h3>
                                        <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                            CPF: {formatCpf(farm.producerCpf)}
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
                                    </FarmCard>
                                ))}
                            </SearchResults>
                        )}

                        {searchResults.length === 0 && formData.ccir && !isLoading && (
                            <EmptyState>
                                <Search />
                                <h3>Nenhuma fazenda encontrada</h3>
                                <p>Não foram encontradas fazendas para este CCIR</p>
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
                                        style={{ margin: 0, cursor: 'pointer' }}
                                    >
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