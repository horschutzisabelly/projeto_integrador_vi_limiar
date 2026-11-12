import React, {useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {styles} from '../styles/feedbackStyles';

export type FeedbackResposta =
  | 'correspondeu'
  | 'falso_alerta'
  | 'nao_sei';

type FeedbackScreenProps = {
  horarioEvento: string;
  respostaInicial?: FeedbackResposta;
  onVoltar: () => void;
  onResponderDepois: () => void;
  onSalvar: (resposta: FeedbackResposta) => Promise<void>;
};

const OPCOES: {
  valor: FeedbackResposta;
  texto: string;
}[] = [
  {valor: 'correspondeu', texto: 'Sim, correspondeu'},
  {valor: 'falso_alerta', texto: 'Não, foi um falso alerta'},
  {valor: 'nao_sei', texto: 'Não sei dizer'},
];

export default function FeedbackScreen({
  horarioEvento,
  respostaInicial,
  onVoltar,
  onResponderDepois,
  onSalvar,
}: FeedbackScreenProps) {
  const [resposta, setResposta] = useState<
    FeedbackResposta | undefined
  >(respostaInicial);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function salvarResposta() {
    if (!resposta) {
      setErro('Escolha uma resposta ou toque em “Responder depois”.');
      return;
    }

    setErro('');
    setSalvando(true);

    try {
      await onSalvar(resposta);
    } catch {
      setErro(
        'Não foi possível salvar sua resposta. Tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.cabecalho}>
        <Text style={styles.marca}>LIMIAR</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTexto}>
          Dados simulados · protótipo acadêmico
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para o alerta"
          disabled={salvando}
          onPress={onVoltar}
          style={styles.voltar}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </Pressable>

        <Text style={styles.sobretitulo}>SUA PERCEPÇÃO</Text>

        <Text accessibilityRole="header" style={styles.titulo}>
          Como foi para você?
        </Text>

        <Text style={styles.descricao}>
          Os sinais da simulação voltaram à referência. O aviso das{' '}
          {horarioEvento} correspondeu à sua experiência?
        </Text>

        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Sua percepção sobre o aviso"
          style={styles.opcoes}>
          {OPCOES.map(opcao => {
            const selecionada = resposta === opcao.valor;

            return (
              <Pressable
                key={opcao.valor}
                accessibilityRole="radio"
                accessibilityLabel={opcao.texto}
                accessibilityState={{
                  checked: selecionada,
                  disabled: salvando,
                }}
                disabled={salvando}
                onPress={() => {
                  setResposta(opcao.valor);
                  setErro('');
                }}
                style={({pressed}) => [
                  styles.opcao,
                  selecionada && styles.opcaoSelecionada,
                  pressed && styles.pressionado,
                ]}>
                <View
                  accessible={false}
                  style={[
                    styles.radio,
                    selecionada && styles.radioSelecionado,
                  ]}>
                  {selecionada && (
                    <View style={styles.radioCentro} />
                  )}
                </View>

                <Text style={styles.opcaoTexto}>
                  {opcao.texto}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {erro !== '' && (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            style={styles.erro}>
            {erro}
          </Text>
        )}

        <View style={styles.acoes}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: salvando,
              busy: salvando,
            }}
            disabled={salvando}
            onPress={salvarResposta}
            style={({pressed}) => [
              styles.botao,
              styles.botaoPrincipal,
              pressed && styles.pressionado,
              salvando && styles.desabilitado,
            ]}>
            <Text style={styles.botaoPrincipalTexto}>
              {salvando ? 'Salvando resposta…' : 'Salvar minha resposta'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{disabled: salvando}}
            disabled={salvando}
            onPress={onResponderDepois}
            style={({pressed}) => [
              styles.botao,
              styles.botaoSecundario,
              pressed && styles.pressionado,
              salvando && styles.desabilitado,
            ]}>
            <Text style={styles.botaoSecundarioTexto}>
              Responder depois
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

