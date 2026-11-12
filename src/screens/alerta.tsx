import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

import {styles} from '../styles/alertaStyless';

type Props = {
  confirmado: boolean;
  onConfirmar: () => void;
  onAbrirDetalhes: () => void;
  onAbrirHistorico: () => void;
  onSimularNormalizacao: () => void;
};

export default function Alerta({
  confirmado,
  onConfirmar,
  onAbrirDetalhes,
  onAbrirHistorico,
  onSimularNormalizacao,
}: Props) {
  return (
    <View style={styles.tela}>
      <View style={styles.banner}>
        <Text style={styles.bannerTexto}>
          Dados simulados · protótipo acadêmico
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.sobretitulo}>
          {confirmado ? 'SEUS AVISOS' : 'AVISO DA SIMULAÇÃO'}
        </Text>

        {confirmado ? (
          <>
            <Text
              accessibilityRole="header"
              style={styles.titulo}>
              Aviso confirmado.
            </Text>

            <Text style={styles.descricao}>
              A leitura foi registrada. Isso não confirma que
              você sentiu uma alteração.
            </Text>

            <View style={styles.confirmacao}>
              <Text style={styles.confirmacaoTexto}>
                O evento está disponível no histórico.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onSimularNormalizacao}
              style={({pressed}) => [
                styles.botao,
                styles.botaoPrincipal,
                pressed && styles.pressionado,
              ]}>
              <Text style={styles.botaoPrincipalTexto}>
                Simular normalização
              </Text>
            </Pressable>

            <Text style={styles.observacao}>
              Este controle avança os dados de exemplo para
              demonstrar a próxima etapa.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={onAbrirHistorico}
              style={({pressed}) => [
                styles.botao,
                styles.botaoSecundario,
                pressed && styles.pressionado,
              ]}>
              <Text style={styles.botaoSecundarioTexto}>
                Consultar histórico
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.aviso}>
              <View
                accessible={false}
                style={styles.iconeOrganico}>
                <Text style={styles.iconeTexto}>≈</Text>
              </View>

              <Text
                accessibilityRole="header"
                style={styles.titulo}>
                Uma alteração foi identificada.
              </Text>

              <Text style={styles.descricao}>
                Os sinais simulados mudaram em relação ao
                padrão de referência.
              </Text>

              <Text style={styles.avisoObservacao}>
                Este aviso usa dados simulados e não indica
                uma crise.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onConfirmar}
              style={({pressed}) => [
                styles.botao,
                styles.botaoPrincipal,
                pressed && styles.pressionado,
              ]}>
              <Text style={styles.botaoPrincipalTexto}>
                Entendi o aviso
              </Text>
            </Pressable>

            <Text style={styles.observacao}>
              Confirmar registra apenas que você leu.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={onAbrirDetalhes}
              style={({pressed}) => [
                styles.botao,
                styles.botaoSecundario,
                pressed && styles.pressionado,
              ]}>
              <Text style={styles.botaoSecundarioTexto}>
                Ver detalhes do evento
              </Text>
            </Pressable>
          </>
        )}

        <Text style={styles.rodape}>
          Esta demonstração não faz diagnóstico.
        </Text>
      </ScrollView>
    </View>
  );
}