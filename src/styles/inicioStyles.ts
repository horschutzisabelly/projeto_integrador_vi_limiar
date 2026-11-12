import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  conteudo: {
    flexGrow: 1,
    backgroundColor: '#FFFEFA',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  apresentacao: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  marca: {
    color: '#253E39',
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 24,
  },
  slogan: {
    color: '#253E39',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 360,
  },
  descricao: {
    color: '#536960',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: 360,
  },
  acoes: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: 24,
  },
  aviso: {
    backgroundColor: '#E7EEE5',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  avisoTitulo: {
    color: '#253E39',
    fontSize: 15,
    fontWeight: '600',
  },
  avisoTexto: {
    color: '#536960',
    fontSize: 14,
    lineHeight: 22,
  },
  botao: {
    minHeight: 54,
    backgroundColor: '#315D50',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.8,
  },
});