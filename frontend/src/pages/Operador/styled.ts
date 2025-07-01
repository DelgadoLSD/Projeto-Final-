import styled from 'styled-components'

// Breakpoints para adaptar diferentes tamanhos de tela
const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  xxl: '1440px',
  xxxl: '1920px'
}

const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
  
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`,
  xlUp: `@media (min-width: ${breakpoints.xl})`
}

export const OperadContainerContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  width: 100%;
  overflow-x: hidden;
`

export const ContentContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  position: relative;
  
  ${media.xl} {
    max-width: 1200px;
    padding: 1.5rem;
  }
  
  ${media.lg} {
    padding: 1rem;
  }
  
  ${media.md} {
    padding: 1rem 0.75rem;
  }
  
  ${media.sm} {
    padding: 0.75rem 0.5rem;
  }
`

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  p {
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    color: #718096;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  ${media.lg} {
    margin-bottom: 2rem;
  }
  
  ${media.md} {
    margin-bottom: 1.5rem;
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  
  ${media.lg} {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  ${media.md} {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'third' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: clamp(1rem, 2vw, 1.1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  justify-content: center;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
          background: linear-gradient(135deg, #218838 0%, #1ba085 100%);
        }
      `;
    } else if (props.variant === 'third') { // Adicionada a variante 'third'
      return `
        background: transparent;
        color: #28a745;
        border: 2px solid #28a745;
        box-shadow: none;

        &:hover {
          transform: translateY(-2px);
          background-color: #f8fff9;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
        }
      `;
    } else { // secondary e default
      return `
        background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
          background: linear-gradient(135deg, #5a6268 0%, #3d4245 100%);
        }
      `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  ${media.md} {
    width: 100%;
    max-width: 300px;
    padding: 0.875rem 1.5rem;
  }
  
  ${media.sm} {
    min-width: auto;
    padding: 0.75rem 1.25rem;
  }
`

export const FarmsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  ${media.xl} {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  ${media.lg} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  ${media.md} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const FarmCard = styled.div<{ isSelected?: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  /* --- LÓGICA DE DESTAQUE VISUAL --- */
  border: 2px solid ${props => props.isSelected ? '#28a745' : 'transparent'};
  box-shadow: ${props => props.isSelected ? '0 8px 30px rgba(40, 167, 69, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.08)'};
  
  &:hover {
    transform: translateY(-5px);
    /* A borda no hover só aparece se o card não estiver selecionado */
    border-color: ${props => props.isSelected ? '#28a745' : '#a7d7b4'};
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    font-size: clamp(1.1rem, 2.2vw, 1.3rem);
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .farm-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: clamp(0.9rem, 1.8vw, 1rem);
    color: #718096;
    
    svg {
      width: 16px;
      height: 16px;
      color: #28a745;
    }
  }
  
  .farm-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.75rem;
    
    svg {
      width: 14px;
      height: 14px;
    }
    
    &.healthy {
      background-color: #d4edda;
      color: #155724;
      
      svg {
        color: #38a169;
      }
    }
    
    &.warning {
      background-color: #fff3cd;
      color: #856404;
      
      svg {
        color: #ed8936;
      }
    }
    
    &.critical {
      background-color: #f8d7da;
      color: #721c24;
      
      svg {
        color: #e53e3e;
      }
    }
  }
  
  ${media.md} {
    padding: 1.25rem;
  }
  
  ${media.sm} {
    padding: 1rem;
  }
`

export const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  
  h2 {
    font-size: clamp(1.5rem, 3vw, 1.8rem);
    color: #2d3748;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  ${media.md} {
    padding: 1.5rem;
    max-width: 90vw;
  }
  
  ${media.sm} {
    padding: 1rem;
    border-radius: 12px;
  }
`

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: clamp(0.9rem, 2vw, 1rem);
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }
  }

      .select-wrapper {
    position: relative;
    
    .select-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none; /* Permite clicar no select através do ícone */
      color: #718096;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
`

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  
  ${media.sm} {
    flex-direction: column-reverse;
  }
`

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  
  ${props => props.variant === 'primary' ? `
    background-color: #28a745;
    color: white;
    
    &:hover {
      background-color: #218838;
    }
  ` : `
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: #5a6268;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${media.sm} {
    width: 100%;
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
  
  p {
    font-size: clamp(0.9rem, 2vw, 1rem);
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }
`

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #28a745;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const SearchResults = styled.div`
  margin-top: 1.5rem;
  
  h3 {
    font-size: 1.1rem;
    color: #1a202c;
    margin-bottom: 1rem;
    font-weight: 600;
  }
`

export const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  ${media.md} {
    padding: 10px 14px;
    font-size: 13px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
  
  ${media.sm} {
    top: 15px;
    left: 15px;
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 8px;
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`

// Área de Upload
export const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#20c997' : '#28a745'};
  border-radius: 16px;
  padding: 3rem 2rem;
  margin: 2rem auto 0; /* Ajuste na margem */
  text-align: center;
  background: ${props => props.isDragOver ? '#f8fff9' : 'white'};
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: ${props => props.isDragOver ? 'scale(1.02)' : 'scale(1)'};
  
  h3 {
    font-size: 1.25rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #718096;
    margin-bottom: 1rem;
  }
  
  span {
    font-size: 0.875rem;
    color: #a0aec0;
  }

  /* --- CORREÇÃO APLICADA AQUI --- */
  &.disabled {
    cursor: not-allowed;
    background: #f7fafc;
    border-color: #e2e8f0;
    
    h3, p, span, svg {
      color: #a0aec0;
    }
    
    &:hover {
      transform: scale(1);
      cursor: not-allowed;
    }
  }
`;

export const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  color: #28a745;
  margin: 0 auto 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  opacity: 0.5;
`;

// Grid e Cards de Fotos
export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const PhotoCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  }
  
  h4 {
    font-size: 1rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-weight: 600;
    word-break: break-word;
  }
`;

export const PhotoPreview = styled.div`
  width: 100%;
  height: 150px;
  background: #f7fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PhotoIcon = styled.div`
  width: 32px;
  height: 32px;
  color: #a0aec0;
`;

export const PhotoDetails = styled.div`
  margin-bottom: 1rem;
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// Status e Progresso
export const StatusBadge = styled.div<{ bg: string; color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  background-color: ${props => props.bg};
  color: ${props => props.color};
`;

export const ProgressContainer = styled.div`
  margin-bottom: 1rem;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

// Histórico
export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 12px;
  gap: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #edf2f7;
  }
`;

export const HistoryThumbnail = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HistoryThumbnailIcon = styled.div`
  width: 24px;
  height: 24px;
  color: #a0aec0;
`;

export const HistoryInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.25rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .details {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #718096;
  }
`;

export const HistoryStatus = styled.div<{ bg: string; color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => props.bg};
  color: ${props => props.color};
  flex-shrink: 0;
`;

export const HistoryProgress = styled.div`
  width: 60px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #718096;
`;

// Formulários
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FarmInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
`;

// Seleção de Farm
export const SelectedFarmContainer = styled.div`
  text-align: center;
  background-color: #e6ffe6;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #28a745;
  
  p {
    font-size: 1rem;
    color: #155724;
    margin-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #28a745;
    margin: 0;
  }
`;


// Loading
export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
`;

// Função auxiliar para cores de status
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'uploading':
      return { bg: '#fff3cd', color: '#856404' };
    case 'processing':
      return { bg: '#cce7ff', color: '#0056b3' };
    case 'completed':
      return { bg: '#d4edda', color: '#155724' };
    case 'error':
      return { bg: '#f8d7da', color: '#721c24' };
    default:
      return { bg: '#e2e8f0', color: '#4a5568' };
  }
};