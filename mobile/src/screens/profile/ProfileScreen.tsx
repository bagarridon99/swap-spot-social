import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  getUserProfile,
  getUserStats,
  updateProfile,
  UserProfile,
  UserStats,
} from '../../services/userService';
import Avatar from '../../components/atoms/Avatar';
import Badge from '../../components/atoms/Badge';
import CustomButton from '../../components/atoms/CustomButton';
import { Colors } from '../../constants/colors';
import { Spacing, Radius, Shadow } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) logout();
    } else {
      Alert.alert('Cerrar sesión', '¿Estás seguro?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
      ]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchProfileData = async () => {
        if (!user) return;
        try {
          const p = await getUserProfile(user.id);
          if (p && isActive) {
            setProfile(p);
            setEditName(p.displayName);
            setEditLocation(p.location);
            const s = await getUserStats(user.id);
            if (isActive) setUserStats(s);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };

      fetchProfileData();
      return () => { isActive = false; };
    }, [user])
  );

  const handleSaveProfile = async () => {
    if (!user || !editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        displayName: editName.trim(),
        location: editLocation.trim(),
      });
      setProfile((prev) => prev ? { ...prev, displayName: editName.trim(), location: editLocation.trim() } : prev);
      setEditing(false);
      Alert.alert('¡Listo!', 'Perfil actualizado');
    } catch {
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Trueques', value: userStats?.swapsCount?.toString() || '0', icon: 'swap-horizontal' as const },
    { label: 'Reseñas', value: userStats?.reviewsCount?.toString() || '0', icon: 'star' as const },
    { label: 'Publicados', value: userStats?.publishedCount?.toString() || '0', icon: 'pricetag' as const },
  ];

  const menuItems = [
    { icon: 'heart-outline' as const, label: 'Mis favoritos' },
    { icon: 'time-outline' as const, label: 'Historial de trueques' },
    { icon: 'shield-checkmark-outline' as const, label: 'Verificar identidad', badge: 'Nuevo' },
    { icon: 'notifications-outline' as const, label: 'Notificaciones' },
    { icon: 'settings-outline' as const, label: 'Configuración' },
    { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile header */}
        <View style={[styles.profileCard, Shadow.md]}>
          <View style={styles.profileHeader}>
            <Avatar
              initials={profile?.displayName?.substring(0, 2).toUpperCase() || user?.displayName?.substring(0, 2).toUpperCase() || 'PA'}
              size="xl"
            />
            <View style={styles.profileInfo}>
              {editing ? (
                <View style={styles.editFields}>
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Nombre"
                    style={styles.editInput}
                    maxLength={50}
                  />
                  <TextInput
                    value={editLocation}
                    onChangeText={setEditLocation}
                    placeholder="Ubicación (ej: Providencia)"
                    style={styles.editInput}
                    maxLength={100}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.profileName}>{profile?.displayName || user?.displayName || 'Usuario'}</Text>
                  <Text style={styles.profileEmail}>{profile?.email || user?.email || ''}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#F4B400" />
                    <Text style={styles.ratingText}>{userStats?.rating?.toFixed(1) || '0.0'}</Text>
                    <Text style={styles.ratingCount}>({userStats?.reviewsCount || 0} reseñas)</Text>
                  </View>
                  {profile?.location ? (
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                      <Text style={styles.locationText}>
                        {profile.location}{profile.region ? `, ${profile.region}` : ''}
                      </Text>
                    </View>
                  ) : null}
                </>
              )}
            </View>
          </View>

          {editing ? (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={saving}>
                <Ionicons name="checkmark" size={18} color={Colors.textInverse} />
                <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)} disabled={saving}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, Shadow.sm]}>
          {stats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <View style={styles.statIconCircle}>
                  <Ionicons name={stat.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {index < stats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Badges */}
        <View style={[styles.badgesCard, Shadow.sm]}>
          <Text style={styles.sectionTitle}>Tus insignias</Text>
          <View style={styles.badgeRow}>
            {(userStats?.swapsCount || 0) >= 5 && <Badge text="⚡ Truequero experto" variant="info" />}
            {(userStats?.rating || 0) >= 4.5 && (userStats?.reviewsCount || 0) > 0 && <Badge text="⭐ Top valorado" variant="warning" />}
            {(userStats?.swapsCount || 0) < 5 && (
              <Text style={{ color: Colors.textMuted, fontSize: FontSize.sm }}>
                Realiza trueques para desbloquear insignias.
              </Text>
            )}
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Próxima: <Text style={styles.progressBold}>Super Truequero</Text>
              </Text>
              <Text style={styles.progressValue}>{userStats?.swapsCount || 0}/20 trueques</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(((userStats?.swapsCount || 0) / 20) * 100, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.menuCard, Shadow.sm]}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.6}>
              <View style={styles.menuIconCircle}>
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <CustomButton
            title="Cerrar sesión"
            onPress={handleLogout}
            variant="danger"
            icon="log-out-outline"
            fullWidth
          />
          <Text style={styles.versionText}>PermutApp v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: 120, gap: Spacing.base },
  profileCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.base },
  profileHeader: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center' },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  profileEmail: { fontSize: FontSize.sm, color: Colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  ratingCount: { fontSize: FontSize.sm, color: Colors.textMuted },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: FontSize.sm, color: Colors.textMuted },
  editFields: { gap: Spacing.sm },
  editInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  editButtonText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.primary },
  editActions: { flexDirection: 'row', gap: Spacing.sm },
  saveButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.primary },
  saveButtonText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textInverse },
  cancelButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  cancelButtonText: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.textMuted },
  statsCard: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  statDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  badgesCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  progressSection: { gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.backgroundSecondary },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  progressBold: { fontWeight: FontWeight.semibold, color: Colors.text },
  progressValue: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.primary },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: Colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.primary },
  menuCard: { backgroundColor: Colors.card, borderRadius: Radius.xl, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.base, paddingHorizontal: Spacing.lg, gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.text },
  menuBadge: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm + 2, paddingVertical: 2, borderRadius: Radius.full },
  menuBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textInverse },
  logoutSection: { gap: Spacing.md, marginTop: Spacing.sm, alignItems: 'center' },
  versionText: { fontSize: FontSize.sm, color: Colors.textMuted },
});

export default ProfileScreen;
