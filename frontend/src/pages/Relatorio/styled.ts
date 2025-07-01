import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #e2e8f0); /* from-slate-50 to-slate-200 */
  padding: 1.5rem; /* p-6 */

  @media (max-width: 768px) { /* md:p-4 */
    padding: 1rem;
  }
`;

export const MaxWidthWrapper = styled.div`
  max-width: 80rem; /* max-w-7xl */
  margin: 0 auto; /* mx-auto */
`;

export const HeaderSection = styled.div`
  background-color: #ffffff; /* bg-white */
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  padding: 1.5rem; /* p-6 */
  margin-bottom: 1.5rem; /* mb-6 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* gap-4 */

  @media (min-width: 1024px) { /* lg:flex-row lg:items-center lg:justify-between */
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const HeaderTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* gap-4 */
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  padding: 0.5rem 1rem; /* px-4 py-2 */
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: #ffffff; /* text-white */
  border: none;
  border-radius: 0.5rem; /* rounded-lg */
  transition: all 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, #c82333 0%, #b21f2c 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ReportTitle = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: bold;
  color: #111827; /* text-gray-900 */

  @media (max-width: 1023px) { /* lg:text-2xl */
    font-size: 1.5rem;
  }
`;

export const ReportSubtitle = styled.p`
  color: #4b5563; /* text-gray-600 */
  margin-top: 0.25rem; /* mt-1 */
`;

export const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  padding: 0.75rem 1.5rem; /* px-6 py-3 */
  background-color: #10b981; /* bg-green-600 */
  color: #ffffff; /* text-white */
  border-radius: 0.5rem; /* rounded-lg */
  border: none;
  transition: background-color 0.2s ease-in-out; 

  &:hover {
    background-color: #059669; /* hover:bg-green-700 */
  }
`;

// AJUSTADO: De Grid para Flexbox para centralizar os itens
export const QuickStatsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza os cartões horizontalmente */
  gap: 1.5rem; /* gap-6 */
  margin-bottom: 1.5rem; /* mb-6 */
`;

export const StatCard = styled.div`
  background-color: #ffffff; /* bg-white */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
  padding: 1.5rem; /* p-6 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1; /* Permite que os cards cresçam */
  
  @media (min-width: 768px) {
    max-width: calc(50% - 0.75rem); /* Para 2 colunas */
  }

  @media (min-width: 1024px) {
    max-width: calc(25% - 1.125rem); /* Para 4 colunas, garantindo o espaçamento */
  }
`;

export const StatContent = styled.div`
  p:first-child {
    color: #4b5563; /* text-gray-600 */
    font-size: 0.875rem; /* text-sm */
  }
  p:nth-child(2) {
    font-size: 1.875rem; /* text-3xl */
    font-weight: bold;
    color: #111827; /* text-gray-900 */
  }
  p:nth-child(3) { /* for anomaly percentage */
    font-size: 0.875rem; /* text-sm */
    color: #6b7280; /* text-gray-500 */
  }
`;

export const AnomalyStatValue = styled(StatContent)`
  p:nth-child(2) {
    color: #ea580c; /* text-orange-600 */
  }
`;

export const HealthStatValue = styled(StatContent)`
  p:nth-child(2) {
    color: #10b981; /* text-green-600 */
  }
`;

export const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  margin-top: 0.5rem; /* mt-2 */
  
  span {
    font-weight: 600; /* font-semibold */
    color: #111827;
  }
`;

export const FarmInfoSection = styled(HeaderSection)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  flex-direction: column; 
  align-items: flex-start; /* Alinha o título à esquerda */
`;

export const FarmInfoTitle = styled.h2`
  font-size: 1.25rem; /* text-xl */
  font-weight: bold;
  color: #111827; /* text-gray-900 */
  margin-bottom: 1rem; /* mb-4 */
  width: 100%; /* Garante que o título ocupe a largura toda */
  text-align: center; /* Centraliza o título */

  @media (min-width: 768px) {
    text-align: left; /* Alinha à esquerda em telas maiores */
  }
`;

// AJUSTADO: De Grid para Flexbox para centralizar os itens
export const FarmInfoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza os itens de informação */
  gap: 1.5rem; /* gap-6 */
  width: 100%; /* Ocupa toda a largura da seção */
`;

export const FarmInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  
  p:first-child {
    font-size: 0.875rem; /* text-sm */
    color: #4b5563; /* text-gray-600 */
  }
  p:last-child {
    font-weight: 600; /* font-semibold */
    color: #111827; /* text-gray-900 */
  }
`;

export const TabsSection = styled(HeaderSection)`
  padding: 0;
  margin-bottom: 1.5rem;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

export const TabNav = styled.nav`
  display: flex;
  justify-content: center; /* Centraliza a(s) aba(s) */
  border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
  padding: 0 1.5rem; 
  gap: 2rem; /* space-x-8 */
`;

interface TabButtonProps {
  $isActive: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  padding: 1rem 0.25rem; /* py-4 px-1 */
  border-bottom: 2px solid; 
  font-weight: 500; /* font-medium */
  font-size: 0.875rem; /* text-sm */
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid;
  border-color: transparent;

  color: ${props => (props.$isActive ? '#2563eb' : '#6b7280')};
  border-color: ${props => (props.$isActive ? '#3b82f6' : 'transparent')};

  &:hover {
    color: ${props => (props.$isActive ? '#2563eb' : '#374151')};
    border-color: ${props => (props.$isActive ? '#3b82f6' : '#d1d5db')};
  }
`;

export const TabContent = styled.div`
  padding: 1.5rem; /* p-6 */
`;

export const ChartContainer = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;

  h3 {
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    color: #111827; /* text-gray-900 */
    margin-bottom: 1rem; /* mb-4 */
    text-align: center; /* Centraliza o título do gráfico */
  }
`;

// AJUSTADO: De Grid para Flexbox para centralizar o conteúdo
export const TwoColumnGrid = styled.div`
  display: flex;
  justify-content: center; /* Centraliza o gráfico */
  flex-wrap: wrap;
  gap: 1.5rem; /* gap-6 */
`;

/* O restante do arquivo styled.ts permanece igual */

export const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */

  @media (min-width: 768px) { /* md:grid-cols-3 */
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const AnomalyTypeCard = styled.div`
  background-color: #f9fafb; /* bg-gray-50 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 1rem; /* p-4 */

  h4 {
    font-weight: 600; /* font-semibold */
    color: #111827; /* text-gray-900 */
  }
  p:nth-child(2) {
    font-size: 1.5rem; /* text-2xl */
    font-weight: bold;
    color: #111827; /* text-gray-900 */
  }
  p:last-child {
    font-size: 0.875rem; /* text-sm */
    color: #4b5563; /* text-gray-600 */
  }
`;

export const AnomalyTypeColorIndicator = styled.div<{ $color: string }>`
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  border-radius: 9999px; /* rounded-full */
  background-color: ${props => props.$color};
`;

export const RecommendationCard = styled.div`
  border: 1px solid #e5e7eb; /* border border-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 1.5rem; /* p-6 */
`;

export const RecommendationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem; /* mb-3 */

  h4 {
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    color: #111827; /* text-gray-900 */
  }
`;

export const PriorityTag = styled.span<{ $priorityColor: string }>`
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border-radius: 9999px; /* rounded-full */
  font-size: 0.75rem; /* text-xs */
  font-weight: 600; /* font-semibold */
  border: 1px solid;

  ${props => {
    switch (props.$priorityColor) {
      case 'high':
        return `
          background-color: #fee2e2; /* bg-red-100 */
          color: #991b1b; /* text-red-800 */
          border-color: #fecaca; /* border-red-200 */
        `;
      case 'medium':
        return `
          background-color: #fffbeb; /* bg-yellow-100 */
          color: #92400e; /* text-yellow-800 */
          border-color: #fde68a; /* border-yellow-200 */
        `;
      case 'low':
        return `
          background-color: #eff6ff; /* bg-blue-100 */
          color: #1e40af; /* text-blue-800 */
          border-color: #bfdbfe; /* border-blue-200 */
        `;
      default:
        return `
          background-color: #f3f4f6; /* bg-gray-100 */
          color: #374151; /* text-gray-800 */
          border-color: #e5e7eb; /* border-gray-200 */
        `;
    }
  }}
`;

export const RecommendationDescription = styled.p`
  color: #374151; /* text-gray-700 */
  margin-bottom: 0.75rem; /* mb-3 */
`;

export const ActionRecommendedBox = styled.div`
  background-color: #eff6ff; /* bg-blue-50 */
  border: 1px solid #bfdbfe; /* border border-blue-200 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 0.75rem; /* p-3 */

  p:first-child {
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #1c3d7e; /* text-blue-900 */
  }
  p:last-child {
    font-size: 0.875rem; /* text-sm */
    color: #2a59a7; /* text-blue-800 */
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const LoadingText = styled.div`
  font-size: 1.125rem; /* text-lg */
`;