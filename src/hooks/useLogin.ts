import {useState} from 'react';

import {validarLogin} from '../validacao/loginValidacao';

export function useLogin(onEntrar: () => void) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  function alterarEmail(valor: string) {
    setEmail(valor);
    setErro('');
  }

  function alterarSenha(valor: string) {
    setSenha(valor);
    setErro('');
  }

  function entrar() {
    const mensagem = validarLogin(email, senha);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    // Autenticação demonstrativa.
    // TODO: substituir pela autenticação local segura.
    const acessoValido =
      email.trim().toLowerCase() === 'limiar@gmail.com' &&
      senha === 'Limiar123';

    if (!acessoValido) {
      setErro('E-mail ou senha incorretos. Confira e tente novamente.');
      return;
    }

    setErro('');
    onEntrar();
  }

  return {
    email,
    senha,
    mostrarSenha,
    erro,
    alterarEmail,
    alterarSenha,
    alternarMostrarSenha: () => setMostrarSenha(atual => !atual),
    entrar,
  };
}