export type DadosCadastro = {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  confirmacao: string;
};

export function validarCadastro(dados: DadosCadastro): string {
  if (
    !dados.nome.trim() ||
    !dados.sobrenome.trim() ||
    !dados.email.trim() ||
    !dados.senha ||
    !dados.confirmacao
  ) {
    return 'Preencha todos os campos para continuar.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) {
    return 'Informe um e-mail válido.';
  }

  if (dados.senha.length < 8) {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }

  if (dados.senha !== dados.confirmacao) {
    return 'As senhas estão diferentes. Confira a confirmação.';
  }

  return '';
}