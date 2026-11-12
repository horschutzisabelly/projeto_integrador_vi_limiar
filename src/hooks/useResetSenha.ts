import {useState} from 'react';

import {validarNovaSenha} from '../validacao/novaSenhaValidacao';

export function useResetPassword(onConcluido: () => void) {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  function alterarSenha(valor: string) {
    setSenha(valor);
    setErro('');
  }

  function alterarConfirmacao(valor: string) {
    setConfirmacao(valor);
    setErro('');
  }

  function salvar() {
    const mensagem = validarNovaSenha(senha, confirmacao);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    // Redefinição demonstrativa: nenhuma senha é alterada.
    // TODO: integrar com o serviço de recuperação.
    // Antes de alterar uma senha real, validar o token do link,
    // sua expiração e seu uso único no serviço de autenticação.

    setSenha('');
    setConfirmacao('');
    setErro('');
    onConcluido();
  }

  return {
    senha,
    confirmacao,
    mostrarSenha,
    erro,
    alterarSenha,
    alterarConfirmacao,
    alternarMostrarSenha: () => setMostrarSenha(atual => !atual),
    salvar,
  };
}