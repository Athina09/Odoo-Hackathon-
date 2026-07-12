import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  onLogin: () => void;
};

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = () => {
    const demoEmail = 'employee@ecosphere.com';
    const demoPassword = 'Eco@123';

    if (!email.trim() || !password.trim()) {
      Alert.alert('Almost there', 'Please enter your email and password.');
      return;
    }

    if (
      email.trim().toLowerCase() === demoEmail &&
      password === demoPassword
    ) {
      Alert.alert('Welcome back!', 'Login successful. Hello, Metrix!', [
        { text: 'Continue', onPress: onLogin },
      ]);
      return;
    }

    Alert.alert(
      'Login failed',
      'Incorrect details.\n\nUse:\nEmail: employee@ecosphere.com\nPassword: Eco@123'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.earth}>🌍</Text>
          </View>
          <Text style={styles.brand}>EcoSphere</Text>
        </View>

        <Text style={styles.headerTitle}>Make an impact.</Text>
        <Text style={styles.headerText}>
          Every small action creates a greener future.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.loginCard}>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.description}>
            Sign in to continue your sustainability journey.
          </Text>

          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>✉</Text>
            <TextInput
              style={styles.input}
              placeholder="you@company.com"
              placeholderTextColor="#8AA0B1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={[styles.label, styles.passwordLabel]}>PASSWORD</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>●</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#8AA0B1"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => Alert.alert('Forgot password', 'Coming soon!')}
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>

          <Pressable style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>Log in</Text>
            <Text style={styles.loginArrow}>›</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            style={styles.googleButton}
            onPress={() => Alert.alert('Google sign-in', 'Coming soon!')}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </Pressable>

          <View style={styles.createRow}>
            <Text style={styles.newText}>New to EcoSphere? </Text>
            <Pressable
              onPress={() => Alert.alert('Create account', 'Coming soon!')}
            >
              <Text style={styles.createText}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFC',
  },
  header: {
    height: 300,
    paddingTop: 58,
    paddingHorizontal: 26,
    overflow: 'hidden',
    backgroundColor: '#124D78',
  },
  headerWave: {
    position: 'absolute',
    width: 430,
    height: 270,
    top: -90,
    right: -150,
    borderRadius: 220,
    backgroundColor: '#3B87B8',
    opacity: 0.5,
    transform: [{ rotate: '-20deg' }],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  earth: {
    fontSize: 27,
  },
  brand: {
    marginLeft: 11,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  headerTitle: {
    marginTop: 54,
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
  },
  headerText: {
    width: 240,
    marginTop: 9,
    color: '#D9F2FF',
    fontSize: 14,
    lineHeight: 21,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loginCard: {
    marginTop: -52,
    padding: 23,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EDF2',
  },
  welcome: {
    color: '#183B54',
    fontSize: 25,
    fontWeight: '800',
  },
  description: {
    marginTop: 7,
    marginBottom: 26,
    color: '#70899A',
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: '#49677D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  passwordLabel: {
    marginTop: 20,
  },
  inputBox: {
    height: 55,
    marginTop: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE8EF',
    borderRadius: 15,
    backgroundColor: '#FAFCFD',
  },
  inputIcon: {
    width: 25,
    color: '#4D87AA',
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: '#183B54',
    fontSize: 15,
  },
  showText: {
    color: '#236FA4',
    fontSize: 13,
    fontWeight: '800',
  },
  forgot: {
    marginTop: 14,
    alignSelf: 'flex-end',
    color: '#236FA4',
    fontSize: 13,
    fontWeight: '700',
  },
  loginButton: {
    height: 56,
    marginTop: 28,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#124D78',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  loginArrow: {
    position: 'absolute',
    right: 21,
    color: '#A9ECA1',
    fontSize: 29,
    fontWeight: '400',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E9EE',
  },
  orText: {
    marginHorizontal: 13,
    color: '#8AA0B1',
    fontSize: 10,
    fontWeight: '800',
  },
  googleButton: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCE8EF',
  },
  googleIcon: {
    marginRight: 11,
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '900',
  },
  googleText: {
    color: '#294B62',
    fontSize: 14,
    fontWeight: '700',
  },
  createRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  newText: {
    color: '#70899A',
    fontSize: 13,
  },
  createText: {
    color: '#236FA4',
    fontSize: 13,
    fontWeight: '800',
  },
});