import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D6DED3',
    backgroundColor: '#FFFEFA',
  },
  item: {
    flex: 1,
    minHeight: 60,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  itemAtivo: {
    backgroundColor: '#E7EEE5',
  },
  legenda: {
    color: '#536960',
    fontSize: 12,
    textAlign: 'center',
  },
  legendaAtiva: {
    color: '#234D3F',
    fontWeight: '700',
  },
  pressionado: {
    opacity: 0.75,
  },
});