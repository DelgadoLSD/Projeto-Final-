import type { CSSProperties } from 'react'

export const styles = {
  // Container principal
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    width: '100%',
    overflowX: 'hidden'
  } as CSSProperties,

    diagnosisBadge: (bg: string, color: string) => ({
    display: 'inline-block',
    padding: '0.3rem 0.6rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    backgroundColor: bg,
    color: color,
    marginTop: '0.5rem'
  }) as CSSProperties,

  // Wrapper de conteúdo
  contentWrapper: {
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem',
    flex: 1
  } as CSSProperties,

  // Botão de logout
  logoutButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
    transition: 'all 0.3s ease',
    zIndex: 1000
  } as CSSProperties,

  // Cabeçalho
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  } as CSSProperties,

  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    color: '#2d3748',
    marginBottom: '0.5rem',
    fontWeight: 700
  } as CSSProperties,

  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: '#718096',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6
  } as CSSProperties,

  // Botões principais
  buttonContainer: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap'
  } as CSSProperties,

  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  } as CSSProperties,

  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)'
  } as CSSProperties,

  // Área de upload
  uploadArea: (isDragOver: boolean) => ({
    border: `2px dashed ${isDragOver ? '#20c997' : '#28a745'}`,
    borderRadius: '16px',
    padding: '3rem 2rem',
    textAlign: 'center',
    background: isDragOver ? '#f8fff9' : 'white',
    marginBottom: '2rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    transform: isDragOver ? 'scale(1.02)' : 'scale(1)'
  }) as CSSProperties,

  uploadIcon: {
    width: '48px',
    height: '48px',
    color: '#28a745',
    margin: '0 auto 1rem'
  } as CSSProperties,

  uploadTitle: {
    fontSize: '1.25rem',
    color: '#2d3748',
    marginBottom: '0.5rem'
  } as CSSProperties,

  uploadSubtitle: {
    color: '#718096',
    marginBottom: '1rem'
  } as CSSProperties,

  uploadInfo: {
    fontSize: '0.875rem',
    color: '#a0aec0'
  } as CSSProperties,

  // Input de arquivo
  hiddenInput: {
    display: 'none'
  } as CSSProperties,

  // Estado vazio
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#718096'
  } as CSSProperties,

  emptyIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 1rem',
    opacity: 0.5
  } as CSSProperties,

  emptyTitle: {
    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
    marginBottom: '0.5rem',
    color: '#4a5568'
  } as CSSProperties,

  emptySubtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    maxWidth: '400px',
    margin: '0 auto',
    lineHeight: 1.6
  } as CSSProperties,

  // Grid de fotos
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  } as CSSProperties,

  // Card de foto
  photoCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease'
  } as CSSProperties,

  photoPreview: {
    width: '100%',
    height: '150px',
    background: '#f7fafc',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    overflow: 'hidden'
  } as CSSProperties,

  photoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  } as CSSProperties,

  photoIcon: {
    width: '32px',
    height: '32px',
    color: '#a0aec0'
  } as CSSProperties,

  photoInfo: {
    marginBottom: '1rem'
  } as CSSProperties,

  photoTitle: {
    fontSize: '1rem',
    color: '#2d3748',
    marginBottom: '0.5rem',
    fontWeight: 600,
    wordBreak: 'break-word'
  } as CSSProperties,

  photoDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#718096',
    marginBottom: '0.25rem'
  } as CSSProperties,

  photoDetailLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#718096'
  } as CSSProperties,

  // Status
  statusBadge: (bg: string, color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '1rem',
    backgroundColor: bg,
    color: color
  }) as CSSProperties,

  // Barra de progresso
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '1rem'
  } as CSSProperties,

  progressFill: (progress: number) => ({
    height: '100%',
    background: 'linear-gradient(90deg, #28a745, #20c997)',
    width: `${progress}%`,
    transition: 'width 0.3s ease'
  }) as CSSProperties,

  // Botões do card
  cardButtons: {
    display: 'flex',
    gap: '0.5rem'
  } as CSSProperties,

  viewButton: {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    backgroundColor: '#e2e8f0',
    color: '#4a5568'
  } as CSSProperties,

  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    backgroundColor: '#fed7d7',
    color: '#c53030'
  } as CSSProperties,

  // Botão "Ver mais"
  viewMoreContainer: {
    textAlign: 'center',
    marginTop: '2rem'
  } as CSSProperties,

  viewMoreButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  } as CSSProperties,

  // Modal de histórico
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  } as CSSProperties,

  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative'
  } as CSSProperties,

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  } as CSSProperties,

  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: 0
  } as CSSProperties,

  modalCloseButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as CSSProperties,

  modalEmptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#718096'
  } as CSSProperties,

  modalEmptyIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 1rem',
    opacity: 0.5
  } as CSSProperties,

  modalEmptyTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: '#4a5568'
  } as CSSProperties,

  modalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  } as CSSProperties,

  // Item do histórico
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f7fafc',
    borderRadius: '12px',
    gap: '1rem'
  } as CSSProperties,

  historyThumbnail: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0
  } as CSSProperties,

  historyThumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  } as CSSProperties,

  historyThumbnailIcon: {
    width: '24px',
    height: '24px',
    color: '#a0aec0'
  } as CSSProperties,

  historyInfo: {
    flex: 1,
    minWidth: 0
  } as CSSProperties,

  historyTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0,
    marginBottom: '0.25rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  } as CSSProperties,

  historyDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#718096'
  } as CSSProperties,

  historyStatus: (bg: string, color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '16px',
    fontSize: '0.875rem',
    fontWeight: '500',
    backgroundColor: bg,
    color: color,
    flexShrink: 0
  }) as CSSProperties,

  historyProgress: {
    width: '60px',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#718096'
  } as CSSProperties,

  // NOVOS ESTILOS
  farmCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'all 0.2s ease-in-out',
    // Não é possível usar '&:hover' diretamente em objetos CSSProperties.
    // Para hover, você precisará aplicar em um evento mouseEnter/mouseLeave ou usar styled-components.
    // O estilo de border condicional no onClick no componente já ajuda.
  } as CSSProperties,

  farmInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.75rem',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  } as CSSProperties,

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#4a5568',
  } as CSSProperties,

  formGroup: {
    marginBottom: '1.5rem',
  } as CSSProperties,

  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '0.9rem',
  } as CSSProperties,

  formInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#2d3748',
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s ease',
    // Não é possível usar '&:focus' diretamente em objetos CSSProperties.
    // Para focus, você precisará aplicar em um evento onFocus/onBlur no componente ou usar styled-components.
  } as CSSProperties,

  searchResults: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  } as CSSProperties,

  searchResultsTitle: {
    fontSize: '1.2rem',
    color: '#2d3748',
    marginBottom: '1rem',
    fontWeight: '600',
    textAlign: 'center',
  } as CSSProperties,

  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    gap: '1rem',
  } as CSSProperties,

  loadingSpinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
  } as CSSProperties,

  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  } as CSSProperties,

  // Novo estilo para exibir a fazenda selecionada
  selectedFarmInfo: {
    textAlign: 'center',
    backgroundColor: '#e6ffe6', // Um verde claro para indicar seleção
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid #28a745',
  } as CSSProperties,

  selectedFarmTitle: {
    fontSize: '1rem',
    color: '#155724',
    marginBottom: '0.5rem',
  } as CSSProperties,

  selectedFarmName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#28a745',
  } as CSSProperties,
}

// Funções auxiliares para estilos dinâmicos
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'uploading':
      return { bg: '#fff3cd', color: '#856404' }
    case 'processing':
      return { bg: '#cce7ff', color: '#0056b3' }
    case 'completed':
      return { bg: '#d4edda', color: '#155724' }
    case 'error':
      return { bg: '#f8d7da', color: '#721c24' }
    default:
      return { bg: '#e2e8f0', color: '#4a5568' }
  }
}

// Efeitos de hover
export const hoverEffects = {
  primaryButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(40, 167, 69, 0.4)'
  },
  primaryButtonLeave: {
    transform: 'translateY(0)',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  },
  secondaryButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(108, 117, 125, 0.4)'
  },
  secondaryButtonLeave: {
    transform: 'translateY(0)',
    boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)'
  },
  viewButtonHover: {
    backgroundColor: '#cbd5e0'
  },
  viewButtonLeave: {
    backgroundColor: '#e2e8f0'
  },
  deleteButtonHover: {
    backgroundColor: '#fbb6ce'
  },
  deleteButtonLeave: {
    backgroundColor: '#fed7d7'
  },
  logoutButtonHover: {
    background: 'linear-gradient(135deg, #c82333 0%, #a71e2a 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(220, 53, 69, 0.4)'
  },
  logoutButtonLeave: {
    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
    transform: 'translateY(0)',
    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
  }
}