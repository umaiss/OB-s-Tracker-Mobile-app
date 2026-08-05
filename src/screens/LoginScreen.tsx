import React, { useState } from 'react';
const DplLogo = require('../assets/images/dpl-logo.png');
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import CheckboxRow from '../components/CheckboxRow';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { verticalScale } from 'react-native-size-matters';
import { scale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const personIcon = require('../assets/icons/person.png');
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
      setLoading(true);
      setError('');
      try {
        await login(email, password);
      } catch (err) {
        setError('Invalid Email or password.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image style={styles.logo} source={DplLogo} resizeMode="contain" />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Please sign in to continue</Text>
          </View>

          {/* Form Section */}
          <View>
            <InputField
              label="Email"
              leftIcon={personIcon}
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <PasswordInput value={password} onChangeText={setPassword} />

            <CheckboxRow
              checked={rememberMe}
              onToggle={() => setRememberMe(!rememberMe)}
              label="Remember Me"
            />

            <PrimaryButton
              label="LOGIN"
              onPress={handleLogin}
              loading={loading}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For login issues, contact the Admin Department
            </Text>
            <Text style={styles.versionText}>App Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.containerMargin,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: scale(128),
    height: verticalScale(60),
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: spacing.base,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.secondary,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    alignItems: 'center',
    gap: spacing.base,
  },
  footerText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  versionText: {
    ...typography.versionText,
    color: colors.secondary,
    opacity: 0.7,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error ?? '#ba1a1a',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default LoginScreen;