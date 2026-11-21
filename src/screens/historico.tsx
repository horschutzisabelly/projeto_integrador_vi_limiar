import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

import type {Evento} from './detalhesEventos';
import type {RegistroAnaliseIA} from '../types/analiseIA';
import {styles} from '../styles/historicoStyles';

type Props = {
  eventos: Evento[];
  registrosIA?: RegistroAnaliseIA[];
  onAbrirEvento: (id: string) => void;
  onAbrirAnaliseIA?: () => void;
  onVoltarPainel: () => void;
};

export default function Historico({
  eventos,
  registrosIA = [],
  onAbrirEvento,
  onAbrirAnaliseIA,
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
          Previsões da IA (exemplos artificiais) e eventos da simulação original.
        </Text>

        <Text style={styles.sobretitulo}>ANÁLISES EXPERIMENTAIS DA IA</Text>
        {registrosIA.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>Nenhuma análise registrada.</Text>
            <Text style={styles.texto}>
              Execute um exemplo na tela de análise com IA para registrar o resultado.
            </Text>
          </View>
        ) : (
          registrosIA.map(registro => (
            <Pressable
              key={registro.id}
              accessibilityRole="button"
              onPress={onAbrirAnaliseIA}
              style={({pressed}) => [styles.evento, pressed && styles.pressionado]}>
              <View style={styles.eventoConteudo}>
                <Text style={styles.data}>{registro.dataHora}</Text>
                <Text style={styles.eventoTitulo}>
                  {registro.resultado.indicador_experimental === 1
                    ? 'Variação experimental (IA)'
                    : 'Referência experimental (IA)'}
                </Text>
                <Text style={styles.texto}>{registro.exemplo}</Text>
                <Text style={styles.situacao}>
                  Score {(registro.resultado.score_modelo * 100).toFixed(1)}% · limiar {(registro.resultado.limiar * 100).toFixed(1)}%
                </Text>
                <Text style={styles.linkDetalhes}>Ver análise da IA →</Text>
              </View>
            </Pressable>
          ))
        )}

        <View style={{marginTop: 32}}>
          <Text style={styles.sobretitulo}>SIMULAÇÃO ORIGINAL</Text>
        </View>
        {eventos.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>
              Ainda não há eventos.
            </Text>
            <Text style={styles.texto}>
              Os eventos aparecerão aqui quando uma alteração for simulada.
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
              <View accessible={false} style={styles.iconeOrganico}>
                <Text style={styles.iconeTexto}>!</Text>
              </View>
              <View style={styles.eventoConteudo}>
                <Text style={styles.data}>
                  {evento.data} · {evento.horario}
                </Text>
                <Text style={styles.eventoTitulo}>
                  Alteração identificada (simulação)
                </Text>
                <Text style={styles.texto}>
                  {evento.normalizado
                    ? 'Normalizado'
                    : evento.avisoLido
                      ? 'Aviso lido'
                      : 'Aguardando leitura'}
                </Text>
                <Text style={styles.situacao}>
                  {evento.feedback ? 'Feedback registrado' : 'Evento simulado'}
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
          Esta demonstração não faz diagnóstico. As previsões da IA são armazenadas apenas na sessão atual, sem dados de pessoas reais.
        </Text>
      </ScrollView>
    </View>
  );
}
