import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CategoryChip from '../atoms/CategoryChip';
import { categories } from '../../data/categories';
import { Spacing } from '../../constants/layout';

interface CategoryFilterProps {
  active: string;
  onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ active, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map(({ icon, label }) => (
        <CategoryChip
          key={label}
          label={label}
          icon={icon as keyof typeof Ionicons.glyphMap}
          active={active === label}
          onPress={() => onSelect(label)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});

export default CategoryFilter;
