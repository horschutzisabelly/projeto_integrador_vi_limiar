import React from 'react';
import {Pressable, ScrollView, Switch, Text, View} from 'react-native';

import type {Preferencias} from '../hooks/useSettings';
import {styles} from '../styles/configuracaoStyles';

type Props = {
  preferencias: Preferencias;
  mensagem: string;
  onAlterarSom: (valor: boolean) => void;
  onAlterarNotificacoes: (valor: boolean) => void;
  onAjustarVolume: (variacao: number) => void;
  onSalvar: () => void;
  onVoltarPainel: () => void;
  onFinalizarSessao: () => void;
};

export default function Configuracoes({
  preferencias,
  mensagem,
  onAlterarSom,
  onAlterarNotificacoes,
  onAjustarVolume,
  onSalvar,
  onVoltarPainel,
  onFinalizarSessao,
}: Props) {
  return (
    <View style={styles.tela}>
      <View style={styles.banner}>
        <Text style={styles.bannerTexto}>
          Dados simulados · protótipo acadêmico
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable
          accessibilityRole="button"
          onPress={onVoltarPainel}
          style={styles.voltar}>
          <Text style={styles.link}>← Voltar ao painel</Text>
        </Pressable>

        <Text accessibilityRole="header" style={styles.titulo}>
          Configurações
        </Text>

        <Text style={styles.texto}>
          Escolha o que funciona para você.
        </Text>

        <View style={styles.secao}>
          <View style={styles.linha}>
            <View style={styles.rotulo}>
              <Text style={styles.subtitulo}>Som dos alertas</Text>
              <Text style={styles.texto}>Desligado por padrão</Text>
            </View>

            <Switch
              accessibilityLabel="Som dos alertas"
              value={preferencias.som}
              onValueChange={onAlterarSom}
              trackColor={{false: '#BCCABD', true: '#315D50'}}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.subtitulo}>Volume dos alertas</Text>

          <View style={styles.volume}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Diminuir volume em 5 por cento"
              disabled={!preferencias.som || preferencias.volume === 0}
              onPress={() => onAjustarVolume(-5)}
              style={[
                styles.volumeBotao,
                (!preferencias.som || preferencias.volume === 0) &&
                  styles.desabilitado,
              ]}>
              <Text style={styles.volumeSimbolo}>−</Text>
            </Pressable>

            <Text
              accessibilityLiveRegion="polite"
              style={styles.volumeValor}>
              {preferencias.volume}%
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Aumentar volume em 5 por cento"
              disabled={!preferencias.som || preferencias.volume === 100}
              onPress={() => onAjustarVolume(5)}
              style={[
                styles.volumeBotao,
                (!preferencias.som || preferencias.volume === 100) &&
                  styles.desabilitado,
              ]}>
              <Text style={styles.volumeSimbolo}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.texto}>
            O volume só se aplica quando o som está ativado.
          </Text>
        </View>

        <View style={styles.secao}>
          <View style={styles.linha}>
            <View style={styles.rotulo}>
              <Text style={styles.subtitulo}>Notificações locais</Text>
              <Text style={styles.texto}>
                Avisos fora do aplicativo
              </Text>
            </View>

            <Switch
              accessibilityLabel="Notificações locais"
              value={preferencias.notificacoes}
              onValueChange={onAlterarNotificacoes}
              trackColor={{false: '#BCCABD', true: '#315D50'}}
              thumbColor="#FFFFFF"
            />
          </View>

          {preferencias.notificacoes && (
            <Text style={styles.observacao}>
              Controle demonstrativo. A solicitação de permissão
              do dispositivo será conectada posteriormente.
            </Text>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onSalvar}
          style={styles.principal}>
          <Text style={styles.principalTexto}>
            Salvar preferências
          </Text>
        </Pressable>

        {mensagem !== '' && (
          <Text
            accessibilityLiveRegion="polite"
            style={styles.mensagem}>
            {mensagem}
          </Text>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={onFinalizarSessao}
          style={styles.secundario}>
          <Text style={styles.link}>Finalizar sessão</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}