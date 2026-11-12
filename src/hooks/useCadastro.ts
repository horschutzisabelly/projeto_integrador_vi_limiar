import {useState} from 'react';

import {
  validarCadastro,
} from '../validacao/cadastroValidacao';

import type {
  DadosCadastro,
} from '../validacao/cadastroValidacao';

const DADOS_INICIAIS: DadosCadastro = {
  nome: '',
  sobrenome: '',
  email: '',
  senha: '',
  confirmacao: '',
};

export function useSignup(onConcluido: () => void) {
  const [dados, setDados] = useState<DadosCadastro>(DADOS_INICIAIS);
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function alterar(campo: keyof DadosCadastro, valor: string) {
    setDados(atual => ({
      ...atual,
      [campo]: valor,
    }));

    setErro('');
  }

  function cadastrar() {
    const mensagem = validarCadastro(dados);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    // Cadastro demonstrativo: nenhuma credencial é persistida.
    // TODO: conectar ao serviço de cadastro local seguro.
    // Não salvar senhas em texto puro no SQLite.

    setDados(DADOS_INICIAIS);
    setErro('');
    onConcluido();
  }

  return {
    dados,
    erro,
    mostrarSenha,
    alterar,
    cadastrar,
    alternarMostrarSenha: () => setMostrarSenha(atual => !atual),
  };
}