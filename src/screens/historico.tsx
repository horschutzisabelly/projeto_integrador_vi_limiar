import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

import type {Evento} from './detalhesEventos';
import {styles} from '../styles/historicoStyles';

type Props = {
  eventos: Evento[];
  onAbrirEvento: (id: string) => void;
  onVoltarPainel: () => void;
};

export default function Historico({
  eventos,
  onAbrirEvento,
  onVoltarPainel,
}: Props) {
  return (
    <View style={styles.tela}>
      <View style={styles.banner}>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.sobretitulo}>SEUS REGISTROS</Text>

        <Text accessibilityRole="header" style={styles.titulo}>
          Histórico
        </Text>

        <Text style={styles.descricao}>
          Eventos simulados · mais recentes primeiro
        </Text>

        {eventos.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>
              Ainda não há eventos.
            </Text>

            <Text style={styles.texto}>
              Os eventos aparecerão aqui quando uma alteração
              for simulada.
            </Text>
          </View>
        ) : (
          eventos.map(evento => (
            <Pressable
              key={evento.id}
              accessibilityRole="button"
              accessibilityLabel={
                `Evento de ${evento.data}, às ${evento.horario}. ` +
                'Ver detalhes do evento.'
              }
              onPress={() => onAbrirEvento(evento.id)}
              style={({pressed}) => [
                styles.evento,
                pressed && styles.pressionado,
              ]}>
              <View
                accessible={false}
                style={styles.iconeOrganico}>
                <Text style={styles.iconeTexto}>!</Text>
              </View>

              <View style={styles.eventoConteudo}>
                <Text style={styles.data}>
                  {evento.data} · {evento.horario}
                </Text>

                <Text style={styles.eventoTitulo}>
                  Alteração identificada
                </Text>

                <Text style={styles.texto}>
                  {evento.normalizado
                    ? 'Normalizado'
                    : evento.avisoLido
                      ? 'Aviso lido'
                      : 'Aguardando leitura'}
                </Text>

                <Text style={styles.situacao}>
                  {evento.feedback
                    ? 'Feedback registrado'
                    : 'Evento simulado'}
                </Text>

                <Text style={styles.linkDetalhes}>
                  Ver detalhes do evento →
                </Text>
              </View>
            </Pressable>
          ))
        )}

        <Pressable
          accessibilityRole="button"
          onPress={onVoltarPainel}
          style={styles.botao}>
          <Text style={styles.botaoTexto}>
            Voltar ao painel
          </Text>
        </Pressable>

        <Text style={styles.observacao}>
          Esta demonstração não faz diagnóstico.
        </Text>
      </ScrollView>
    </View>
  );
}