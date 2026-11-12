export function validarLogin(email: string, senha: string): string {
  if (!email.trim() || !senha) {
    return 'Informe seu e-mail e sua senha.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Informe um e-mail válido.';
  }

  return '';
}