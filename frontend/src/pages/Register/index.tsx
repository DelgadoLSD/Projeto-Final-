import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  RegisterContainer, 
  RegisterBox, 
  LogoContainer, 
  WelcomeMessage,
  BaseInput, 
  CheckButton,
  SelectItem,
  LoginLink
} from './styled';
import LogoAgrineural from '../../assets/Agrineural.png';
import BackgroundImage from '../../assets/folhaMamao.jpg';

export function Register() {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cpf || !nome || !senha || !tipo) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cpf,
          nome,
          senha,
          tipo,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        switch (tipo) {
          case 'produtor':
            navigate('/cadastro-produtor');
            break;
          case 'operador':
            navigate('/cadastro-operador');
            break;
          case 'mosaiqueiro':
            navigate('/cadastro-mosaiqueiro');
            break;
        }
      } else {
        alert(data.message || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <RegisterContainer backgroundImage={BackgroundImage}>
      <LogoContainer>
        <img src={LogoAgrineural} alt="Logo Agrineural" />
      </LogoContainer>
      <RegisterBox>
        <WelcomeMessage>
          <h2>Crie o seu perfil e chegue cada vez mais perto dos seus objetivos!</h2>
        </WelcomeMessage>

        <form onSubmit={handleSubmit}>
          <BaseInput
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <BaseInput
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <SelectItem
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="produtor">Produtor</option>
            <option value="operador">Operador</option>
            <option value="mosaiqueiro">Mosaiqueiro</option>
          </SelectItem>
          <BaseInput
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <CheckButton type="submit" disabled={!tipo}>
            Criar Conta
          </CheckButton>
        </form>

        <Link to="/login">
          <LoginLink>Já tem uma conta? Faça login</LoginLink>
        </Link>

      </RegisterBox>
    </RegisterContainer>
  );
}
