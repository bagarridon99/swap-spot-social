import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FeedStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { getOrCreateConversation } from '../../services/chatService';
import { deleteProduct } from '../../services/productService';
import Avatar from '../../components/atoms/Avatar';
import Badge from '../../components/atoms/Badge';
import CustomButton from '../../components/atoms/CustomButton';
import { Colors } from '../../constants/colors';
import { Spacing, Radius, Shadow } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

type DetailRoute = RouteProp<FeedStackParamList, 'ProductDetail'>;
const SCREEN_WIDTH = Dimensions.get('window').width;

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const insets = useSafeAreaInsets();
  const { product } = route.params;
  const { user } = useAuth();
  const [isCreatingChat, setIsCreatingChat] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isOwner = user?.id === product.userId;

  const handleProposeSwap = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para proponer un trueque.');
      return;
    }
    if (isOwner) {
      Alert.alert('Aviso', 'Este es tu propio producto.');
      return;
    }

    setIsCreatingChat(true);
    try {
      const initials = user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
      const convId = await getOrCreateConversation(
        user.id,
        user.displayName,
        initials,
        product.userId,
        product.userName,
        product.userInitials,
      );

      (navigation as any).navigate('ChatTab', {
        screen: 'Chat',
        params: {
          conversationId: convId,
          name: product.userName,
          initials: product.userInitials,
          online: true,
        },
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo abrir el chat');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar publicación',
      `¿Estás seguro de eliminar "${product.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteProduct(product.id);
              Alert.alert('Listo', 'Publicación eliminada');
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const timeAgo = product.createdAt
    ? getTimeAgo(product.createdAt)
    : '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top + 8 }]}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareButton, { top: insets.top + 8 }]}>
            <Ionicons name="share-outline" size={22} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.imageBadges}>
            {product.boosted && (
              <View style={styles.boostedBadge}>
                <Ionicons name="flash" size={12} color={Colors.textInverse} />
                <Text style={styles.boostedText}>Destacado</Text>
              </View>
            )}
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{product.condition}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & category */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{product.title}</Text>
            <Badge text={product.category} variant="secondary" />
          </View>

          {/* Wants in return */}
          <View style={[styles.wantsCard, Shadow.sm]}>
            <View style={styles.wantsHeader}>
              <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
              <Text style={styles.wantsTitle}>Busca a cambio</Text>
            </View>
            <Text style={styles.wantsMain}>{product.wantsInReturn}</Text>

            {product.acceptableItems && product.acceptableItems.length > 0 && (
              <View style={styles.acceptableList}>
                <Text style={styles.acceptableLabel}>También acepta:</Text>
                <View style={styles.chipRow}>
                  {product.acceptableItems.map((item, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* User card */}
          <View style={[styles.userCard, Shadow.sm]}>
            <View style={styles.userRow}>
              <Avatar initials={product.userInitials} size="lg" />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{product.userName}</Text>
                <View style={styles.userLocation}>
                  <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.userLocationText}>
                    {product.location}{product.region ? `, ${product.region}` : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>{timeAgo}</Text>
            </View>
          </View>

          {/* Owner actions */}
          {isOwner && (
            <CustomButton
              title={isDeleting ? 'Eliminando...' : 'Eliminar publicación'}
              onPress={handleDelete}
              variant="danger"
              icon="trash-outline"
              fullWidth
              disabled={isDeleting}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom action bar — only show if NOT owner */}
      {!isOwner && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
          <CustomButton
            title="Proponer Trueque"
            onPress={handleProposeSwap}
            loading={isCreatingChat}
            icon="swap-horizontal"
            fullWidth
            size="lg"
          />
        </View>
      )}
    </View>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days !== 1 ? 's' : ''}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  imageWrapper: { position: 'relative' },
  image: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.9, backgroundColor: Colors.backgroundSecondary },
  backButton: { position: 'absolute', left: Spacing.base, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  shareButton: { position: 'absolute', right: Spacing.base, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', ...Shadow.md },
  imageBadges: { position: 'absolute', bottom: Spacing.base, left: Spacing.base, flexDirection: 'row', gap: Spacing.sm },
  boostedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  boostedText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textInverse },
  conditionBadge: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  conditionText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  titleSection: { gap: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  wantsCard: { backgroundColor: Colors.primaryLight, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '20' },
  wantsHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  wantsTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.primary },
  wantsMain: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  acceptableList: { gap: Spacing.sm },
  acceptableLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  section: { gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  description: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22 },
  userCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.border },
  userRow: { flexDirection: 'row', gap: Spacing.md },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  userLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userLocationText: { fontSize: FontSize.sm, color: Colors.textMuted },
  metaRow: { flexDirection: 'row', gap: Spacing.xl },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted },
  bottomBar: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.borderLight, ...Shadow.lg },
});

export default ProductDetailScreen;
