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

export const ProducerContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  width: 100%;
  overflow-x: hidden;
`

export const ContentContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  
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

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
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
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
      background: linear-gradient(135deg, #218838 0%, #1ba085 100%);
    }
  ` : `
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
      background: linear-gradient(135deg, #5a6268 0%, #3d4245 100%);
    }
  `}
  
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

export const FarmCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    border-color: #28a745;
  }
  
  h3 {
    font-size: clamp(1.1rem, 2.2vw, 1.3rem);
    color: #2d3748;
    margin-bottom: 0.75rem;
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
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.75rem;
    
    &.healthy {
      background-color: #d4edda;
      color: #155724;
    }
    
    &.warning {
      background-color: #fff3cd;
      color: #856404;
    }
    
    &.critical {
      background-color: #f8d7da;
      color: #721c24;
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
    margin-bottom: 1.5rem;
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