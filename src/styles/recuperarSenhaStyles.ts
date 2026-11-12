import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#FFFEFA',
  },
  banner: {
    padding: 12,
    backgroundColor: '#E7EEE5',
  },
  bannerTexto: {
    color: '#536960',
    fontSize: 13,
    textAlign: 'center',
  },
  conteudo: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  voltar: {
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#315D50',
    fontSize: 15,
    fontWeight: '600',
  },
  titulo: {
    color: '#253E39',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
  },
  texto: {
    color: '#536960',
    fontSize: 16,
    lineHeight: 24,
  },
  rotulo: {
    color: '#253E39',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 28,
    marginBottom: 8,
  },
  campo: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#BCCABD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#253E39',
    fontSize: 16,
  },
  campoErro: {
    borderColor: '#903C35',
  },
  erro: {
    color: '#903C35',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  principal: {
    minHeight: 52,
    backgroundColor: '#315D50',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  principalTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultado: {
    backgroundColor: '#E7EEE5',
    borderRadius: 12,
    padding: 18,
    gap: 12,
    marginTop: 24,
  },
  resultadoTitulo: {
    color: '#253E39',
    fontSize: 18,
    fontWeight: '600',
  },
  observacao: {
    color: '#536960',
    fontSize: 13,
    lineHeight: 20,
  },
  secundario: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#BCCABD',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rodape: {
    color: '#536960',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
});