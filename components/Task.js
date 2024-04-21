import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import CheckBox from './Checkbox';
import { colors } from '../styles';

export default ({ id, content, done, onToggle, onDelete }) => {
  const toggle = () => {
    onToggle(id, done);
  };

  return (
    <View style={styles.item}>
      <CheckBox done={done} onToggle={toggle} />
      <Text style={styles.text}>{content}</Text>
      <Pressable onPress={() => onDelete(id)}>
        <Image style={styles.delete} source={require('../assets/delete.png')} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: colors.text1,
    marginLeft: 10,
    flex: 1,
  },
  delete: {
    width: 28,
    height: 28,
  },
});
