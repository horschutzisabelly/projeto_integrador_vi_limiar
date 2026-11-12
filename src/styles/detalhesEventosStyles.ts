import {StyleSheet} from 'react-native';

const CORES = {
  fundo: '#FFFEFA',
  texto: '#253E39',
  secundario: '#536960',
  verde: '#315D50',
  suave: '#E7EEE5',
  borda: '#BCCABD',
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
    padding: 24,
    paddingBottom: 40,
  },
  voltar: {
    minHeight: 48,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingRight: 20,
    marginBottom: 20,
  },
  link: {
    color: CORES.verde,
    fontSize: 15,
    fontWeight: '600',
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
    marginBottom: 24,
  },
  aviso: {
    backgroundColor: CORES.suave,
    borderRadius: 12,
    padding: 18,
    gap: 8,
    marginBottom: 12,
  },
  avisoTitulo: {
    color: CORES.texto,
    fontSize: 17,
    fontWeight: '600',
  },
  texto: {
    color: CORES.secundario,
    fontSize: 15,
    lineHeight: 23,
  },
  linha: {
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    paddingVertical: 16,
    gap: 6,
  },
  rotulo: {
    color: CORES.secundario,
    fontSize: 14,
  },
  valor: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  expandir: {
    minHeight: 52,
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  explicacoes: {
    gap: 16,
    paddingBottom: 16,
  },
  negrito: {
    color: CORES.texto,
    fontWeight: '600',
  },
  observacao: {
    color: CORES.secundario,
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 16,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  botao: {
    flexGrow: 1,
    flexBasis: 140,
    minHeight: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: CORES.verde,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});