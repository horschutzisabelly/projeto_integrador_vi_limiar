import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import {styles} from '../styles/bottomNavigationStyles';

export type DestinoNavegacao =
  | 'painel'
  | 'alerta'
  | 'historico'
  | 'configuracoes';

type Props = {
  selecionado: DestinoNavegacao;
  onNavegar: (destino: DestinoNavegacao) => void;
};

type Item = {
  destino: DestinoNavegacao;
  legenda: string;
  icone: React.ComponentProps<typeof Feather>['name'];
};

const ITENS: Item[] = [
  {destino: 'painel', legenda: 'Início', icone: 'home'},
  {destino: 'alerta', legenda: 'Alertas', icone: 'bell'},
  {destino: 'historico', legenda: 'Histórico', icone: 'clock'},
  {
    destino: 'configuracoes',
    legenda: 'Ajustes',
    icone: 'settings',
  },
];

export default function BottomNavigation({
  selecionado,
  onNavegar,
}: Props) {
  return (
    <View style={styles.barra}>
      {ITENS.map(item => {
        const ativo = selecionado === item.destino;

        return (
          <Pressable
            key={item.destino}
            accessibilityRole="tab"
            accessibilityLabel={item.legenda}
            accessibilityState={{selected: ativo}}
            onPress={() => onNavegar(item.destino)}
            style={({pressed}) => [
              styles.item,
              ativo && styles.itemAtivo,
              pressed && styles.pressionado,
            ]}>
            <View accessible={false}>
              <Feather
                name={item.icone}
                size={22}
                color={ativo ? '#234D3F' : '#536960'}
              />
            </View>

            <Text
              style={[
                styles.legenda,
                ativo && styles.legendaAtiva,
              ]}>
              {item.legenda}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}