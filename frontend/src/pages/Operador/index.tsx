import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Camera, Eye, Clock, CheckCircle, AlertCircle, FileText, 
  X, Calendar, Image, Search, LogOut, UserPlus, Leaf, MapPin, 
  TrendingUp, AlertTriangle, XCircle, ChevronDown
} from 'lucide-react';

import { 
  OperadContainerContainer, ContentContainer, PageHeader, ActionsContainer, ActionButton,
  UploadArea, UploadIcon, HiddenInput, EmptyState, EmptyIcon, PhotoGrid, PhotoCard,
  PhotoPreview, PhotoIcon, PhotoDetails, StatusBadge, ProgressBar, ProgressFill, Modal,
  ModalContent, ModalHeader, ModalCloseButton, HistoryList, HistoryItem, HistoryThumbnail,
  HistoryThumbnailIcon, HistoryInfo, HistoryStatus, HistoryProgress, LogoutButton,
  FarmCard, FarmsGrid, Button, FormGroup, ModalActions, LoadingSpinner, SearchResults
} from './styled';


const getStatusColor = (status: string) => {
  switch (status) {
    case 'uploading': return { bg: '#fff3cd', color: '#856404' };
    case 'processing': return { bg: '#cce7ff', color: '#0056b3' };
    case 'completed': return { bg: '#d4edda', color: '#155724' };
    case 'error': return { bg: '#f8d7da', color: '#721c24' };
    default: return { bg: '#e2e8f0', color: '#4a5568' };
  }
};

// No início do seu arquivo Operator.tsx

type PhotoUpload = {
  id: string;
  filename: string;
  latitude: number;
  longitude: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  uploadDate: string;
  uploadTime: string;
  size: string;
  previewUrl: string;
  progress: number;
  fazenda_id: string;
};

interface Farm {
  id: string;
  name: string;
  ccm: string;
  latitude: string;
  longitude: string;
  area: number;
  status: 'healthy' | 'warning' | 'critical';
  lastInspection: string;
  producerName: string;
  producerCpf: string;
}

export default function Operator() {
  const navigate = useNavigate();
  const [associatedFarms, setAssociatedFarms] = useState<Farm[]>([]);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Farm[]>([]);
  const [formData, setFormData] = useState({ ccir: '' });

  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);

  useEffect(() => {
    const fetchAssociatedFarms = async () => {
      setIsLoadingFarms(true);
      try {
        const resp = await fetch('http://localhost:5000/area-operador/fazendas/associadas', {
          method: 'GET',
          credentials: 'include'
        });
        const json = await resp.json();
        console.log("DADOS RECEBIDOS DO BACKEND:", json); // Ponto de depuração chave!

        if (json.status === 'success' && Array.isArray(json.fazendas)) {
          setAssociatedFarms(json.fazendas.map((f: any) => ({
            id: f.id.toString(),
            name: f.nome,
            ccm: f.ccm || '', // Garantindo que o CCIR seja mapeado
            latitude: f.latitude?.toString() || '0',
            longitude: f.longitude?.toString() || '0',
            area: parseFloat(f.area) || 0,
            status: 'healthy',
            lastInspection: new Date().toISOString().split('T')[0],
            producerName: f.produtor_nome || '',
            producerCpf: f.produtor_cpf || ''
          })));
        } else {
          console.warn('Erro ao buscar fazendas associadas:', json.message);
          setAssociatedFarms([]);
        }
      } catch (err) {
        console.error('Erro na requisição para carregar fazendas:', err);
        setAssociatedFarms([]);
      } finally {
        setIsLoadingFarms(false);
      }
    };
    fetchAssociatedFarms();
  }, []);

  const handleFarmCardClick = (farmId: string) => {
    // Permite selecionar e deselecionar a fazenda clicando novamente
    setSelectedFarmId(prevId => (prevId === farmId ? '' : farmId));
  };

  const checkFarmSelection = (): boolean => {
    if (!selectedFarmId) {
      alert('Por favor, selecione uma fazenda na lista acima antes de realizar esta ação.');
      return false;
    }
    return true;
  };

  const handleFileUpload = () => {
    if (checkFarmSelection()) {
      fileInputRef.current?.click();
    }
  };
  
 // Substitua sua função processFiles por esta

  const processFiles = (files: FileList) => {
    if (!checkFarmSelection()) return;

    Array.from(files).forEach(async (file) => { // Callback agora é async
      // Validações
      const nameWithoutExtension = file.name.slice(0, file.name.lastIndexOf('.'));
      const coordRegex = /^(-?\d+(\.\d+)?)_(-?\d+(\.\d+)?)$/;
      if (!coordRegex.test(nameWithoutExtension) || !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
        alert(`Arquivo inválido: "${file.name}". Verifique o formato do nome (latitude_longitude.ext), tipo e tamanho (máx 10MB).`);
        return;
      }
      
      const [latStr, lonStr] = nameWithoutExtension.split('_');
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lonStr);

      const tempId = Date.now().toString() + Math.random();
      const now = new Date();

      const newPhoto: PhotoUpload = {
        id: tempId, // Usamos um ID temporário para o frontend
        filename: file.name,
        latitude: latitude,
        longitude: longitude,
        status: 'uploading',
        uploadDate: now.toISOString().split('T')[0],
        uploadTime: now.toLocaleTimeString('pt-BR'),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        fazenda_id: selectedFarmId
      };
      
      // Adiciona a foto na UI imediatamente com status "Enviando"
      setPhotos(prev => [newPhoto, ...prev]);
      
      // --- LÓGICA DE UPLOAD REAL ---
      try {
        // Mostra um progresso inicial para o usuário
        setPhotos(prev => prev.map(p => p.id === tempId ? { ...p, progress: 30 } : p));
        
        const formData = new FormData();
        formData.append('imagem', file);
        formData.append('fazenda_id', selectedFarmId);
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());

        setPhotos(prev => prev.map(p => p.id === tempId ? { ...p, progress: 60 } : p));

        // Envia para o endpoint do backend que criamos
        const response = await fetch('http://localhost:5000/area-operador/upload/imagem', {
            method: 'POST',
            credentials: 'include', // Essencial para enviar cookies de sessão
            body: formData,
        });

        // Se a resposta do servidor não for 'ok' (ex: erro 400 ou 500), lança um erro
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no servidor');
        }

        const result = await response.json();
        console.log('Upload bem-sucedido:', result);

        // Sucesso! Atualiza o status da foto para 'Concluído'
        setPhotos(prev => prev.map(p => p.id === tempId ? { ...p, status: 'completed', progress: 100 } : p));

      } catch (error) {
          console.error('Falha no upload:', error);
          // Em caso de erro, atualiza o status para 'Erro'
          setPhotos(prev => prev.map(p => p.id === tempId ? { ...p, status: 'error' } : p));
          alert(`Erro ao enviar o arquivo ${file.name}: ${error}`);
      }
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (selectedFarmId) {
      setIsDragOver(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (checkFarmSelection()) {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleViewStatus = () => setShowHistory(true);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/login');
  };
  const handleAssociateFarm = () => setIsAssociateModalOpen(true);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const formatCpf = (cpf: string) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  const handleSearchProducer = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `http://localhost:5000/area-operador/fazendas?ccir=${formData.ccir}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (!resp.ok) {
        console.error(`Erro HTTP: ${resp.status}`);
        alert('Erro ao buscar fazenda');
        return;
      }

      const json = await resp.json();
      console.log('Resposta do backend:', json);

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
        })));
      } else {
        alert(json.message || 'Erro ao buscar fazendas');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Erro no fetch:', err);
      alert('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssociateFarmConfirm = async (farm: Farm) => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        'http://localhost:5000/area-operador/fazendas',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ farm_id: farm.id })
        }
      );
      const json = await resp.json();
      if (json.status === 'success') {
        setAssociatedFarms(prev =>
          prev.some(f => f.id === farm.id) ? prev : [...prev, farm]
        );
        setSearchResults([]);
        setFormData({ ccir: '' });
        setIsAssociateModalOpen(false);
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao associar fazenda');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle />;
      case 'warning': return <AlertTriangle />;
      case 'critical': return <XCircle />;
      case 'uploading': return <Clock />;
      case 'processing': return <AlertCircle />;
      case 'completed': return <CheckCircle />;
      case 'error': return <XCircle />;
      default: return <CheckCircle />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Saudável';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      case 'uploading': return 'Enviando';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const HistoryModal = () => (
    <Modal isOpen={showHistory}>
        <ModalContent>
            <ModalHeader>
                <h2>Histórico de Uploads</h2>
                <ModalCloseButton onClick={() => setShowHistory(false)}>
                    <X />
                </ModalCloseButton>
            </ModalHeader>
            {photos.length === 0 ? (
                <EmptyState>
                    <EmptyIcon><Calendar /></EmptyIcon>
                    <h3>Nenhum histórico encontrado</h3>
                    <p>Faça upload de algumas fotos para ver o histórico aqui</p>
                </EmptyState>
            ) : (
                <HistoryList>
                    {photos.map(photo => {
                        const statusStyle = getStatusColor(photo.status);
                        return (
                            <HistoryItem key={photo.id}>
                                <HistoryThumbnail>
                                    {photo.previewUrl ? <img src={photo.previewUrl} alt={photo.filename}/> : <HistoryThumbnailIcon><Image /></HistoryThumbnailIcon>}
                                </HistoryThumbnail>
                                <HistoryInfo>
                                  <h4>{photo.filename}</h4>
                                  <div className="details">
                                    {/* --- INÍCIO DA ADIÇÃO --- */}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <MapPin size={12} /> {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
                                    </span>
                                    {/* --- FIM DA ADIÇÃO --- */}
                                    <span>{photo.uploadDate}</span>
                                    <span>{photo.uploadTime}</span>
                                    <span>{photo.size}</span>
                                  </div>
                                </HistoryInfo>
                                <HistoryStatus bg={statusStyle.bg} color={statusStyle.color}>
                                    {getStatusIcon(photo.status)}
                                    {getStatusText(photo.status)}
                                </HistoryStatus>
                                {photo.status === 'uploading' && (
                                    <HistoryProgress>{photo.progress}%</HistoryProgress>
                                )}
                            </HistoryItem>
                        );
                    })}
                </HistoryList>
            )}
        </ModalContent>
    </Modal>
  );

 return (
    <OperadContainerContainer>
      <LogoutButton onClick={handleLogout}>
        <LogOut /> Sair
      </LogoutButton>

      <ContentContainer>
        <PageHeader>
          <h1>Painel do Operador</h1>
          <p>Faça upload de fotos das plantações e acompanhe o status do processamento em tempo real</p>
        </PageHeader>

        <ActionsContainer>
            <ActionButton variant="third" onClick={handleAssociateFarm}>
                <UserPlus /> Associar à Fazenda
            </ActionButton>
            <ActionButton variant="primary" onClick={handleFileUpload}>
                <Upload /> Upload de Fotos
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleViewStatus}>
                <Eye /> Status de Envio
            </ActionButton>
        </ActionsContainer>
        
        {/*
          --- SEÇÃO 1: SELEÇÃO DE FAZENDA POR CLIQUE NO CARD (SUBSTITUI O DROPDOWN) ---
        */}
        <div style={{marginBottom: '3rem'}}>
            <h2 style={{fontSize: '1.5rem', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                1. Selecione uma Fazenda
            </h2>
            {isLoadingFarms ? (
                <LoadingSpinner />
            ) : associatedFarms.length === 0 ? (
                <EmptyState>
                    <Leaf />
                    <h3>Nenhuma fazenda associada</h3>
                    <p>Clique em "Associar à Fazenda" para começar.</p>
                </EmptyState>
            ) : (
                <FarmsGrid>
                    {associatedFarms.map(farm => (
                        <FarmCard 
                            key={farm.id}
                            isSelected={farm.id === selectedFarmId}
                            onClick={() => handleFarmCardClick(farm.id)}
                        >
                            <h3>{farm.name} (CCIR: {farm.ccm})</h3>
                            <div className="farm-info">
                                <div className="info-item"><MapPin /><span>Lat: {farm.latitude}</span></div>
                                <div className="info-item"><MapPin /><span>Lon: {farm.longitude}</span></div>
                                <div className="info-item"><TrendingUp /><span>{farm.area} hectares</span></div>
                            </div>
                        </FarmCard>
                    ))}
                </FarmsGrid>
            )}
        </div>

        {/*
          --- SEÇÃO 2: UPLOAD DE IMAGENS (AGORA VINCULADO À SELEÇÃO ACIMA) ---
        */}
        <div style={{marginBottom: '2rem'}}>
            <h2 style={{fontSize: '1.5rem', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                2. Faça o Upload das Imagens
            </h2>
            <UploadArea
                className={!selectedFarmId ? 'disabled' : ''}
                isDragOver={isDragOver}
                onClick={handleFileUpload} // A função handleFileUpload já contém a verificação
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <UploadIcon><Camera /></UploadIcon>
                <h3>
                    {!selectedFarmId 
                      ? 'Selecione uma fazenda na lista acima para habilitar o upload' 
                      : 'Arraste fotos aqui ou clique para selecionar'}
                </h3>
                <p>Faça upload das fotos da plantação para análise com IA</p>
                <span>Formatos aceitos: JPG, PNG, JPEG (máx. 10MB)</span>
            </UploadArea>
        </div>


        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />

        {/* Seção de visualização das fotos enviadas */}
        {photos.length > 0 && (
            <div style={{marginBottom: '2rem'}}>
                <h2 style={{fontSize: '1.5rem', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                    Envios Recentes
                </h2>
                <PhotoGrid>
                    {photos.slice(0, 6).map(photo => {
                        const statusStyle = getStatusColor(photo.status);
                        return (
                            // Dentro da seção {photos.length > 0 ? (<PhotoGrid> ... </PhotoGrid>) : ...}

                          <PhotoCard key={photo.id}>
                            <PhotoPreview>
                              {photo.previewUrl ? <img src={photo.previewUrl} alt={photo.filename}/> : <PhotoIcon><FileText /></PhotoIcon>}
                            </PhotoPreview>
                            <PhotoDetails>
                              <h4>{photo.filename}</h4>
                              {/* --- INÍCIO DA ALTERAÇÃO --- */}
                              <div className="detail-row">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <MapPin size={14} /> Coordenadas:
                                </span>
                                <span>{photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}</span>
                              </div>
                              {/* --- FIM DA ALTERAÇÃO --- */}
                              <div className="detail-row"><span>Tamanho:</span><span>{photo.size}</span></div>
                              <div className="detail-row"><span>Data:</span><span>{photo.uploadDate} {photo.uploadTime}</span></div>
                            </PhotoDetails>
                            <StatusBadge bg={statusStyle.bg} color={statusStyle.color}>
                              {getStatusIcon(photo.status)}
                              {getStatusText(photo.status)}
                            </StatusBadge>
                            {photo.status === 'uploading' && (
                              <ProgressBar><ProgressFill progress={photo.progress} /></ProgressBar>
                            )}
                          </PhotoCard>
                        );
                    })}
                </PhotoGrid>
                {photos.length > 6 && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}> 
                        <ActionButton variant="secondary" onClick={handleViewStatus}>
                            Ver todas as {photos.length} fotos no histórico
                        </ActionButton>
                    </div>
                )}
            </div>
        )}
      </ContentContainer>

      {showHistory && <HistoryModal />}
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
              placeholder="00.000.000.000-0"
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
                  {farm.producerName && (
                    <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      Produtor: {farm.producerName} - CPF: {formatCpf(farm.producerCpf)}
                    </p>
                  )}
                  
                  <div className="farm-info">
                    <div className="info-item"><MapPin /><span>{farm.latitude}</span></div>
                    <div className="info-item"><MapPin /><span>{farm.longitude}</span></div>
                    <div className="info-item"><TrendingUp /><span>{farm.area} hectares</span></div>
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

    </OperadContainerContainer>
  );
}