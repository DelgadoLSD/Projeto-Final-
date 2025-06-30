// styled.ts
import styled from 'styled-components'

// Breakpoints expandidos para cobrir todos os dispositivos
const breakpoints = {
  xs: '320px',      // Smartphones pequenos
  sm: '480px',      // Smartphones
  md: '768px',      // Tablets
  lg: '1024px',     // Notebooks pequenos
  xl: '1200px',     // Notebooks médios
  xxl: '1440px',    // Desktops
  xxxl: '1920px'    // Desktops grandes
}

// Media queries mais abrangentes
const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
  
  // Media queries para ranges específicos
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`,
  xlUp: `@media (min-width: ${breakpoints.xl})`,
  xxlUp: `@media (min-width: ${breakpoints.xxl})`,
  
  // Ranges específicos
  smToMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  mdToLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  lgToXl: `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`
}

export const InitialContainer = styled.main`
    display: flex;
    flex-direction: column;
    min-height: 100vh;  
    background-color: ${props => props.theme['white']};
    width: 100%;
    overflow-x: hidden;
`

// Hero Section usando imagem importada
export const HeroSection = styled.section<{ backgroundImage: string }>`
    min-height: 70vh;
    background: linear-gradient(
        rgba(0, 0, 0, 0.4), 
        rgba(0, 0, 0, 0.4)
    ), url(${props => props.backgroundImage});
    
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    /* Fallback caso a imagem não carregue */
    background-color: #28a745;
    
    ${media.md} {
        background-attachment: scroll;
        min-height: 60vh;
    }
    
    ${media.sm} {
        min-height: 50vh;
    }
`    

export const HeroContent = styled.div`
    text-align: center;
    color: white;
    max-width: 800px;
    padding: 0 2rem;
    z-index: 2;
    
    ${media.sm} {
        padding: 0 1rem;
    }
`

export const HeroTitle = styled.h1`
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
    
    ${media.md} {
        margin-bottom: 1rem;
    }
`

export const HeroSubtitle = styled.p`
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    margin-bottom: 2.5rem;
    line-height: 1.6;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    opacity: 0.95;
    
    ${media.md} {
        margin-bottom: 2rem;
    }
    
    ${media.sm} {
        margin-bottom: 1.5rem;
    }
`

export const CTAButton = styled.button`
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: clamp(1rem, 2vw, 1.2rem);
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
        background: linear-gradient(135deg, #20c997, #28a745);
    }
    
    &:active {
        transform: translateY(-1px);
    }
    
    ${media.sm} {
        padding: 0.8rem 2rem;
    }
`

// Content Section
export const ContentSection = styled.section`
    background-color: #f8f9fa;
    min-height: 50vh;
`

export const ScrollContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 2rem;
    gap: 5rem;
    
    /* Notebooks e desktops médios */
    ${media.xl} {
        max-width: 1200px;
        padding: 2.5rem 2rem;
        gap: 4rem;
    }
    
    /* Notebooks pequenos */
    ${media.lg} {
        max-width: 100%;
        padding: 2rem 1.5rem;
        gap: 3rem;
    }
    
    /* Tablets */
    ${media.md} {
        padding: 1.5rem 1rem;
        gap: 2.5rem;
    }
    
    /* Smartphones */
    ${media.sm} {
        padding: 1rem 0.75rem;
        gap: 2rem;
    }
    
    /* Smartphones pequenos */
    ${media.xs} {
        padding: 1rem 0.5rem;
        gap: 1.5rem;
    }
`

export const DescriptionContainer = styled.div`
    margin: 0rem 0;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    display: flex;
    flex-direction: column; 
    gap: 2rem;
    line-height: 1.6;
    color: ${props => props.theme['black']};
    text-align: center;
    
    h2 {
        font-size: clamp(1.8rem, 4vw, 2.8rem);
        margin-bottom: 1rem;
        font-weight: bold;
        color: #28a745;
        
        ${media.lg} {
            font-size: clamp(1.6rem, 3.5vw, 2.2rem);
        }
        
        ${media.md} {
            font-size: clamp(1.4rem, 3vw, 2rem);
        }
        
        ${media.sm} {
            font-size: clamp(1.3rem, 2.5vw, 1.8rem);
            margin-bottom: 0.8rem;
        }
    }
    
    > p {
        max-width: min(65ch, 90%);
        margin: 0 auto;
        font-size: clamp(1.3rem, 2vw, 1.1rem);
        color: #555;
        
        ${media.md} {
            max-width: 95%;
        }
        
        ${media.sm} {
            max-width: 100%;
            text-align: left;
        }
    }
    
    ${media.lg} {
        margin: 1.5rem 0;
        gap: 1.5rem;
    }
    
    ${media.md} {
        margin: 1rem 0;
        gap: 1.2rem;
    }
    
    ${media.sm} {
        margin: 0.8rem 0;
        gap: 1rem;
    }
`

export const UsersSection = styled.div`
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    justify-content: center;
    
    /* Desktops grandes */
    ${media.xxlUp} {
        gap: 5rem;
    }
    
    /* Notebooks médios a grandes */
    ${media.lgToXl} {
        gap: 3rem;
    }
    
    /* Notebooks pequenos */
    ${media.lg} {
        gap: 2rem;
        flex-direction: column;
        align-items: center;
    }
    
    /* Tablets */
    ${media.md} {
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    
    /* Smartphones */
    ${media.sm} {
        gap: 1.5rem;
    }
`

export const TextContent = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0; // Previne overflow
    
    > p {
        font-size: clamp(1rem, 2vw, 1.2rem);
        margin-bottom: 1.5rem;
        
        ${media.lg} {
            text-align: center;
            margin-bottom: 1rem;
        }
        
        ${media.sm} {
            text-align: left;
            margin-bottom: 0.8rem;
        }
    }
    
    ${media.lg} {
        flex: 1;
        order: 2;
        gap: 1.2rem;
        width: 100%;
        max-width: 800px;
    }
    
    ${media.md} {
        max-width: 600px;
    }
    
    ${media.sm} {
        gap: 1rem;
        max-width: 100%;
    }
`

export const ImageContent = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-width: 200px;
    
    img {
        width: 100%;
        max-width: 400px;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        ${media.xl} {
            max-width: 350px;
        }
        
        ${media.lg} {
            max-width: 300px;
            border-radius: 10px;
        }
        
        ${media.md} {
            max-width: 250px;
            border-radius: 8px;
        }
        
        ${media.sm} {
            max-width: 200px;
            border-radius: 6px;
        }
    }
    
    ${media.lg} {
        order: 1;
        margin-bottom: 2rem;
        flex: none;
    }
    
    ${media.md} {
        margin-bottom: 1.5rem;
    }
    
    ${media.sm} {
        margin-bottom: 1rem;
        min-width: auto;
    }
`

export const UserCard = styled.div`
    background-color: white;
    padding: 1.8rem;
    border-radius: 12px;
    border-left: 4px solid #28a745;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        border-left-width: 6px;
    }
    
    h3 {
        font-size: clamp(1.1rem, 2.2vw, 1.4rem);
        font-weight: bold;
        margin-bottom: 1rem;
        color: #28a745;
        line-height: 1.3;
        text-align: left;
        
        ${media.sm} {
            margin-bottom: 0.8rem;
        }
    }
    
    p {
        margin: 0;
        text-align: left;
        font-size: clamp(0.95rem, 1.8vw, 1.05rem);
        line-height: 1.6;
        color: #555;
    }
    
    /* Notebooks */
    ${media.xl} {
        padding: 1.5rem;
        border-radius: 10px;
    }
    
    ${media.lg} {
        padding: 1.4rem;
        border-radius: 8px;
    }
    
    /* Tablets */
    ${media.md} {
        padding: 1.3rem;
        border-radius: 8px;
    }
    
    /* Smartphones */
    ${media.sm} {
        padding: 1.2rem;
        border-radius: 6px;
        border-left-width: 3px;
        
        &:hover {
            border-left-width: 4px;
        }
    }
    
    ${media.xs} {
        padding: 1rem;
    }
`

// Container responsivo para grids
export const ResponsiveGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
    gap: 2rem;
    width: 100%;
    
    ${media.lg} {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    ${media.sm} {
        gap: 1rem;
    }
`

// Seção com padding responsivo
export const ResponsiveSection = styled.section`
    padding: clamp(2rem, 5vw, 4rem) 0;
    width: 100%;
    
    &:first-child {
        padding-top: clamp(1rem, 3vw, 2rem);
    }
    
    &:last-child {
        padding-bottom: clamp(1rem, 3vw, 2rem);
    }
`

// Wrapper para conteúdo centralizado
export const ContentWrapper = styled.div`
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    
    ${media.smUp} {
        padding: 0 1.5rem;
    }
    
    ${media.mdUp} {
        padding: 0 2rem;
    }
    
    ${media.lgUp} {
        padding: 0;
    }
`