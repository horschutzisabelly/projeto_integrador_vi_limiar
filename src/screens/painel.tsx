import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';

import {styles} from '../styles/painelStyles';
import type {RegistroAnaliseIA} from '../types/analiseIA';

type Props = {
  alteracaoAtiva: boolean;
  onSimularAlteracao: () => void;
  onAbrirAlerta: () => void;
  onAbrirHistorico: () => void;
  onAbrirAnaliseIA: () => void;
  ultimoRegistroIA?: RegistroAnaliseIA;
};

export default function Painel({
  alteracaoAtiva,
  onSimularAlteracao,
  onAbrirAlerta,
  onAbrirHistorico,
  onAbrirAnaliseIA,
  ultimoRegistroIA,
}: Props) {
  const [mostrarSinais, setMostrarSinais] = useState(false);

  return (
    <View style={styles.tela}>
      <View style={styles.banner}>
        <Text style={styles.bannerTexto}>
          Dados simulados · protótipo acadêmico
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.sobretitulo}>SEU PAINEL</Text>

        <Text accessibilityRole="header" style={styles.titulo}>
          Olá, Maria.
        </Text>

        <Text style={styles.texto}>
          Acompanhe o estado apresentado pela simulação.
        </Text>

        <View
          style={[
            styles.estado,
            alteracaoAtiva && styles.estadoAlterado,
          ]}>
          <Text style={styles.sobretitulo}>ANÁLISE SIMULADA ORIGINAL</Text>

          <Text accessibilityRole="header" style={styles.estadoTitulo}>
            {alteracaoAtiva
              ? 'Alteração identificada'
              : 'Sem alteração'}
          </Text>

          <Text style={styles.texto}>
            {alteracaoAtiva
              ? 'Os sinais de exemplo mudaram em relação à referência.'
              : 'Os sinais de exemplo estão dentro da referência da simulação.'}
          </Text>

          <View style={styles.atualizacao}>
            <Text style={styles.texto}>Última atualização</Text>
            <Text style={styles.valor}>
              {alteracaoAtiva ? '09:42' : '09:43'}
            </Text>
          </View>
        </View>

        <Text style={styles.qualidade}>
          Dados disponíveis para a simulação.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{expanded: mostrarSinais}}
          onPress={() => setMostrarSinais(atual => !atual)}
          style={styles.expandir}>
          <Text style={styles.link}>
            {mostrarSinais ? '−' : '+'} Ver sinais e explicações
          </Text>
        </Pressable>

        {mostrarSinais && (
          <View style={styles.sinais}>
            <Text style={styles.texto}>
              <Text style={styles.negrito}>
                Resposta elétrica da pele (EDA)
              </Text>
              {'\n'}
              Exemplo: {alteracaoAtiva ? '4,1' : '2,4'} µS.
              Quando a pele transpira, sua capacidade de conduzir
              eletricidade muda. Esse número, sozinho, não indica
              sobrecarga sensorial.
            </Text>

            <Text style={styles.texto}>
              <Text style={styles.negrito}>Sinal de pulso (BVP)</Text>
              {'\n'}
              Disponível nesta amostra. Representa variações do
              volume de sangue a cada pulso. Não é uma medida
              de batimentos por minuto.
            </Text>

            <Text style={styles.texto}>
              <Text style={styles.negrito}>Movimento</Text>
              {'\n'}
              Nível ilustrativo: {alteracaoAtiva ? 'elevado' : 'baixo'}.
              Resume o movimento presente nos dados de exemplo.
            </Text>

            <Text style={styles.observacao}>
              Esses sinais não confirmam como você se sente.
            </Text>
          </View>
        )}

        <View style={styles.simulacao}>
          <Text style={styles.texto}>Integração com a IA</Text>
          <Text style={styles.valor}>
            {ultimoRegistroIA
              ? `Último resultado: ${ultimoRegistroIA.resultado.indicador_experimental === 1 ? 'variação experimental' : 'referência experimental'}`
              : 'Ainda não executada nesta sessão'}
          </Text>
          {ultimoRegistroIA && (
            <Text style={styles.texto}>
              Score do modelo: {(ultimoRegistroIA.resultado.score_modelo * 100).toFixed(1)}% · {ultimoRegistroIA.dataHora}
            </Text>
          )}
          <Text style={styles.observacao}>
            A análise da IA usa exemplos artificiais. Não gera alertas clínicos.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onAbrirAnaliseIA}
          style={styles.principal}>
          <Text style={styles.principalTexto}>
            Abrir análise com IA
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={alteracaoAtiva ? onAbrirAlerta : onSimularAlteracao}
          style={styles.secundario}>
          <Text style={styles.link}>
            {alteracaoAtiva ? 'Ver alerta da simulação original' : 'Simular alteração original'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onAbrirHistorico}
          style={styles.secundario}>
          <Text style={styles.link}>Consultar histórico</Text>
        </Pressable>

        <Text style={styles.rodape}>
          Esta demonstração não faz diagnóstico.
        </Text>
      </ScrollView>
    </View>
  );
}
