export function validarEmailRecuperacao(email: string): string {
  if (!email.trim()) {
    return 'Informe o e-mail da sua conta.';
  }

  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoValido.test(email.trim())) {
    return 'Informe um e-mail válido, como nome@exemplo.com.';
  }

  return '';
}