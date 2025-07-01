import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import type { CSSProperties } from 'react';
import {
  Upload,
  Camera,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  FileText,
  X,
  Calendar,
  Image,
  UserPlus,
  Map,
  MapPin,
  TrendingUp,
  Leaf,
  Search,
  Globe,
  LogOut
} from 'lucide-react';
import { styles, getStatusColor, hoverEffects } from './styled';

// Definição do tipo PhotoUpload
type PhotoUpload = {
  id: string;
  filename: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  uploadDate: string;
  uploadTime: string;
  size: string;
  previewUrl: string;
  progress: number;
  farmId: string;
  diagnosis?: 'normal' | 'anômala' | null;
  latitude?: number;
  longitude?: number;
};

// Interface para Fazenda
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
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [associatedFarms, setAssociatedFarms] = useState<Farm[]>([]);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [isSelectFarmModalOpen, setIsSelectFarmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Farm[]>([]);
  const [formData, setFormData] = useState({
    ccir: '',
  });
  const [selectedFarmForUpload, setSelectedFarmForUpload] = useState<Farm | null>(null);

  // Estados para o modal de upload de foto (agora para múltiplos arquivos)
  const [isNewPhotoUploadModalOpen, setIsNewPhotoUploadModalOpen] = useState(false);
  const [currentPhotoFiles, setCurrentPhotoFiles] = useState<File[]>([]); // MUDANÇA: Agora é um array de Files
  const photoUploadFileInputRef = useRef<HTMLInputElement>(null);

  // Simulação de fazendas disponíveis no sistema
  const mockFarms: Farm[] = [
    {
      id: '1',
      name: 'Fazenda Campo Belo',
      ccm: '12345678',
      latitude: '-20.7596',
      longitude: '-42.8736',
      area: 45.5,
      status: 'healthy',
      lastInspection: '2024-06-15',
      producerName: 'José Alencar',
      producerCpf: '123.456.789-01'
    },
    {
      id: '2',
      name: 'Sítio Recanto Feliz',
      ccm: '87654321',
      latitude: '-20.7850',
      longitude: '-42.9012',
      area: 32.8,
      status: 'warning',
      lastInspection: '2024-06-10',
      producerName: 'Ana Paula',
      producerCpf: '987.654.321-02'
    },
    {
      id: '3',
      name: 'Chácara do Sol',
      ccm: '11223344',
      latitude: '-20.7420',
      longitude: '-42.8956',
      area: 78.2,
      status: 'critical',
      lastInspection: '2024-06-05',
      producerName: 'Pedro Costa',
      producerCpf: '456.789.123-03'
    }
  ];

  useEffect(() => {
    setAssociatedFarms(mockFarms.slice(0, 1));
  }, []);


  const handleAssociateFarm = () => {
    setIsAssociateModalOpen(true);
  };

  const handleSelectFarmForUpload = () => {
    if (associatedFarms.length === 0) {
      alert('Você precisa associar uma fazenda primeiro para realizar uploads.');
      return;
    }
    setIsSelectFarmModalOpen(true);
  };

  const handleFileUpload = () => {
    if (!selectedFarmForUpload) {
      alert('Por favor, selecione uma fazenda antes de fazer o upload de fotos.');
      handleSelectFarmForUpload();
      return;
    }
    setIsNewPhotoUploadModalOpen(true);
  };

  const handleViewStatus = () => {
    setShowHistory(true);
  };

  const extractCoordinatesFromName = (filename: string): { lat: number | undefined; long: number | undefined } => {
    const regex = /(-?\d+\.?\d*)_(-?\d+\.?\d*)\.[^.]+$/; // Regex para latitude_longitude.extensao
    const match = filename.match(regex);

    if (match && match[1] && match[2]) {
      const lat = parseFloat(match[1]);
      const long = parseFloat(match[2]);

      if (!isNaN(lat) && !isNaN(long)) {
        if (lat >= -90 && lat <= 90 && long >= -180 && long <= 180) {
          return { lat, long };
        }
      }
    }
    return { lat: undefined, long: undefined };
  };

  const handleLogout = () => {
    // lógica de logout (limpar tokens, etc.)
    // localStorage.removeItem('authToken')
    // sessionStorage.clear()
    
    // Redirecionar para a tela de login
    navigate('/login')
  };

  // Função agora processa um array de arquivos
  const processFiles = (files: File[]) => { // MUDANÇA: Recebe File[]
    if (!selectedFarmForUpload) {
      alert('Erro: Nenhuma fazenda selecionada para upload.');
      return;
    }

    files.forEach(file => { // Itera sobre cada arquivo
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} não é um arquivo de imagem válido.`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} é muito grande. Tamanho máximo: 10MB`);
        return;
      }

      const { lat, long } = extractCoordinatesFromName(file.name);

      if (lat === undefined || long === undefined) {
        alert(`Nome do arquivo inválido para extração de coordenadas: "${file.name}". Use o formato "latitude_longitude.ext" (ex: -23.5505_-46.6333.png).`);
        return;
      }

      const now = new Date();
      const newPhoto: PhotoUpload = {
        id: Date.now().toString() + Math.random(),
        filename: file.name,
        status: 'uploading',
        uploadDate: now.toISOString().split('T')[0],
        uploadTime: now.toLocaleTimeString('pt-BR'),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        farmId: selectedFarmForUpload.id,
        latitude: lat,
        longitude: long,
        diagnosis: null,
      };

      setPhotos(prev => [newPhoto, ...prev]);

      // Simulação de progresso e processamento para cada foto
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setPhotos(prev => prev.map(p =>
            p.id === newPhoto.id ? { ...p, status: 'processing', progress: 100 } : p
          ));

          setTimeout(() => {
            const randomDiagnosis = Math.random() < 0.8 ? 'normal' : 'anômala';
            setPhotos(prev => prev.map(p =>
              p.id === newPhoto.id ? { ...p, status: 'completed', diagnosis: randomDiagnosis } : p
            ));
            URL.revokeObjectURL(newPhoto.previewUrl);
          }, 2000 + Math.random() * 3000);
        } else {
          setPhotos(prev => prev.map(p =>
            p.id === newPhoto.id ? { ...p, progress: Math.round(progress) } : p
          ));
        }
      }, 300);
    });
  };

  // Lidar com a seleção de múltiplos arquivos no modal
  const handleFileSelectInModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setCurrentPhotoFiles(Array.from(files)); // MUDANÇA: Converte FileList para Array
    } else {
      setCurrentPhotoFiles([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setCurrentPhotoFiles(Array.from(files)); // MUDANÇA: Pega múltiplos arquivos no drop
      handleFileUpload(); // Abre o modal
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock />;
      case 'processing':
        return <AlertCircle />;
      case 'completed':
        return <CheckCircle />;
      case 'error':
        return <AlertCircle />;
      default:
        return <Clock />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Enviando';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'error':
        return 'Erro';
      default:
        return 'Aguardando';
    }
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const viewPhoto = (photo: PhotoUpload) => {
    if (photo.previewUrl) {
      window.open(photo.previewUrl, '_blank');
    }
  };

  // --- Funções para Associar Fazenda ---
  const handleSearchFarm = async () => {
    setIsLoading(true);
    setSearchResults([]);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const foundFarms = mockFarms.filter(farm => farm.ccm.includes(formData.ccir));

      if (foundFarms.length > 0) {
        setSearchResults(foundFarms.map(f => ({
          id: f.id.toString(),
          name: f.name,
          ccm: f.ccm,
          latitude: f.latitude.toString(),
          longitude: f.longitude.toString(),
          area: parseFloat(f.area.toString()),
          status: 'healthy',
          lastInspection: new Date().toISOString().split('T')[0],
          producerName: f.producerName,
          producerCpf: f.producerCpf
        })));
      } else {
        alert('Nenhuma fazenda encontrada com o CCIR informado.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar fazenda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssociateFarmConfirm = async (farm: Farm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const success = true;

      if (success) {
        setAssociatedFarms(prev =>
          prev.some(f => f.id === farm.id) ? prev : [...prev, farm]
        );
        alert(`Fazenda ${farm.name} associada com sucesso!`);
        setSearchResults([]);
        setFormData({ ccir: '' });
        setIsAssociateModalOpen(false);
      } else {
        alert('Erro ao associar fazenda.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao associar fazenda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para submeter o upload das fotos
  const handleNewPhotoUploadSubmit = () => {
    if (!selectedFarmForUpload) {
      alert('Erro: Nenhuma fazenda selecionada para upload.');
      return;
    }
    if (currentPhotoFiles.length === 0) {
      alert('Por favor, selecione uma ou mais imagens para upload.');
      return;
    }

    processFiles(currentPhotoFiles); // MUDANÇA: Chama processFiles com o array de arquivos
    setIsNewPhotoUploadModalOpen(false);
    setCurrentPhotoFiles([]); // Limpa os arquivos selecionados
    if (photoUploadFileInputRef.current) {
      photoUploadFileInputRef.current.value = '';
    }
  };


  // --- Componentes de Modal ---

  const HistoryModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            Histórico de Uploads
          </h2>
          <button
            onClick={() => setShowHistory(false)}
            style={styles.modalCloseButton}
          >
            <X style={{ width: '24px', height: '24px', color: '#718096' }} />
          </button>
        </div>

        {photos.length === 0 ? (
          <div style={styles.modalEmptyState}>
            <Calendar style={styles.modalEmptyIcon} />
            <h3 style={styles.modalEmptyTitle}>
              Nenhum histórico encontrado
            </h3>
            <p>Faça upload de algumas fotos para ver o histórico aqui</p>
          </div>
        ) : (
          <div style={styles.modalList}>
            {photos.map(photo => {
              const statusStyle = getStatusColor(photo.status);
              const associatedFarm = associatedFarms.find(f => f.id === photo.farmId);
              return (
                <div key={photo.id} style={styles.historyItem}>
                  <div style={styles.historyThumbnail}>
                    {photo.previewUrl ? (
                      <img
                        src={photo.previewUrl}
                        alt={photo.filename}
                        style={styles.historyThumbnailImage}
                      />
                    ) : (
                      <Image style={styles.historyThumbnailIcon} />
                    )}
                  </div>

                  <div style={styles.historyInfo}>
                    <h4 style={styles.historyTitle}>
                      {photo.filename}
                    </h4>
                    {associatedFarm && (
                      <p style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        Fazenda: {associatedFarm.name}
                      </p>
                    )}
                    {photo.latitude !== undefined && photo.longitude !== undefined && (
                      <p style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        Lat: {photo.latitude.toFixed(4)}, Long: {photo.longitude.toFixed(4)}
                      </p>
                    )}
                    <div style={styles.historyDetails}>
                      <span>{photo.uploadDate}</span>
                      <span>{photo.uploadTime}</span>
                      <span>{photo.size}</span>
                    </div>
                  </div>

                  <div style={styles.historyStatus(statusStyle.bg, statusStyle.color)}>
                    {getStatusIcon(photo.status)}
                    {getStatusText(photo.status)}
                  </div>

                  {photo.status === 'uploading' && (
                    <div style={styles.historyProgress}>
                      {photo.progress}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const AssociateFarmModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Associar à Fazenda</h2>
          <button
            onClick={() => {
              setIsAssociateModalOpen(false);
              setSearchResults([]);
              setFormData({ ccir: '' });
            }}
            style={styles.modalCloseButton}
          >
            <X style={{ width: '24px', height: '24px', color: '#718096' }} />
          </button>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
          Digite o CCIR da fazenda para encontrá-la e associar.
        </p>

        <div style={styles.formGroup}>
          <label htmlFor="ccir" style={styles.formLabel}>CCIR da Fazenda *</label>
          <input
            id="ccir"
            name="ccir"
            type="text"
            value={formData.ccir}
            onChange={handleInputChange}
            placeholder="Ex: 12345678"
            required
            style={styles.formInput}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={handleSearchFarm}
            style={styles.primaryButton}
            disabled={isLoading || !formData.ccir}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.primaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.primaryButtonLeave)}
          >
            <Search style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
            {isLoading ? 'Buscando...' : 'Buscar Fazendas'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div style={styles.searchResults}>
            <h3 style={styles.searchResultsTitle}>Fazendas encontradas:</h3>
            {searchResults.map(farm => (
              <div
                key={farm.id}
                onClick={() => handleAssociateFarmConfirm(farm)}
                style={{ ...styles.farmCard, marginBottom: '1rem', cursor: 'pointer' }}
              >
                <h3>{farm.name}</h3>
                <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  Produtor: {farm.producerName} - CPF: {formatCpf(farm.producerCpf)}
                </p>

                <div style={styles.farmInfo}>
                  <div style={styles.infoItem}>
                    <MapPin />
                    <span>Lat: {farm.latitude}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <MapPin />
                    <span>Long: {farm.longitude}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <TrendingUp />
                    <span>{farm.area} hectares</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && formData.ccir && !isLoading && (
          <div style={styles.modalEmptyState}>
            <Search style={styles.modalEmptyIcon} />
            <h3 style={styles.modalEmptyTitle}>Nenhuma fazenda encontrada</h3>
            <p>Não foram encontradas fazendas para este CCIR</p>
          </div>
        )}

        <div style={styles.modalActions}>
          <button
            type="button"
            onClick={() => {
              setIsAssociateModalOpen(false);
              setSearchResults([]);
              setFormData({ ccir: '' });
            }}
            style={styles.secondaryButton}
            disabled={isLoading}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonLeave)}
          >
            Cancelar
          </button>
        </div>

        {isLoading && (
          <div style={styles.loadingSpinner}>
            <div style={styles.spinner} />
          </div>
        )}
      </div>
    </div>
  );

  const SelectFarmForUploadModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Selecionar Fazenda para Upload</h2>
          <button
            onClick={() => setIsSelectFarmModalOpen(false)}
            style={styles.modalCloseButton}
          >
            <X style={{ width: '24px', height: '24px', color: '#718096' }} />
          </button>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
          Escolha uma fazenda para onde as imagens serão enviadas
        </p>

        {associatedFarms.length === 0 ? (
          <div style={styles.modalEmptyState}>
            <Leaf style={styles.modalEmptyIcon} />
            <h3 style={styles.modalEmptyTitle}>Nenhuma fazenda associada</h3>
            <p>Associe-se a uma fazenda primeiro para poder realizar uploads</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {associatedFarms.map(farm => (
              <div
                key={farm.id}
                onClick={() => {
                  setSelectedFarmForUpload(farm);
                  setIsSelectFarmModalOpen(false);
                  alert(`Fazenda selecionada para upload: ${farm.name}`);
                }}
                style={{
                  ...styles.farmCard,
                  margin: 0,
                  cursor: 'pointer',
                  border: selectedFarmForUpload?.id === farm.id ? '2px solid #28a745' : '1px solid #e2e8f0'
                }}
              >
                <h3>{farm.name}</h3>
                <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  Produtor: {farm.producerName}
                </p>

                <div style={styles.farmInfo}>
                  <div style={styles.infoItem}>
                    <MapPin />
                    <span>Lat: {farm.latitude}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <MapPin />
                    <span>Long: {farm.longitude}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <TrendingUp />
                    <span>{farm.area} hectares</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.modalActions}>
          <button
            type="button"
            onClick={() => setIsSelectFarmModalOpen(false)}
            style={styles.secondaryButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonLeave)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  const NewPhotoUploadModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Upload de Nova(s) Foto(s)</h2> {/* MUDANÇA: Título ajustado */}
          <button
            onClick={() => {
              setIsNewPhotoUploadModalOpen(false);
              setCurrentPhotoFiles([]); // MUDANÇA: Limpa array de files
              if (photoUploadFileInputRef.current) {
                photoUploadFileInputRef.current.value = '';
              }
            }}
            style={styles.modalCloseButton}
          >
            <X style={{ width: '24px', height: '24px', color: '#718096' }} />
          </button>
        </div>

        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#718096' }}>
          Selecione uma ou mais fotos. As coordenadas serão extraídas do nome de cada arquivo (formato: `latitude_longitude.ext`).
        </p>

        <div style={styles.formGroup}>
          <label htmlFor="photoFile" style={styles.formLabel}>Selecionar Imagem(ns) *</label> {/* MUDANÇA: Label ajustado */}
          <input
            id="photoFile"
            type="file"
            accept="image/*"
            multiple // MUDANÇA: Permite múltiplos arquivos
            onChange={handleFileSelectInModal}
            ref={photoUploadFileInputRef}
            style={styles.formInput}
          />
          {currentPhotoFiles.length > 0 && ( // MUDANÇA: Exibe contagem de arquivos
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#4a5568' }}>
              Arquivo(s) selecionado(s): <strong>{currentPhotoFiles.length}</strong>
              {currentPhotoFiles.length > 0 && (
                <ul style={{ listStyle: 'none', marginTop: '0.5rem', maxHeight: '100px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
                  {currentPhotoFiles.map((file, index) => (
                    <li key={index} style={{ fontSize: '0.8rem', color: '#718096' }}>{file.name}</li>
                  ))}
                </ul>
              )}
            </p>
          )}
        </div>

        <div style={styles.modalActions}>
          <button
            type="button"
            onClick={() => {
              setIsNewPhotoUploadModalOpen(false);
              setCurrentPhotoFiles([]); // MUDANÇA: Limpa array de files
              if (photoUploadFileInputRef.current) {
                photoUploadFileInputRef.current.value = '';
              }
            }}
            style={styles.secondaryButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonLeave)}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleNewPhotoUploadSubmit}
            style={styles.primaryButton}
            disabled={currentPhotoFiles.length === 0} // MUDANÇA: Desabilita se nenhum arquivo for selecionado
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.primaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.primaryButtonLeave)}
          >
            <Upload style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
            Fazer Upload
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div style={styles.container}>
      {/* Botão de Logout posicionado de forma absoluta */}
      <button 
        onClick={handleLogout}
        style={styles.logoutButton}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, hoverEffects.logoutButtonHover)
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, hoverEffects.logoutButtonLeave)
        }}
      >
        <LogOut style={{ width: '16px', height: '16px' }} />
        Sair
      </button>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Painel do Operador
          </h1>
          <p style={styles.subtitle}>
            Faça upload de fotos das plantações e acompanhe o status do processamento em tempo real
          </p>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleAssociateFarm}
            style={styles.primaryButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.primaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.primaryButtonLeave)}
          >
            <UserPlus style={{ width: '20px', height: '20px' }} />
            Associar à Fazenda
          </button>

          <button
            onClick={handleSelectFarmForUpload}
            style={styles.secondaryButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonLeave)}
          >
            <Map style={{ width: '20px', height: '20px' }} />
            Selecionar Fazenda para Upload
          </button>

          <button
            onClick={handleFileUpload}
            style={{
              ...styles.primaryButton,
              backgroundColor: selectedFarmForUpload ? (styles.primaryButton as CSSProperties).backgroundColor : '#cccccc',
              cursor: selectedFarmForUpload ? 'pointer' : 'not-allowed'
            }}
            onMouseEnter={(e) => {
              if (selectedFarmForUpload) {
                Object.assign(e.currentTarget.style, hoverEffects.primaryButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (selectedFarmForUpload) {
                Object.assign(e.currentTarget.style, hoverEffects.primaryButtonLeave);
              }
            }}
            disabled={!selectedFarmForUpload}
          >
            <Upload style={{ width: '20px', height: '20px' }} />
            Upload de Fotos
          </button>

          <button
            onClick={handleViewStatus}
            style={styles.secondaryButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonLeave)}
          >
            <Eye style={{ width: '20px', height: '20px' }} />
            Status de Envio
          </button>
        </div>

        {selectedFarmForUpload && (
          <div style={styles.selectedFarmInfo}>
            <h3 style={styles.selectedFarmTitle}>Fazenda selecionada para upload:</h3>
            <p style={styles.selectedFarmName}>{selectedFarmForUpload.name}</p>
          </div>
        )}

        {/* Área de Upload */}
        <div
          style={styles.uploadArea(isDragOver)}
          onClick={handleFileUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Camera style={styles.uploadIcon} />
          <h3 style={styles.uploadTitle}>
            Arraste fotos aqui ou clique para selecionar
          </h3>
          <p style={styles.uploadSubtitle}>
            Faça upload das fotos da plantação para análise com IA
          </p>
          <div style={styles.uploadInfo}>
            Formatos aceitos: JPG, PNG, JPEG (máx. 10MB)
          </div>
        </div>

        {/* Este input file original não é mais o ponto principal de upload. */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          style={styles.hiddenInput}
          disabled={true}
        />

        {photos.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>
              Nenhuma foto enviada
            </h3>
            <p style={styles.emptySubtitle}>
              Comece fazendo upload das fotos da sua plantação para análise automatizada
            </p>
          </div>
        ) : (
          <div style={styles.photoGrid}>
            {photos.slice(0, 6).map(photo => {
              const statusStyle = getStatusColor(photo.status);
              const farmName = associatedFarms.find(f => f.id === photo.farmId)?.name || 'Desconhecida';
              return (
                <div key={photo.id} style={styles.photoCard}>
                  <div style={styles.photoPreview}>
                    {photo.previewUrl ? (
                      <img
                        src={photo.previewUrl}
                        alt={photo.filename}
                        style={styles.photoImage}
                      />
                    ) : (
                      <FileText style={styles.photoIcon} />
                    )}
                  </div>

                  <div style={styles.photoInfo}>
                    <h4 style={styles.photoTitle}>
                      {photo.filename}
                    </h4>
                    <div style={styles.photoDetail}>
                      <span>Fazenda:</span>
                      <span>{farmName}</span>
                    </div>
                    {photo.latitude !== undefined && photo.longitude !== undefined && (
                      <>
                        <div style={styles.photoDetail}>
                          <span><Globe style={{ width: '14px', height: '14px', marginRight: '4px' }} />Latitude:</span>
                          <span>{photo.latitude.toFixed(4)}</span>
                        </div>
                        <div style={styles.photoDetail}>
                          <span><Globe style={{ width: '14px', height: '14px', marginRight: '4px' }} />Longitude:</span>
                          <span>{photo.longitude.toFixed(4)}</span>
                        </div>
                      </>
                    )}
                    <div style={styles.photoDetailLast}>
                      <span>Data:</span>
                      <span>{photo.uploadDate} {photo.uploadTime}</span>
                    </div>
                  </div>

                  <div style={styles.statusBadge(statusStyle.bg, statusStyle.color)}>
                    {getStatusIcon(photo.status)}
                    {getStatusText(photo.status)}
                  </div>

                  {photo.status === 'uploading' && (
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(photo.progress)} />
                    </div>
                  )}

                  {photo.status === 'completed' && photo.diagnosis && (
                    <div style={styles.diagnosisBadge(photo.diagnosis === 'normal' ? '#d4edda' : '#f8d7da', photo.diagnosis === 'normal' ? '#155724' : '#721c24')}>
                      {photo.diagnosis === 'normal' ? 'Normal' : 'Anômala'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {photos.length > 6 && (
          <div style={styles.viewMoreContainer}>
            <button
              onClick={() => setShowHistory(true)}
              style={styles.viewMoreButton}
            >
              Ver todas as {photos.length} fotos no histórico
            </button>
          </div>
        )}
      </div>

      {showHistory && <HistoryModal />}
      {isAssociateModalOpen && <AssociateFarmModal />}
      {isSelectFarmModalOpen && <SelectFarmForUploadModal />}
      {isNewPhotoUploadModalOpen && <NewPhotoUploadModal />}
    </div>
  );
}