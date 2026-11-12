import {StyleSheet} from 'react-native';

const CORES = {
  fundo: '#FFFEFA',
  texto: '#253E39',
  secundario: '#536960',
  verde: '#315D50',
  verdeSuave: '#E7EEE5',
  borda: '#BCCABD',
  alertaFundo: '#F3EBDC',
  alertaBorda: '#E3D5BF',
  alertaTexto: '#775527',
  branco: '#FFFFFF',
};

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  banner: {
    backgroundColor: CORES.verdeSuave,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bannerTexto: {
    color: CORES.secundario,
    fontSize: 13,
    textAlign: 'center',
  },
  conteudo: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  sobretitulo: {
    color: CORES.secundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 20,
  },
  aviso: {
    backgroundColor: CORES.alertaFundo,
    borderWidth: 1,
    borderColor: CORES.alertaBorda,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  iconeOrganico: {
    width: 60,
    height: 60,
    backgroundColor: CORES.fundo,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconeTexto: {
    color: CORES.alertaTexto,
    fontSize: 32,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
  },
  descricao: {
    color: CORES.secundario,
    fontSize: 16,
    lineHeight: 25,
  },
  avisoObservacao: {
    color: CORES.alertaTexto,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 20,
  },
  confirmacao: {
    backgroundColor: CORES.verdeSuave,
    borderRadius: 12,
    padding: 18,
    marginVertical: 24,
  },
  confirmacaoTexto: {
    color: CORES.texto,
    fontSize: 15,
    lineHeight: 23,
  },
  botao: {
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPrincipal: {
    backgroundColor: CORES.verde,
  },
  botaoPrincipalTexto: {
    color: CORES.branco,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: CORES.borda,
    marginTop: 16,
  },
  botaoSecundarioTexto: {
    color: CORES.verde,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  observacao: {
    color: CORES.secundario,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
  },
  rodape: {
    color: CORES.secundario,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 28,
  },
  pressionado: {
    opacity: 0.8,
  },
});