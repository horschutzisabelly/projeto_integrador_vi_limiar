import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

import {styles} from '../styles/inicioStyles';

type Props = {
  onComecar: () => void;
};

export default function Inicio({onComecar}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <View style={styles.apresentacao}>
        <Text accessibilityRole="header" style={styles.marca}>
          LIMIAR
        </Text>

        <Text style={styles.slogan}>
          Informação para acompanhar seu momento.
        </Text>

        <Text style={styles.descricao}>
          Consulte os estados da simulação, acompanhe os avisos
          e registre sua percepção.
        </Text>
      </View>

      <View style={styles.acoes}>
        <View style={styles.aviso}>

          <Text style={styles.avisoTexto}>
            Os dados são simulados. Esta demonstração não faz
            diagnóstico.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onComecar}
          style={({pressed}) => [
            styles.botao,
            pressed && styles.pressionado,
          ]}>
          <Text style={styles.botaoTexto}>Começar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}