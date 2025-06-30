import styled from 'styled-components'

// Breakpoints para responsividade
const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  xxl: '1440px'
}

const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`,
  xlUp: `@media (min-width: ${breakpoints.xl})`
}

export const HeatMapContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  
  ${media.lg} {
    padding: 1.5rem;
  }
  
  ${media.md} {
    padding: 1rem;
  }
  
  ${media.sm} {
    padding: 0.75rem;
  }
`

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
  }
  
  ${media.sm} {
    padding: 1rem;
  }
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: fit-content;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
    background: linear-gradient(135deg, #5a6268 0%, #3d4245 100%);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  ${media.sm} {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }
`

export const FarmInfo = styled.div`
  flex: 1;
  
  h1 {
    font-size: clamp(1.5rem, 4vw, 2.2rem);
    color: #1a202c;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  .farm-details {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    
    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4a5568;
      font-size: clamp(0.85rem, 2vw, 1rem);
      
      svg {
        width: 16px;
        height: 16px;
        color: #3182ce;
      }
    }
    
    ${media.sm} {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  .last-update {
    margin-left: auto;
    color: #718096;
    font-size: 0.9rem;
  }
  
  ${media.md} {
    flex-wrap: wrap;
    
    .last-update {
      margin-left: 0;
      width: 100%;
      text-align: center;
      margin-top: 0.5rem;
    }
  }
  
  ${media.sm} {
    padding: 1rem;
  }
`

export const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    background: linear-gradient(135deg, #218838 0%, #1ba085 100%);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  ${media.sm} {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  ${media.sm} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const StatCard = styled.div<{ status: 'healthy' | 'warning' | 'critical' }>`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'healthy': return '#38a169'
      case 'warning': return '#ed8936'
      case 'critical': return '#e53e3e'
      default: return '#38a169'
    }
  }};
  
  .stat-value {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 1rem;
    color: #4a5568;
    margin-bottom: 0.25rem;
    font-weight: 600;
  }
  
  .stat-percentage {
    font-size: 0.9rem;
    color: #718096;
  }
  
  ${media.sm} {
    padding: 1.25rem;
  }
`

export const MapContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow: hidden;
  
  svg {
    max-width: 100%;
    height: auto;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    
    circle {
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        r: 10;
        opacity: 1;
        stroke-width: 2;
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

export const LegendContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.2rem;
    color: #1a202c;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .legend-items {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  ${media.md} {
    padding: 1.25rem;
    
    .legend-items {
      gap: 1.5rem;
    }
  }
  
  ${media.sm} {
    padding: 1rem;
    
    .legend-items {
      flex-direction: column;
      gap: 1rem;
    }
  }
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .legend-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  span {
    font-size: 0.9rem;
    color: #4a5568;
    font-weight: 500;
  }
`

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  gap: 1rem;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3182ce;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  p {
    color: #4a5568;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  gap: 1rem;
  text-align: center;
  color: #e53e3e;
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #1a202c;
  }
  
  p {
    font-size: 1rem;
    color: #4a5568;
    margin-bottom: 1.5rem;
    max-width: 400px;
  }
`