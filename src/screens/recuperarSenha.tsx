import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useRecovery} from '../hooks/useRecovery';
import {styles} from '../styles/recuperarSenhaStyles';

type Props = {
  onVoltarLogin: () => void;
  onAbrirLinkExemplo: () => void;
};

export default function RecuperarSenha({
  onVoltarLogin,
  onAbrirLinkExemplo,
}: Props) {
  const {
    email,
    erro,
    solicitado,
    alterarEmail,
    solicitarLink,
  } = useRecovery();

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.banner}>
      </View>

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          onPress={onVoltarLogin}
          style={styles.voltar}>
          <Text style={styles.link}>← Voltar para entrar</Text>
        </Pressable>

        <Text accessibilityRole="header" style={styles.titulo}>
          Esqueceu sua senha?
        </Text>

        <Text style={styles.texto}>
          Informe o e-mail da sua conta para receber um link
          de recuperação.
        </Text>

        <Text nativeID="rotuloEmail" style={styles.rotulo}>
          E-mail
        </Text>

        <TextInput
          accessibilityLabel="E-mail"
          accessibilityLabelledBy="rotuloEmail"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="voce@exemplo.com"
          placeholderTextColor="#536960"
          value={email}
          onChangeText={alterarEmail}
          onSubmitEditing={solicitarLink}
          returnKeyType="done"
          style={[
            styles.campo,
            erro !== '' && styles.campoErro,
          ]}
        />

        {erro !== '' && (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            style={styles.erro}>
            {erro}
          </Text>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={solicitarLink}
          style={styles.principal}>
          <Text style={styles.principalTexto}>
            {solicitado
              ? 'Solicitar link novamente'
              : 'Enviar link de recuperação'}
          </Text>
        </Pressable>

        {solicitado && (
          <View
            accessibilityLiveRegion="polite"
            style={styles.resultado}>
            <Text
              accessibilityRole="header"
              style={styles.resultadoTitulo}>
              Confira seu e-mail
            </Text>

            <Text style={styles.texto}>
              Se houver uma conta com esse e-mail, você receberá
              um link para criar uma nova senha.
            </Text>

            <Text style={styles.observacao}>
              Demonstração: nenhum e-mail foi enviado.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={onAbrirLinkExemplo}
              style={styles.secundario}>
              <Text style={styles.link}>
                Abrir link de exemplo
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}