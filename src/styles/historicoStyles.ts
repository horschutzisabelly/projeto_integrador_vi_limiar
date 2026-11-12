import {StyleSheet} from 'react-native';

const CORES = {
  fundo: '#FFFEFA',
  texto: '#253E39',
  secundario: '#536960',
  verde: '#315D50',
  suave: '#E7EEE5',
  borda: '#BCCABD',
  alertaFundo: '#EEE2CF',
  alertaTexto: '#775527',
};

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  banner: {
    backgroundColor: CORES.suave,
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
    marginBottom: 8,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  descricao: {
    color: CORES.secundario,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
  },
  evento: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
  },
  iconeOrganico: {
    width: 42,
    height: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.alertaFundo,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 24,
  },
  iconeTexto: {
    color: CORES.alertaTexto,
    fontSize: 25,
    fontWeight: '600',
  },
  eventoConteudo: {
    flex: 1,
    gap: 7,
  },
  data: {
    color: CORES.secundario,
    fontSize: 13,
  },
  eventoTitulo: {
    color: CORES.texto,
    fontSize: 17,
    fontWeight: '600',
  },
  texto: {
    color: CORES.secundario,
    fontSize: 15,
    lineHeight: 23,
  },
  situacao: {
    color: CORES.secundario,
    fontSize: 13,
  },
  linkDetalhes: {
    color: CORES.verde,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  vazio: {
    paddingVertical: 40,
    gap: 12,
  },
  vazioTitulo: {
    color: CORES.texto,
    fontSize: 20,
    fontWeight: '600',
  },
  botao: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  botaoTexto: {
    color: CORES.verde,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  observacao: {
    color: CORES.secundario,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
  pressionado: {
    opacity: 0.8,
  },
});