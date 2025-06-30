import styled from 'styled-components';

interface LoginContainerProps {
    backgroundImage: string;
}

export const LoginContainer = styled.main<LoginContainerProps>`
    display: flex;
    justify-content: flex-end;
    padding-right: 5rem;
    align-items: center;
    height: 100vh;
    background-image: url(${props => props.backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
    }
`

export const LoginBox = styled.div`
    position: relative;
    z-index: 2;
    background-color: ${props => props.theme['white']};
    padding: 3rem 2.5rem;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`

export const LogoContainer = styled.div`
    position: absolute;
    left: 10rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    background: white;
    backdrop-filter: blur(15px);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-50%) scale(1.02);
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
    }

    img {
        max-width: 280px;
        height: auto;
        filter: brightness(1.05) contrast(1.1);
    }
`

export const WelcomeMessage = styled.h2`
    margin-bottom: 2rem;
    text-align: center;
    color: ${props => props.theme['verdeTexto']};
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
`

export const BaseInput = styled.input`
    width: 100%;
    height: 3rem;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
    background: ${props => props.theme['white']};
    border: 2px solid ${props => props.theme['gray-100'] || '#e5e7eb'};
    border-radius: 8px;
    font-size: 1rem;
    color: ${props => props.theme['gray-700'] || '#374151'};
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${props => props.theme['verdeEscura1Agrineural']};
        box-shadow: 0 0 0 3px ${props => props.theme['verdeClaroAgrineural']}40;
    }

    &::placeholder {
        color: ${props => props.theme['gray-400'] || '#9ca3af'};
    }
`

export const CheckButton = styled.button`
    width: 100%;
    height: 3rem;
    margin-bottom: 1.5rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
        background-color: ${props => props.theme['verdeEscura2Agrineural']};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    &:active {
        transform: translateY(0);
    }
`

export const RegisterLink = styled.span`
    display: block;
    text-align: center;
    font-size: 0.9rem;
    color: ${props => props.theme['verdeEscura1Agrineural']};
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: ${props => props.theme['verdeEscura2Agrineural']};
    }
`