import { Header } from '../../components/Header'
import { Link } from "react-router-dom";
import { 
  InitialContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  ContentSection,
  ScrollContainer, 
  DescriptionContainer, 
  UsersSection,
  TextContent,
  ImageContent,
  UserCard,
  ResponsiveSection,
  ContentWrapper
} from './styled'
import LogoAgrineural from '../../assets/LogoAgrineural3.png'
// IMPORTANTE: Importe a imagem diretamente
import mamaoPapayaImg from '../../assets/mamaoPapaya.jpg'

export function Initial(){
    return(
        <>
            <Header/>
            <InitialContainer>
                {/* IMPORTANTE: Passe a imagem como prop obrigatória */}
                <HeroSection backgroundImage={mamaoPapayaImg}>
                    <HeroContent>
                        <HeroTitle>
                            Revolucione sua Propriedade com Inteligência Artificial
                        </HeroTitle>
                        <HeroSubtitle>
                            Detecte viroses em mamoeiros antes que se tornem um problema. 
                            Nossa IA oferece diagnósticos precisos para maximizar sua produtividade.
                        </HeroSubtitle>
                        <Link to="/register">
                            <CTAButton>
                                Comece Agora
                            </CTAButton> 
                        </Link>
                    </HeroContent>
                </HeroSection>
                {/* Content Section */}
                <ContentSection>
                    <ScrollContainer>
                        <ResponsiveSection>
                            <ContentWrapper>
                                <DescriptionContainer>
                                    <h2>QUEM SOMOS?</h2>
                                    <p>
                                        A AgriNeural é uma empresa que atua no desenvolvimento de soluções baseadas em inteligência artificial 
                                        para o setor agropecuário, com ênfase no diagnóstico precoce de viroses em mamoeiros. O objetivo da empresa é 
                                        propor soluções simples e intuitivas para produtores, otimizando o controle da operação em sua produção e permitindo 
                                        a tomada de decisões com base em dados precisos.
                                    </p>
                                </DescriptionContainer>
                            </ContentWrapper>
                        </ResponsiveSection>
                        
                        <ResponsiveSection>
                            <ContentWrapper>
                                <DescriptionContainer>
                                    <h2>QUEM SÃO NOSSOS USUÁRIOS?</h2>
                                    <UsersSection>
                                        <TextContent>
                                            <p>Os usuários do sistema se dividem em três grupos principais:</p>
                                            
                                            <UserCard>
                                                <h3>• Produtor</h3>
                                                <p>
                                                    Agricultores e gestores de propriedades que necessitam monitorar a saúde das plantas (mamoeiros) 
                                                    e tomar decisões estratégicas com base nos dados. O sistema oferecerá a visualização dos relatórios, 
                                                    mapas de calor e estatísticas de infecção.
                                                </p>
                                            </UserCard>
                                            
                                            <UserCard>
                                                <h3>• Operador</h3>
                                                <p>
                                                    Profissional responsável por coletar imagens das lavouras e realizar o upload através do site.
                                                </p>
                                            </UserCard>
                                            
                                            <UserCard>
                                                <h3>• Mosaiqueiro</h3>
                                                <p>
                                                    Especialista que realiza a verificação visual das plantas e é responsável por tratar as áreas 
                                                    identificadas como problemáticas. Poderá consultar um mapa de calor da propriedade que destaca 
                                                    a localização e a porcentagem de áreas infectadas.
                                                </p>
                                            </UserCard>
                                        </TextContent>
                                    </UsersSection>
                                </DescriptionContainer>
                            </ContentWrapper>
                        </ResponsiveSection>
                    </ScrollContainer>
                </ContentSection>
            </InitialContainer>
        </>
    )
}