import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FeedStackParamList } from '../../navigation/types';
import { Product } from '../../types';
import { getProducts, SupabaseProduct } from '../../services/productService';
import { fetchSavedIds, toggleSavedItem } from '../../services/savedItemsService';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/molecules/ProductCard';
import SearchBar from '../../components/molecules/SearchBar';
import CategoryFilter from '../../components/organisms/CategoryFilter';
import { Colors } from '../../constants/colors';
import { Spacing, Shadow } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

type FeedNavProp = NativeStackNavigationProp<FeedStackParamList, 'FeedHome'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.base * 3) / 2;

const mapToProduct = (p: SupabaseProduct): Product => ({
  id: p.id!,
  imageUrl: p.imageUrl,
  title: p.title,
  description: p.description,
  wantsInReturn: p.wantsInReturn,
  acceptableItems: p.acceptableItems || [],
  condition: p.condition,
  category: p.category,
  createdAt: p.createdAt || '',
  userId: p.userId,
  userName: p.userName || 'Usuario',
  userInitials: p.userInitials || 'US',
  location: p.location,
  region: p.region,
  boosted: p.boosted,
});

const FeedScreen = () => {
  const navigation = useNavigation<FeedNavProp>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [refreshing, setRefreshing] = useState(false);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductsData = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data.map(mapToProduct));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products
  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  // Load saved items from Supabase
  useEffect(() => {
    if (!user) return;
    fetchSavedIds(user.id).then(setSavedItems).catch(console.error);
  }, [user]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'Todo' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductsData();
    if (user) {
      const ids = await fetchSavedIds(user.id);
      setSavedItems(ids);
    }
    setRefreshing(false);
  }, [fetchProductsData, user]);

  const handleToggleSave = async (id: string) => {
    if (!user) return;
    const currentlySaved = savedItems.has(id);

    // Optimistic update
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (currentlySaved) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await toggleSavedItem(user.id, id, currentlySaved);
    } catch {
      // Revert
      setSavedItems((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        width={CARD_WIDTH}
        saved={savedItems.has(item.id)}
        onToggleSave={() => handleToggleSave(item.id)}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
    ),
    [savedItems, navigation]
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.appTitle}>PermutApp</Text>
          <Text style={styles.appSubtitle}>Descubre artículos para permutar</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={[styles.iconButton, Shadow.sm]}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
          </View>
        </View>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar artículos para permutar..."
      />
      <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
      <Text style={styles.resultsText}>
        {filteredProducts.length} artículo{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No se encontraron artículos</Text>
      <Text style={styles.emptySubtitle}>Intenta con otra búsqueda o categoría</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.base }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    gap: Spacing.base,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
  },
  appSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  resultsText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    paddingTop: Spacing.xs,
  },
  row: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.base,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.massive,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
});

export default FeedScreen;
