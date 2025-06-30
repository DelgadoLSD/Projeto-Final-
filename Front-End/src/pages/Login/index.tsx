import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LoginContainer, 
  LoginBox, 
  LogoContainer, 
  WelcomeMessage,
  BaseInput, 
  CheckButton, 
  RegisterLink 
} from './styled';
import LogoAgrineural from '../../assets/Agrineural.png';
import BackgroundImage from '../../assets/folhaMamao.jpg';

export function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ cpf, senha })
      });

      const data = await response.json();

      if (data.status === 'success') {
        switch (data.tipo) {
          case 'produtor':
            navigate('/area-produtor');
            break;
          case 'operador':
            navigate('/area-operador');
            break;
          case 'mosaiqueiro':
            navigate('/area-mosaiqueiro');
            break;
          default:
            alert('Tipo de usuário não reconhecido.');
        }
      } else {
        alert(data.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <LoginContainer backgroundImage={BackgroundImage}>
      <LogoContainer>
        <img src={LogoAgrineural} alt="Logo Agrineural" />
      </LogoContainer>

      <LoginBox>
        <WelcomeMessage>
          Faça o login para acessar o seu perfil e continuar produzindo!
        </WelcomeMessage>

        <form onSubmit={handleLogin}>
          <BaseInput 
            type="text" 
            placeholder='CPF'
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <BaseInput 
            type="password" 
            placeholder='Senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <CheckButton type="submit">Entrar</CheckButton>
        </form>

        <Link to="/register">
          <RegisterLink>Não possui cadastro? Crie uma conta aqui</RegisterLink>
        </Link>
      </LoginBox>
    </LoginContainer>
  );
}
