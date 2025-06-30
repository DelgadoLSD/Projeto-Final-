import React, { useState, useRef } from 'react'
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
  Image
} from 'lucide-react'
import { styles, getStatusColor, hoverEffects } from './styled'

// Definição do tipo PhotoUpload
type PhotoUpload = {
  id: string
  filename: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  uploadDate: string
  uploadTime: string
  size: string
  previewUrl: string
  progress: number
}

export default function Operator() {
  const [photos, setPhotos] = useState<PhotoUpload[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleViewStatus = () => {
    setShowHistory(true)
  }

  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} não é um arquivo de imagem válido.`)
        return
      }
      
      // Verificar tamanho (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} é muito grande. Tamanho máximo: 10MB`)
        return
      }

      const now = new Date()
      const newPhoto: PhotoUpload = {
        id: Date.now().toString() + Math.random(),
        filename: file.name,
        status: 'uploading',
        uploadDate: now.toISOString().split('T')[0],
        uploadTime: now.toLocaleTimeString('pt-BR'),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        previewUrl: URL.createObjectURL(file),
        progress: 0
      }
      
      setPhotos(prev => [newPhoto, ...prev])
      
      // Simular progresso de upload
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setPhotos(prev => prev.map(p => 
            p.id === newPhoto.id ? { ...p, status: 'processing', progress: 100 } : p
          ))
          
          // Simular processamento
          setTimeout(() => {
            setPhotos(prev => prev.map(p => 
              p.id === newPhoto.id ? { ...p, status: 'completed' } : p
            ))
          }, 2000 + Math.random() * 3000)
        } else {
          setPhotos(prev => prev.map(p => 
            p.id === newPhoto.id ? { ...p, progress: Math.round(progress) } : p
          ))
        }
      }, 300)
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Limpar o input para permitir o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock />
      case 'processing':
        return <AlertCircle />
      case 'completed':
        return <CheckCircle />
      case 'error':
        return <AlertCircle />
      default:
        return <Clock />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Enviando'
      case 'processing':
        return 'Processando'
      case 'completed':
        return 'Concluído'
      case 'error':
        return 'Erro'
      default:
        return 'Aguardando'
    }
  }

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id))
  }

  const viewPhoto = (photo: PhotoUpload) => {
    if (photo.previewUrl) {
      window.open(photo.previewUrl, '_blank')
    }
  }

  // Modal de Histórico
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
              const statusStyle = getStatusColor(photo.status)
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
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
            onClick={handleFileUpload}
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, hoverEffects.primaryButtonHover)
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, hoverEffects.primaryButtonLeave)
            }}
          >
            <Upload style={{ width: '20px', height: '20px' }} />
            Upload de Fotos
          </button>
          
          <button 
            onClick={handleViewStatus}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonHover)
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, hoverEffects.secondaryButtonLeave)
            }}
          >
            <Eye style={{ width: '20px', height: '20px' }} />
            Status de Envio
          </button>
        </div>

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

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={styles.hiddenInput}
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
            {photos.slice(0, 6).map(photo => { // Mostrar apenas os 6 mais recentes
              const statusStyle = getStatusColor(photo.status)
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
                      <span>Tamanho:</span>
                      <span>{photo.size}</span>
                    </div>
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
                  
                  <div style={styles.cardButtons}>
                    <button
                      onClick={() => viewPhoto(photo)}
                      style={styles.viewButton}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, hoverEffects.viewButtonHover)
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, hoverEffects.viewButtonLeave)
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      Ver
                    </button>
                    
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      style={styles.deleteButton}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, hoverEffects.deleteButtonHover)
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, hoverEffects.deleteButtonLeave)
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                      Excluir
                    </button>
                  </div>
                </div>
              )
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
    </div>
  )
}