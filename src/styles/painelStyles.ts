import {StyleSheet} from 'react-native';

const CORES = {
  fundo: '#FFFEFA',
  texto: '#253E39',
  secundario: '#536960',
  verde: '#315D50',
  suave: '#E7EEE5',
  borda: '#BCCABD',
  alteracao: '#F3EBDC',
};

export const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  banner: {
    backgroundColor: CORES.suave,
    padding: 12,
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
  sobretitulo: {
    color: CORES.secundario,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  texto: {
    color: CORES.secundario,
    fontSize: 15,
    lineHeight: 23,
  },
  estado: {
    backgroundColor: CORES.suave,
    padding: 22,
    borderRadius: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  estadoAlterado: {
    backgroundColor: CORES.alteracao,
  },
  estadoTitulo: {
    color: CORES.texto,
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 12,
  },
  atualizacao: {
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
    paddingTop: 16,
    marginTop: 20,
    gap: 6,
  },
  valor: {
    color: CORES.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  qualidade: {
    color: CORES.secundario,
    fontSize: 13,
    lineHeight: 20,
  },
  expandir: {
    minHeight: 52,
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  link: {
    color: CORES.verde,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  sinais: {
    gap: 20,
    paddingVertical: 12,
  },
  negrito: {
    color: CORES.texto,
    fontWeight: '600',
  },
  observacao: {
    color: CORES.secundario,
    fontSize: 13,
    lineHeight: 20,
  },
  simulacao: {
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
    paddingVertical: 20,
    gap: 6,
  },
  principal: {
    minHeight: 52,
    backgroundColor: CORES.verde,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  principalTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secundario: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  rodape: {
    color: CORES.secundario,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
});