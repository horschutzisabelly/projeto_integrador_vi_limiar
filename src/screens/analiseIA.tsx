import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {EXEMPLOS_FEATURES, criarJanelaArtificial} from '../fixtures/limiarExemplos';
import {
  analisarFeatures,
  analisarSensores,
  obterUrlAPI,
  verificarAPI,
  type SaudeLimiar,
} from '../services/limiarApi';
import type {RegistroAnaliseIA, ResultadoLimiar} from '../types/analiseIA';

type Props = {
  registros: RegistroAnaliseIA[];
  onRegistrar: (registro: RegistroAnaliseIA) => void;
  onVoltar: () => void;
  onVerHistorico: () => void;
};

type Exemplo = 'referencia' | 'variacao' | 'sensores';

function explicarResultado(resultado: ResultadoLimiar): string {
  return resultado.indicador_experimental === 1
    ? 'Padrão semelhante à condição de stress experimental estudada no WESAD.'
    : 'Padrão semelhante à condição de referência estudada no WESAD.';
}

export default function AnaliseIA({
  registros,
  onRegistrar,
  onVoltar,
  onVerHistorico,
}: Props) {
  const [saude, setSaude] = useState<SaudeLimiar | null>(null);
  const [carregandoConexao, setCarregandoConexao] = useState(true);
  const [carregandoPrevisao, setCarregandoPrevisao] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<ResultadoLimiar | null>(null);
  const [ultimoExemplo, setUltimoExemplo] = useState('');

  async function atualizarConexao() {
    setCarregandoConexao(true);
    setErro('');
    try {
      setSaude(await verificarAPI());
    } catch (falha) {
      setSaude(null);
      setErro(falha instanceof Error ? falha.message : 'Falha na conexão com a API.');
    } finally {
      setCarregandoConexao(false);
    }
  }

  useEffect(() => {
    // Linter de React/Expo: requisicao inicial e opcao de testar novamente.
    void atualizarConexao();
  }, []);

  async function executarExemplo(exemplo: Exemplo) {
    if (carregandoPrevisao) return;
    setCarregandoPrevisao(true);
    setErro('');
    try {
      const previsao = exemplo === 'sensores'
        ? await analisarSensores(criarJanelaArtificial())
        : await analisarFeatures(EXEMPLOS_FEATURES[exemplo]);
      const nome = exemplo === 'referencia'
        ? 'Exemplo A — referência artificial'
        : exemplo === 'variacao'
          ? 'Exemplo B — variação artificial'
          : 'Exemplo C — sinais artificiais (EDA/ACC)';
      setResultado(previsao);
      setUltimoExemplo(nome);
      onRegistrar({
        id: `analise-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        dataHora: new Date().toLocaleString('pt-BR'),
        exemplo: nome,
        origem: exemplo === 'sensores' ? 'sensores' : 'features',
        resultado: previsao,
      });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível analisar o exemplo.');
    } finally {
      setCarregandoPrevisao(false);
    }
  }

  const ocupado = carregandoPrevisao || carregandoConexao;

  return (
    <View style={styles.tela}>
      <View style={styles.banner}>
        <Text style={styles.bannerTexto}>Pesquisa acadêmica · exemplos artificiais · sem finalidade clínica</Text>
      </View>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable accessibilityRole="button" onPress={onVoltar} style={styles.voltar}>
          <Text style={styles.link}>← Voltar ao painel</Text>
        </Pressable>

        <Text style={styles.sobretitulo}>LIMIAR / INTELIGÊNCIA ARTIFICIAL</Text>
        <Text accessibilityRole="header" style={styles.titulo}>Análise experimental</Text>
        <Text style={styles.texto}>
          Aqui o aplicativo conversa com o modelo treinado pela equipe. Os exemplos abaixo
          são artificiais: o resultado vem da IA, mas não corresponde a uma leitura real de alguém.
        </Text>

        <View style={styles.cartao}>
          <Text style={styles.subtitulo}>Conexão com a API</Text>
          {carregandoConexao ? (
            <ActivityIndicator color="#315D50" />
          ) : saude ? (
            <>
              <Text style={styles.valor}>Conectado · {saude.algoritmo.replace(/_/g, ' ')}</Text>
              <Text style={styles.textoPequeno}>Features: {saude.features.join(', ')}</Text>
            </>
          ) : (
            <Text style={styles.aviso}>Servidor não conectado</Text>
          )}
          <Text style={styles.endereco}>Endereço: {obterUrlAPI() || 'não configurado'}</Text>
          <Pressable accessibilityRole="button" disabled={ocupado} onPress={() => void atualizarConexao()} style={styles.botaoContorno}>
            <Text style={styles.link}>Testar conexão novamente</Text>
          </Pressable>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.subtitulo}>Executar uma previsão</Text>
          <Text style={styles.textoPequeno}>
            As três opções enviam dados à API de verdade. A classificação depende do modelo e do limiar salvos.
          </Text>
          <Pressable accessibilityRole="button" disabled={ocupado} onPress={() => void executarExemplo('referencia')} style={[styles.botao, ocupado && styles.desabilitado]}>
            <Text style={styles.botaoTexto}>Analisar exemplo A · referência</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={ocupado} onPress={() => void executarExemplo('variacao')} style={[styles.botao, ocupado && styles.desabilitado]}>
            <Text style={styles.botaoTexto}>Analisar exemplo B · variação</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={ocupado} onPress={() => void executarExemplo('sensores')} style={[styles.botaoContorno, ocupado && styles.desabilitado]}>
            <Text style={styles.link}>Analisar janela sintética EDA + ACC (30 s)</Text>
          </Pressable>
          {carregandoPrevisao && <ActivityIndicator color="#315D50" />}
        </View>

        {erro !== '' && (
          <View style={styles.erro}>
            <Text accessibilityRole="alert" style={styles.erroTexto}>{erro}</Text>
          </View>
        )}

        {resultado && (
          <View style={styles.resultado}>
            <Text style={styles.sobretitulo}>RESULTADO DA API</Text>
            <Text style={styles.subtitulo}>{ultimoExemplo}</Text>
            <Text style={styles.resultadoTitulo}>{
              resultado.indicador_experimental === 1 ? 'Variação experimental' : 'Referência experimental'
            }</Text>
            <Text style={styles.texto}>{explicarResultado(resultado)}</Text>
            <View style={styles.metricas}>
              <View style={styles.metrica}>
                <Text style={styles.textoPequeno}>Score do modelo</Text>
                <Text style={styles.numero}>{(resultado.score_modelo * 100).toFixed(1)}%</Text>
              </View>
              <View style={styles.metrica}>
                <Text style={styles.textoPequeno}>Limiar configurado</Text>
                <Text style={styles.numero}>{(resultado.limiar * 100).toFixed(1)}%</Text>
              </View>
            </View>
            <Text style={styles.textoPequeno}>
              O score expressa a saída do classificador, não a probabilidade clínica de sobrecarga sensorial.
            </Text>
          </View>
        )}

        <View style={styles.cartao}>
          <Text style={styles.subtitulo}>Últimas análises desta sessão ({registros.length})</Text>
          {registros.length === 0 ? (
            <Text style={styles.textoPequeno}>Nenhuma análise executada nesta sessão.</Text>
          ) : registros.slice(0, 4).map(registro => (
            <View key={registro.id} style={styles.registro}>
              <Text style={styles.valor}>{registro.exemplo}</Text>
              <Text style={styles.textoPequeno}>{registro.dataHora} · score {(registro.resultado.score_modelo * 100).toFixed(1)}%</Text>
            </View>
          ))}
          <Pressable accessibilityRole="button" onPress={onVerHistorico} style={styles.botaoContorno}>
            <Text style={styles.link}>Ver histórico no aplicativo</Text>
          </Pressable>
        </View>

        <Text style={styles.rodape}>
          O modelo foi treinado para diferenciar baseline e stress experimental no WESAD.
          Não é um detector validado de sobrecarga sensorial em pessoas com TEA e não gera alertas clínicos.
          O armazenamento deste exemplo é apenas em memória e se perde ao fechar o aplicativo.
        </Text>
      </ScrollView>
    </View>
  );
}

const C = {fundo: '#FFFEFA', verde: '#315D50', texto: '#253E39', secundario: '#536960', suave: '#E7EEE5', borda: '#BCCABD'};
const styles = StyleSheet.create({
  tela: {flex: 1, backgroundColor: C.fundo},
  banner: {padding: 12, backgroundColor: C.suave},
  bannerTexto: {textAlign: 'center', fontSize: 12, color: C.secundario},
  conteudo: {padding: 24, paddingBottom: 44, gap: 14},
  voltar: {paddingVertical: 7, alignSelf: 'flex-start'},
  link: {color: C.verde, fontSize: 15, fontWeight: '600', textAlign: 'center'},
  sobretitulo: {color: C.secundario, fontSize: 12, fontWeight: '700', letterSpacing: 1.6},
  titulo: {color: C.texto, fontSize: 28, fontWeight: '600'},
  subtitulo: {fontSize: 17, fontWeight: '600', color: C.texto},
  texto: {fontSize: 15, lineHeight: 22, color: C.secundario},
  textoPequeno: {fontSize: 13, lineHeight: 20, color: C.secundario},
  cartao: {backgroundColor: C.suave, borderRadius: 18, padding: 18, gap: 12},
  valor: {fontSize: 15, color: C.texto, fontWeight: '600'},
  endereco: {fontSize: 12, color: C.secundario},
  aviso: {color: '#7B501C', fontWeight: '600'},
  botao: {borderRadius: 10, backgroundColor: C.verde, paddingHorizontal: 12, paddingVertical: 16, minHeight: 48, justifyContent: 'center'},
  botaoTexto: {color: '#FFFFFF', textAlign: 'center', fontSize: 15, fontWeight: '600'},
  botaoContorno: {borderRadius: 10, paddingHorizontal: 12, paddingVertical: 14, borderWidth: 1, borderColor: C.borda, minHeight: 48, justifyContent: 'center'},
  desabilitado: {opacity: 0.5},
  erro: {backgroundColor: '#FBE9E7', borderRadius: 12, padding: 14},
  erroTexto: {color: '#852D24', fontSize: 14, lineHeight: 20},
  resultado: {backgroundColor: '#F3EBDC', borderRadius: 18, padding: 20, gap: 12},
  resultadoTitulo: {color: C.texto, fontSize: 24, fontWeight: '600'},
  metricas: {flexDirection: 'row', gap: 10},
  metrica: {flex: 1, backgroundColor: '#FFFEFA', borderRadius: 12, padding: 12, gap: 6},
  numero: {fontSize: 20, color: C.texto, fontWeight: '700'},
  registro: {borderTopColor: C.borda, borderTopWidth: 1, paddingTop: 10, gap: 4},
  rodape: {fontSize: 13, lineHeight: 20, color: C.secundario, marginTop: 4},
});
