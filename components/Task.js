import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CheckBox from './Checkbox';

export default ({ id, content, done, onToggle }) => {
  const toggle = () => {
    onToggle(id, done);
  };

  return (
    <View style={styles.item}>
      <CheckBox done={done} onToggle={toggle} />
      <Text style={styles.itemText}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
  },
  itemText: {
    fontSize: 20,
    color: '#000000',
  },
});
