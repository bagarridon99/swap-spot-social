import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput from '../../components/atoms/CustomInput';
import { Colors } from '../../constants/colors';
import { Spacing, Radius, Shadow } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';
import { chileanRegions } from '../../data/chileanLocations';

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterNavProp>();
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [region, setRegion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleRegister = async () => {
    setValidationError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError('Completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(email.trim(), password, { name: name.trim(), region });
    } catch {
      // error handled by context
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.secondary, Colors.primaryDark, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topGradient}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textInverse} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
          <Text style={styles.headerSubtitle}>Únete a la comunidad de trueque</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, Shadow.xl]}>
            {(error || validationError) && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error || validationError}</Text>
                <TouchableOpacity onPress={() => { clearError(); setValidationError(''); }}>
                  <Ionicons name="close" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            )}

            <CustomInput
              label="Nombre completo"
              placeholder="Ej: María García"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              icon="person-outline"
            />

            <CustomInput
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              icon="mail-outline"
            />

            <CustomInput
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              icon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <CustomInput
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              icon="lock-closed-outline"
            />

            {/* Region selector */}
            <View style={styles.regionContainer}>
              <Text style={styles.regionLabel}>Región (opcional)</Text>
              <TouchableOpacity
                style={styles.regionSelector}
                onPress={() => setShowRegions(!showRegions)}
              >
                <Ionicons name="location-outline" size={20} color={region ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.regionText, !region && styles.regionPlaceholder]}>
                  {region || 'Selecciona tu región'}
                </Text>
                <Ionicons
                  name={showRegions ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
              {showRegions && (
                <View style={styles.regionList}>
                  {chileanRegions.map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => { setRegion(r); setShowRegions(false); }}
                      style={[styles.regionOption, region === r && styles.regionOptionActive]}
                    >
                      <Text style={[styles.regionOptionText, region === r && styles.regionOptionTextActive]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={{ height: Spacing.base }} />

            <CustomButton
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={isLoading}
              disabled={!name.trim() || !email.trim() || !password || !confirmPassword}
              fullWidth
              icon="checkmark-circle-outline"
            />
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topGradient: {
    paddingTop: 56,
    paddingBottom: 45,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: Spacing.base,
    padding: Spacing.sm,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textInverse,
  },
  headerSubtitle: {
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.8)',
  },
  formWrapper: {
    flex: 1,
    marginTop: -25,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.base,
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  regionContainer: {
    marginBottom: Spacing.base,
  },
  regionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  regionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    height: 52,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
  },
  regionText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  regionPlaceholder: {
    color: Colors.textMuted,
  },
  regionList: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    maxHeight: 200,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  regionOption: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  regionOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  regionOptionText: {
    fontSize: FontSize.base,
    color: Colors.text,
  },
  regionOptionTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});

export default RegisterScreen;
