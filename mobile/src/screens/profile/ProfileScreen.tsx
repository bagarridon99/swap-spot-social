import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getUserStats, UserStats } from '../../services/userService';
import { UserProfile } from '../../types';
import Avatar from '../../components/atoms/Avatar';
import Badge from '../../components/atoms/Badge';
import CustomButton from '../../components/atoms/CustomButton';
import { Colors } from '../../constants/colors';
import { Spacing, Radius, Shadow } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      if (confirm) {
        logout();
      }
    } else {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que quieres cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [userStats, setUserStats] = React.useState<UserStats | null>(null);

  useFocusEffect(
    React. useCallback(() => {
      let isActive = true;

      const fetchProfileData = async () => {
        if (!user) return;
        try {
          const p = await getUserProfile(user.uid);
          if (p && isActive) {
            setProfile(p);
            const s = await getUserStats(user.uid, p);
            if (isActive) {
              setUserStats(s);
            }
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };

      fetchProfileData();

      return () => {
        isActive = false;
      };
    }, [user])
  );

  const stats = [
    { label: 'Trueques', value: userStats?.swapsCount?.toString() || '0', icon: 'swap-horizontal' as const },
    { label: 'Reseñas', value: userStats?.reviewsCount?.toString() || '0', icon: 'star' as const },
    { label: 'Publicados', value: userStats?.publishedCount?.toString() || '0', icon: 'pricetag' as const },
  ];

  const menuItems = [
    { icon: 'heart-outline' as const, label: 'Mis favoritos', badge: '3' },
    { icon: 'time-outline' as const, label: 'Historial de trueques' },
    { icon: 'shield-checkmark-outline' as const, label: 'Verificar identidad', badge: 'Nuevo' },
    { icon: 'notifications-outline' as const, label: 'Notificaciones' },
    { icon: 'settings-outline' as const, label: 'Configuración' },
    { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte' },
    { icon: 'document-text-outline' as const, label: 'Términos y condiciones' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile header */}
        <View style={[styles.profileCard, Shadow.md]}>
          <View style={styles.profileHeader}>
            <Avatar
              initials={user?.displayName?.substring(0, 2).toUpperCase() || 'PA'}
              size="xl"
              verified
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.name || user?.displayName || 'Usuario'}</Text>
              <Text style={styles.profileEmail}>{profile?.email || user?.email || 'usuario@email.com'}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#F4B400" />
                <Text style={styles.ratingText}>{userStats?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.ratingCount}>({userStats?.reviewsCount || 0} reseñas)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color={Colors.primary} />
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
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
            {profile?.verified && <Badge text="✓ Verificado" variant="primary" />}
            {(userStats?.swapsCount || 0) >= 5 && <Badge text="⚡ Truequero experto" variant="info" />}
            {(userStats?.rating || 0) >= 4.5 && (userStats?.reviewsCount || 0) > 0 && <Badge text="⭐ Top valorado" variant="warning" />}
            {(!profile?.verified && (userStats?.swapsCount || 0) < 5) && <Text style={{color: Colors.textMuted, fontSize: FontSize.sm}}>Realiza trueques para desbloquear insignias.</Text>}
          </View>

          {/* Progress bar */}
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
          {menuItems.map((item, index) => (
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.base,
  },
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.base,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: Spacing.base,
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  ratingCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  editButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
  },
  badgesCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  progressSection: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  progressBold: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  progressValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  menuBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  menuBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  logoutSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});

export default ProfileScreen;
