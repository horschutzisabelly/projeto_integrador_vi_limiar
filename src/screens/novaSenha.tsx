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

import {useResetPassword} from '../hooks/useResetSenha';
import {styles} from '../styles/resetSenhaStyles';

type Props = {
  onVoltarLogin: () => void;
  onConcluido: () => void;
};

export default function NovaSenha({
  onVoltarLogin,
  onConcluido,
}: Props) {
  const {
    senha,
    confirmacao,
    mostrarSenha,
    erro,
    alterarSenha,
    alterarConfirmacao,
    alternarMostrarSenha,
    salvar,
  } = useResetPassword(onConcluido);

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.marca}>LIMIAR</Text>

        <View style={styles.banner}>
          
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onVoltarLogin}
          style={styles.linkBotao}>
          <Text style={styles.link}>← Voltar para entrar</Text>
        </Pressable>

        <Text accessibilityRole="header" style={styles.titulo}>
          Crie uma nova senha.
        </Text>

        <Text style={styles.rotulo}>Nova senha</Text>

        <TextInput
          accessibilityLabel="Nova senha. Use pelo menos 8 caracteres."
          value={senha}
          onChangeText={alterarSenha}
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="Pelo menos 8 caracteres"
          placeholderTextColor="#536960"
          style={styles.campo}
        />

        <Text style={styles.rotulo}>Confirme a nova senha</Text>

        <TextInput
          accessibilityLabel="Confirme a nova senha"
          value={confirmacao}
          onChangeText={alterarConfirmacao}
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="Repita a nova senha"
          placeholderTextColor="#536960"
          returnKeyType="done"
          onSubmitEditing={salvar}
          style={styles.campo}
        />

        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Mostrar senhas"
          accessibilityState={{checked: mostrarSenha}}
          onPress={alternarMostrarSenha}
          style={styles.mostrarSenha}>
          <View
            accessible={false}
            style={[
              styles.checkbox,
              mostrarSenha && styles.checkboxMarcado,
            ]}>
            {mostrarSenha && <Text style={styles.check}>✓</Text>}
          </View>

          <Text style={styles.descricao}>Mostrar senhas</Text>
        </Pressable>

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
          onPress={salvar}
          style={styles.principal}>
          <Text style={styles.principalTexto}>
            Salvar nova senha
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}