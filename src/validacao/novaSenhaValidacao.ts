export function validarNovaSenha(
  senha: string,
  confirmacao: string,
): string {
  if (!senha || !confirmacao) {
    return 'Preencha a nova senha e a confirmação.';
  }

  if (senha.length < 8) {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }

  if (senha !== confirmacao) {
    return 'As senhas estão diferentes. Confira a confirmação.';
  }

  return '';
}