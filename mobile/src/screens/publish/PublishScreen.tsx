import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile } from 'firebase/auth'; // just in case
import CustomButton from '../../components/atoms/CustomButton';
import CustomInput from '../../components/atoms/CustomInput';
import Badge from '../../components/atoms/Badge';
import { Colors } from '../../constants/colors';
import { Spacing, Radius, Shadow } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';
import { categories } from '../../data/categories';
import { chileanRegions } from '../../data/chileanLocations';
import { PRODUCT_CONDITIONS } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { createProduct } from '../../services/productService';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const PublishScreen = () => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [region, setRegion] = useState('');
  const [wantsInReturn, setWantsInReturn] = useState('');
  const [acceptableItem, setAcceptableItem] = useState('');
  const [acceptableItems, setAcceptableItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Límite alcanzado', 'Puedes subir máximo 5 fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const imgData = result.assets[0].base64
        ? `data:image/jpeg;base64,${result.assets[0].base64}`
        : result.assets[0].uri;
      setImages([...images, imgData]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) {
      Alert.alert('Límite alcanzado', 'Puedes subir máximo 5 fotos');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const imgData = result.assets[0].base64
        ? `data:image/jpeg;base64,${result.assets[0].base64}`
        : result.assets[0].uri;
      setImages([...images, imgData]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAcceptableItem = () => {
    if (acceptableItem.trim() && acceptableItems.length < 6) {
      setAcceptableItems([...acceptableItems, acceptableItem.trim()]);
      setAcceptableItem('');
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !condition || !wantsInReturn) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para publicar');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      try {
        if (images.length > 0) {
          imageUrls = await Promise.all(
            images.map(async (uri, index) => {
              const response = await fetch(uri);
              const blob = await response.blob();
              const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${index}.jpg`);
              await uploadBytes(storageRef, blob);
              return await getDownloadURL(storageRef);
            })
          );
        } else {
          imageUrls = [`https://picsum.photos/seed/${Date.now()}/600/600`];
        }
      } catch (storageError) {
        console.warn("Storage exception", storageError);
        imageUrls = [`https://picsum.photos/seed/${Date.now()}/600/600`];
      }

      // Save product to Firestore
      await createProduct({
        title,
        description,
        category,
        condition: condition as any,
        wantsInReturn,
        acceptableItems,
        user: {
          id: user.uid,
          name: user.displayName || 'Usuario',
          initials: (user.displayName || 'U').substring(0, 2).toUpperCase(),
          location: 'Santiago',
          region: region || 'Región Metropolitana',
          rating: 5,
          totalReviews: 0,
          totalSwaps: 0,
          memberSince: '2026',
          bio: 'Usuario nuevo',
          verified: true,
          responseRate: 100,
          responseTime: '1 hora'
        }
      }, imageUrls);

      setIsSubmitting(false);

      if (Platform.OS === 'web') {
        window.alert('¡Publicado! Tu artículo ya está visible para otros usuarios.');
        setImages([]);
        setTitle('');
        setDescription('');
        setCategory('');
        setCondition('');
        setRegion('');
        setWantsInReturn('');
        setAcceptableItems([]);
      } else {
        Alert.alert(
          '¡Publicado! 🎉',
          'Tu artículo ya está visible para otros usuarios.',
          [{
            text: 'Genial', onPress: () => {
              setImages([]);
              setTitle('');
              setDescription('');
              setCategory('');
              setCondition('');
              setRegion('');
              setWantsInReturn('');
              setAcceptableItems([]);
            }
          }]
        );
      }
    } catch (error) {
      console.error("Publish error:", error);
      setIsSubmitting(false);
      if (Platform.OS === 'web') {
        window.alert('Error: Hubo un problema al publicar el artículo');
      } else {
        Alert.alert('Error', 'Hubo un problema al publicar el artículo');
      }
    }
  };

  const PickerDropdown = ({
    show,
    options,
    selected,
    onSelect,
    onToggle,
    placeholder,
    icon,
  }: {
    show: boolean;
    options: { label: string; value: string }[];
    selected: string;
    onSelect: (val: string) => void;
    onToggle: () => void;
    placeholder: string;
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <View>
      <TouchableOpacity style={styles.pickerButton} onPress={onToggle}>
        <Ionicons name={icon} size={20} color={selected ? Colors.primary : Colors.textMuted} />
        <Text style={[styles.pickerText, !selected && styles.pickerPlaceholder]}>
          {selected || placeholder}
        </Text>
        <Ionicons name={show ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textMuted} />
      </TouchableOpacity>
      {show && (
        <View style={styles.pickerList}>
          <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled={true}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => { onSelect(opt.value); onToggle(); }}
                style={[styles.pickerOption, selected === opt.value && styles.pickerOptionActive]}
              >
                <Text style={[styles.pickerOptionText, selected === opt.value && styles.pickerOptionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Publicar artículo</Text>
        <Text style={styles.headerSubtitle}>Comparte lo que quieres permutar</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image area */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Fotos *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imageRow}>
                {images.map((uri, i) => (
                  <View key={i} style={styles.imageThumb}>
                    <Image source={{ uri }} style={styles.thumbImage} />
                    <TouchableOpacity
                      onPress={() => removeImage(i)}
                      style={styles.removeImageButton}
                    >
                      <Ionicons name="close" size={14} color={Colors.textInverse} />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < 5 && (
                  <View style={styles.addImageButtons}>
                    <TouchableOpacity onPress={pickImage} style={styles.addImageButton}>
                      <Ionicons name="images-outline" size={24} color={Colors.primary} />
                      <Text style={styles.addImageText}>Galería</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePhoto} style={styles.addImageButton}>
                      <Ionicons name="camera-outline" size={24} color={Colors.primary} />
                      <Text style={styles.addImageText}>Cámara</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
            <Text style={styles.imageHint}>{images.length}/5 fotos · JPG, PNG</Text>
          </View>

          {/* Title */}
          <CustomInput
            label="Título del artículo *"
            placeholder="Ej: Guitarra acústica Yamaha"
            value={title}
            onChangeText={setTitle}
            icon="pricetag-outline"
          />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descripción *</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe tu artículo: estado, marca, tamaño..."
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Category & Condition */}
          <View style={styles.rowPickers}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Categoría *</Text>
              <PickerDropdown
                show={showCategoryPicker}
                options={categories.filter(c => c.label !== 'Todo').map(c => ({ label: c.label, value: c.label }))}
                selected={category}
                onSelect={setCategory}
                onToggle={() => { setShowCategoryPicker(!showCategoryPicker); setShowConditionPicker(false); setShowRegionPicker(false); }}
                placeholder="Seleccionar"
                icon="grid-outline"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Condición *</Text>
              <PickerDropdown
                show={showConditionPicker}
                options={PRODUCT_CONDITIONS.map(c => ({ label: c, value: c }))}
                selected={condition}
                onSelect={setCondition}
                onToggle={() => { setShowConditionPicker(!showConditionPicker); setShowCategoryPicker(false); setShowRegionPicker(false); }}
                placeholder="Seleccionar"
                icon="shield-checkmark-outline"
              />
            </View>
          </View>

          {/* Region */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Región</Text>
            <PickerDropdown
              show={showRegionPicker}
              options={chileanRegions.map(r => ({ label: r, value: r }))}
              selected={region}
              onSelect={setRegion}
              onToggle={() => { setShowRegionPicker(!showRegionPicker); setShowCategoryPicker(false); setShowConditionPicker(false); }}
              placeholder="Selecciona tu región"
              icon="location-outline"
            />
          </View>

          {/* Wants in return */}
          <CustomInput
            label="¿Qué buscas a cambio? *"
            placeholder="Ej: Mochila de trekking"
            value={wantsInReturn}
            onChangeText={setWantsInReturn}
            icon="swap-horizontal-outline"
          />

          {/* Acceptable items */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Artículos aceptables (opcional)</Text>
            <View style={styles.addItemRow}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  placeholder="Agrega opciones..."
                  value={acceptableItem}
                  onChangeText={setAcceptableItem}
                  onSubmitEditing={addAcceptableItem}
                />
              </View>
              <TouchableOpacity
                onPress={addAcceptableItem}
                style={styles.addItemButton}
              >
                <Ionicons name="add" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {acceptableItems.length > 0 && (
              <View style={styles.chipRow}>
                {acceptableItems.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setAcceptableItems(acceptableItems.filter((_, idx) => idx !== i))}
                    style={styles.chip}
                  >
                    <Text style={styles.chipText}>{item}</Text>
                    <Ionicons name="close" size={14} color={Colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Submit */}
          <View style={styles.submitSection}>
            <CustomButton
              title="Publicar artículo"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!title || !description || !category || !condition || !wantsInReturn}
              fullWidth
              size="lg"
              icon="checkmark-circle-outline"
            />
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.base,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  imageRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  imageThumb: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  addImageButton: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addImageText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  imageHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  textAreaContainer: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  textArea: {
    fontSize: FontSize.base,
    color: Colors.text,
    minHeight: 100,
  },
  rowPickers: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
  },
  pickerText: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  pickerPlaceholder: {
    color: Colors.textMuted,
  },
  pickerList: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    ...Shadow.md,
  },
  pickerOption: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  pickerOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  pickerOptionText: {
    fontSize: FontSize.base,
    color: Colors.text,
  },
  pickerOptionTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  addItemButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  submitSection: {
    marginTop: Spacing.xl,
  },
});

export default PublishScreen;
