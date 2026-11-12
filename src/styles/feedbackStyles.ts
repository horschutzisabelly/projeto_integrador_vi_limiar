import {StyleSheet} from 'react-native';

const CORES = {
  fundo: '#FFFEFA',
  texto: '#253E39',
  textoSecundario: '#536960',
  verde: '#315D50',
  verdeSuave: '#E7EEE5',
  borda: '#BCCABD',
  erro: '#903C35',
  branco: '#FFFFFF',
};

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  cabecalho: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  marca: {
    color: CORES.texto,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 4,
  },
  banner: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: CORES.verdeSuave,
  },
  bannerTexto: {
    color: CORES.textoSecundario,
    fontSize: 13,
    textAlign: 'center',
  },
  conteudo: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  voltar: {
    alignSelf: 'flex-start',
    minHeight: 48,
    justifyContent: 'center',
    paddingRight: 20,
    marginBottom: 20,
  },
  voltarTexto: {
    color: CORES.verde,
    fontSize: 14,
  },
  sobretitulo: {
    color: CORES.textoSecundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
  },
  descricao: {
    color: CORES.textoSecundario,
    fontSize: 16,
    lineHeight: 24,
  },
  opcoes: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    gap: 12,
    marginVertical: 24,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    gap: 12,
  },
  opcaoSelecionada: {
    borderColor: CORES.verde,
    backgroundColor: CORES.verdeSuave,
  },
  radio: {
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: CORES.textoSecundario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelecionado: {
    borderColor: CORES.verde,
  },
  radioCentro: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CORES.verde,
  },
  opcaoTexto: {
    flex: 1,
    color: CORES.texto,
    fontSize: 15,
    lineHeight: 22,
  },
  erro: {
    color: CORES.erro,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  acoes: {
    gap: 12,
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
  },
  botaoSecundarioTexto: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  observacao: {
    color: CORES.textoSecundario,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 24,
  },
  pressionado: {
    opacity: 0.8,
  },
  desabilitado: {
    opacity: 0.6,
  },
});