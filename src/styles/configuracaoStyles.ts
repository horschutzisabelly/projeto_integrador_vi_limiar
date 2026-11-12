import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#FFFEFA',
  },
  banner: {
    backgroundColor: '#E7EEE5',
    padding: 12,
  },
  bannerTexto: {
    color: '#536960',
    fontSize: 13,
    textAlign: 'center',
  },
  conteudo: {
    padding: 24,
    paddingBottom: 40,
  },
  voltar: {
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    color: '#253E39',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitulo: {
    color: '#253E39',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  texto: {
    color: '#536960',
    fontSize: 14,
    lineHeight: 22,
  },
  secao: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#BCCABD',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rotulo: {
    flex: 1,
  },
  volume: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 16,
  },
  volumeBotao: {
    width: 52,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#BCCABD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSimbolo: {
    color: '#315D50',
    fontSize: 26,
  },
  volumeValor: {
    color: '#253E39',
    fontSize: 20,
    fontWeight: '600',
  },
  principal: {
    minHeight: 52,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#315D50',
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
  secundario: {
    minHeight: 52,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BCCABD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    color: '#315D50',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  observacao: {
    color: '#536960',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
  },
  mensagem: {
    color: '#315D50',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 16,
  },
  desabilitado: {
    opacity: 0.4,
  },
});