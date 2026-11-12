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

import {useLogin} from '../hooks/useLogin';
import {styles} from '../styles/loginStyless';

type Props = {
  onEntrar: () => void;
  onCadastrar: () => void;
  onRecuperarSenha: () => void;
};

export default function Login({
  onEntrar,
  onCadastrar,
  onRecuperarSenha,
}: Props) {
  const {
    email,
    senha,
    mostrarSenha,
    erro,
    alterarEmail,
    alterarSenha,
    alternarMostrarSenha,
    entrar,
  } = useLogin(onEntrar);

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.marca}>LIMIAR</Text>

        <Text accessibilityRole="header" style={styles.titulo}>
          Entrar
        </Text>

        <Text style={styles.descricao}>
          Acesse sua conta.
        </Text>

        <Text style={styles.rotulo}>E-mail</Text>

        <TextInput
          accessibilityLabel="E-mail"
          value={email}
          onChangeText={alterarEmail}
          placeholder="voce@exemplo.com"
          placeholderTextColor="#536960"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="username"
          style={styles.campo}
        />

        <Text style={styles.rotulo}>Senha</Text>

        <TextInput
          accessibilityLabel="Senha"
          value={senha}
          onChangeText={alterarSenha}
          placeholder="Digite sua senha"
          placeholderTextColor="#536960"
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={entrar}
          style={styles.campo}
        />

        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Mostrar senha"
          accessibilityState={{checked: mostrarSenha}}
          onPress={alternarMostrarSenha}
          style={styles.mostrarSenha}>
          <View
            accessible={false}
            style={[
              styles.checkbox,
              mostrarSenha && styles.checkboxMarcado,
            ]}>
            {mostrarSenha && (
              <Text style={styles.check}>✓</Text>
            )}
          </View>

          <Text style={styles.descricao}>Mostrar senha</Text>
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
          onPress={entrar}
          style={styles.principal}>
          <Text style={styles.principalTexto}>Entrar</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onRecuperarSenha}
          style={styles.linkBotao}>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onCadastrar}
          style={styles.linkBotao}>
          <Text style={styles.link}>
            Caso não tenha conta, cadastrar
          </Text>
        </Pressable>


        <Text style={styles.rodape}>
          Esta demonstração não faz diagnóstico.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}