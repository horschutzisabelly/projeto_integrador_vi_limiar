import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import Inicio from './src/screens/inicio';
import Login from './src/screens/login';
import Cadastro from './src/screens/cadastro';
import RecuperarSenha from './src/screens/recuperarSenha';
import NovaSenha from './src/screens/novaSenha';
import Painel from './src/screens/painel';
import Alerta from './src/screens/alerta';
import Historico from './src/screens/historico';
import DetalhesEvento from './src/screens/detalhesEventos';
import Configuracoes from './src/screens/configuracao';
import FeedbackScreen from './src/screens/feedbackScreen';

import type {Evento} from './src/screens/detalhesEventos';
import type {FeedbackResposta} from './src/screens/feedbackScreen';

import BottomNavigation from './src/components/bottomNavigation';
import type {
  DestinoNavegacao,
} from './src/components/bottomNavigation';

import {useSettings} from './src/hooks/useSettings';

type Tela =
  | 'inicio'
  | 'login'
  | 'cadastro'
  | 'recuperarSenha'
  | 'novaSenha'
  | 'painel'
  | 'alerta'
  | 'historico'
  | 'detalhes'
  | 'feedback'
  | 'configuracoes';

type OrigemDetalhes = 'alerta' | 'historico';

const TEXTOS_FEEDBACK: Record<FeedbackResposta, string> = {
  correspondeu: 'Sim, correspondeu',
  falso_alerta: 'Não, foi um falso alerta',
  nao_sei: 'Não sei dizer',
};

// Evento fictício usado enquanto o armazenamento
// e a análise dos sinais não estão integrados.
const EVENTO_INICIAL: Evento = {
  id: 'evento-exemplo-01',
  data: '28 out 2026',
  horario: '09:42',
  avisoLido: false,
  normalizado: false,
};

export default function App() {
  const [tela, setTela] = useState<Tela>('inicio');

  const [evento, setEvento] = useState<Evento>({
    ...EVENTO_INICIAL,
  });

  const [resposta, setResposta] = useState<
    FeedbackResposta | undefined
  >();

  const [origemDetalhes, setOrigemDetalhes] =
    useState<OrigemDetalhes>('historico');

  const {
    preferencias,
    mensagem,
    alterar,
    ajustarVolume,
    salvar,
  } = useSettings();

  const mostrarNavegacao =
    tela === 'painel' ||
    tela === 'alerta' ||
    tela === 'historico' ||
    tela === 'detalhes' ||
    tela === 'configuracoes';

  const abaSelecionada: DestinoNavegacao =
    tela === 'detalhes'
      ? 'historico'
      : tela === 'alerta'
        ? 'alerta'
        : tela === 'configuracoes'
          ? 'configuracoes'
          : tela === 'historico'
            ? 'historico'
            : 'painel';

  function abrirDetalhes(origem: OrigemDetalhes) {
    setOrigemDetalhes(origem);
    setTela('detalhes');
  }

  function voltarPainel() {
    setTela('painel');
  }

  function simularAlteracao() {
    setEvento({...EVENTO_INICIAL});
    setResposta(undefined);
    setTela('alerta');
  }

  function confirmarAviso() {
    setEvento(atual => ({
      ...atual,
      avisoLido: true,
    }));
  }

  function simularNormalizacao() {
    setEvento(atual => ({
      ...atual,
      normalizado: true,
      horarioNormalizacao: '09:43',
    }));

    setTela('feedback');
  }

  async function salvarFeedback(novaResposta: FeedbackResposta) {
    // TODO: persistir a resposta associada ao evento no SQLite.
    setResposta(novaResposta);

    setEvento(atual => ({
      ...atual,
      feedback: TEXTOS_FEEDBACK[novaResposta],
    }));

    setOrigemDetalhes('historico');
    setTela('detalhes');

    Alert.alert(
      'Resposta registrada',
      'Sua resposta foi associada ao evento nesta sessão de teste.',
    );
  }

  function finalizarSessao() {
    // TODO: encerrar a sessão quando a autenticação for integrada.
    setTela('login');
  }

  // Feedback já possui sua própria SafeAreaView.
  // A navegação inferior fica oculta nessa etapa.
  if (tela === 'feedback') {
    return (
      <FeedbackScreen
        horarioEvento={evento.horario}
        respostaInicial={resposta}
        onVoltar={() => abrirDetalhes('historico')}
        onResponderDepois={() => setTela('historico')}
        onSalvar={salvarFeedback}
      />
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.conteudo}>
        {tela === 'inicio' && (
          <Inicio onComecar={() => setTela('login')} />
        )}

        {tela === 'login' && (
          <Login
            onEntrar={() => setTela('painel')}
            onRecuperarSenha={() => setTela('recuperarSenha')}
            onCadastrar={() => setTela('cadastro')}
          />
        )}

        {tela === 'cadastro' && (
          <Cadastro
            onVoltarLogin={() => setTela('login')}
            onCadastroConcluido={() => {
              setTela('login');

              Alert.alert(
                'Cadastro demonstrado',
                'Nenhuma conta foi salva. Para testar o acesso, continue usando alex@exemplo.com e Limiar123.',
              );
            }}
          />
        )}

        {tela === 'recuperarSenha' && (
          <RecuperarSenha
            onVoltarLogin={() => setTela('login')}
            onAbrirLinkExemplo={() => setTela('novaSenha')}
          />
        )}

        {tela === 'novaSenha' && (
          <NovaSenha
            onVoltarLogin={() => setTela('login')}
            onConcluido={() => {
              setTela('login');

              Alert.alert(
                'Redefinição demonstrada',
              );
            }}
          />
        )}

        {tela === 'painel' && (
          <Painel
            alteracaoAtiva={!evento.normalizado}
            onSimularAlteracao={simularAlteracao}
            onAbrirAlerta={() => setTela('alerta')}
            onAbrirHistorico={() => setTela('historico')}
          />
        )}

        {tela === 'alerta' && (
          <Alerta
            confirmado={evento.avisoLido}
            onConfirmar={confirmarAviso}
            onAbrirDetalhes={() => abrirDetalhes('alerta')}
            onAbrirHistorico={() => setTela('historico')}
            onSimularNormalizacao={() => {
              if (evento.normalizado) {
                setTela('feedback');
              } else {
                simularNormalizacao();
              }
            }}
          />
        )}

        {tela === 'historico' && (
          <Historico
            eventos={[evento]}
            onAbrirEvento={() => abrirDetalhes('historico')}
            onVoltarPainel={voltarPainel}
          />
        )}

        {tela === 'detalhes' && (
          <DetalhesEvento
            evento={evento}
            onVoltar={() => setTela(origemDetalhes)}
            onVoltarPainel={voltarPainel}
            onAbrirFeedback={() => {
              if (evento.normalizado) {
                setTela('feedback');
              }
            }}
          />
        )}

        {tela === 'configuracoes' && (
          <Configuracoes
            preferencias={preferencias}
            mensagem={mensagem}
            onAlterarSom={valor => alterar('som', valor)}
            onAlterarNotificacoes={valor =>
              alterar('notificacoes', valor)
            }
            onAjustarVolume={ajustarVolume}
            onSalvar={salvar}
            onVoltarPainel={voltarPainel}
            onFinalizarSessao={finalizarSessao}
          />
        )}
      </View>

      {mostrarNavegacao && (
        <BottomNavigation
          selecionado={abaSelecionada}
          onNavegar={destino => setTela(destino)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#FFFEFA',
  },
  conteudo: {
    flex: 1,
  },
});