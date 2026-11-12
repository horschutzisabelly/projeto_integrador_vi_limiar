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

import {useSignup} from '../hooks/useCadastro';
import {styles} from '../styles/cadastroStyles';

type Props = {
  onVoltarLogin: () => void;
  onCadastroConcluido: () => void;
};

export default function Cadastro({
  onVoltarLogin,
  onCadastroConcluido,
}: Props) {
  const {
    dados,
    erro,
    mostrarSenha,
    alterar,
    cadastrar,
    alternarMostrarSenha,
  } = useSignup(onCadastroConcluido);

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.marca}>LIMIAR</Text>

        <Pressable
          accessibilityRole="button"
          onPress={onVoltarLogin}
          style={styles.linkBotao}>
          <Text style={styles.link}>← Voltar para entrar</Text>
        </Pressable>

        <Text accessibilityRole="header" style={styles.titulo}>
          Crie sua conta.
        </Text>

        <Text style={styles.rotulo}>Nome</Text>

        <TextInput
          accessibilityLabel="Nome"
          value={dados.nome}
          onChangeText={valor => alterar('nome', valor)}
          autoComplete="given-name"
          textContentType="givenName"
          autoCapitalize="words"
          placeholder="Seu nome"
          placeholderTextColor="#536960"
          style={styles.campo}
        />

        <Text style={styles.rotulo}>Sobrenome</Text>

        <TextInput
          accessibilityLabel="Sobrenome"
          value={dados.sobrenome}
          onChangeText={valor => alterar('sobrenome', valor)}
          autoComplete="family-name"
          textContentType="familyName"
          autoCapitalize="words"
          placeholder="Seu sobrenome"
          placeholderTextColor="#536960"
          style={styles.campo}
        />

        <Text style={styles.rotulo}>E-mail</Text>

        <TextInput
          accessibilityLabel="E-mail"
          value={dados.email}
          onChangeText={valor => alterar('email', valor)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          placeholder="voce@exemplo.com"
          placeholderTextColor="#536960"
          style={styles.campo}
        />

        <Text style={styles.rotulo}>Senha</Text>

        <TextInput
          accessibilityLabel="Senha. Use pelo menos 8 caracteres."
          value={dados.senha}
          onChangeText={valor => alterar('senha', valor)}
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="Pelo menos 8 caracteres"
          placeholderTextColor="#536960"
          style={styles.campo}
        />

        <Text style={styles.rotulo}>Confirme a senha</Text>

        <TextInput
          accessibilityLabel="Confirme a senha"
          value={dados.confirmacao}
          onChangeText={valor => alterar('confirmacao', valor)}
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={cadastrar}
          placeholder="Repita a senha"
          placeholderTextColor="#536960"
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
          onPress={cadastrar}
          style={styles.principal}>
          <Text style={styles.principalTexto}>Cadastrar</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}