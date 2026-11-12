import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

import {styles} from '../styles/detalhesEventosStyles';

export type Evento = {
  id: string;
  data: string;
  horario: string;
  avisoLido: boolean;
  normalizado: boolean;
  horarioNormalizacao?: string;
  feedback?: string;
};

type Props = {
  evento: Evento;
  onVoltar: () => void;
  onVoltarPainel: () => void;
  onAbrirFeedback: () => void;
};

export default function DetalhesEvento({
  evento,
  onVoltar,
  onVoltarPainel,
  onAbrirFeedback,
}: Props) {
  const [mostrarSinais, setMostrarSinais] = useState(false);

  return (
    <View style={styles.tela}>
      <View style={styles.banner}>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para o histórico"
          onPress={onVoltar}
          style={styles.voltar}>
          <Text style={styles.link}>← Voltar</Text>
        </Pressable>

        <Text style={styles.sobretitulo}>REGISTRO SIMULADO</Text>

        <Text accessibilityRole="header" style={styles.titulo}>
          Detalhes do evento
        </Text>

        <Text style={styles.descricao}>
          {evento.data} · {evento.horario}
        </Text>

        <View style={styles.aviso}>
          <Text style={styles.avisoTitulo}>
            Alteração identificada
          </Text>

          <Text style={styles.texto}>
            Resultado ilustrativo da análise. Não é um diagnóstico.
          </Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>Leitura do aviso</Text>
          <Text style={styles.valor}>
            {evento.avisoLido ? 'Confirmada' : 'Pendente'}
          </Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>Situação</Text>
          <Text style={styles.valor}>
            {evento.normalizado
              ? `Normalizado${
                  evento.horarioNormalizacao
                    ? ` às ${evento.horarioNormalizacao}`
                    : ''
                }`
              : 'Alteração em curso'}
          </Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>Dados</Text>
          <Text style={styles.valor}>Disponíveis · exemplo</Text>
        </View>

        <View style={styles.linha}>
          <Text style={styles.rotulo}>Sua percepção</Text>
          <Text style={styles.valor}>
            {evento.feedback ?? 'Ainda não informada'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{expanded: mostrarSinais}}
          onPress={() => setMostrarSinais(atual => !atual)}
          style={styles.expandir}>
          <Text style={styles.link}>
            {mostrarSinais ? '−' : '+'} Entenda os sinais deste evento
          </Text>
        </Pressable>

        {mostrarSinais && (
          <View style={styles.explicacoes}>
            <Text style={styles.texto}>
              <Text style={styles.negrito}>Resposta da pele: </Text>
              no exemplo, a medida elétrica da pele aumentou.
              Essa mudança pode acompanhar variações de transpiração,
              mas não indica, sozinha, sobrecarga sensorial.
            </Text>

            <Text style={styles.texto}>
              <Text style={styles.negrito}>Sinal de pulso: </Text>
              estava disponível para análise. Este exemplo não informa
              uma mudança no ritmo do coração.
            </Text>

            <Text style={styles.texto}>
              <Text style={styles.negrito}>Movimento: </Text>
              o nível ilustrativo passou de baixo para elevado.
            </Text>

            <Text style={styles.texto}>
              Esses sinais não confirmam como você se sentiu.
              Os dados desta tela são fictícios.
            </Text>
          </View>
        )}

        {!evento.normalizado && (
          <Text style={styles.observacao}>
            O feedback estará disponível após a normalização
            dos sinais simulados.
          </Text>
        )}

        <View style={styles.acoes}>
          {evento.normalizado && (
            <Pressable
              accessibilityRole="button"
              onPress={onAbrirFeedback}
              style={styles.botao}>
              <Text style={styles.botaoTexto}>
                {evento.feedback ? 'Revisar feedback' : 'Dar feedback'}
              </Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={onVoltarPainel}
            style={styles.botao}>
            <Text style={styles.botaoTexto}>Voltar ao painel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}