import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import CheckBox from './Checkbox';
import { colors } from '../lib/styles';

export default ({
  id,
  content,
  done,
  updateTask,
  deleteTask,
  updateItemContent,
}) => {
  const onToggle = () => {
    updateTask({ id, done: !done });
  };

  return (
    <View style={styles.item}>
      <CheckBox done={done} onToggle={onToggle} />
      <Pressable
        style={styles.textcontainer}
        onPress={() => {
          updateItemContent({ id, content });
        }}
      >
        <Text style={styles.text}>{content}</Text>
      </Pressable>
      <Pressable onPress={() => deleteTask(id)}>
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
  textcontainer: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: colors.text1,
    marginLeft: 10,
  },
  delete: {
    width: 28,
    height: 28,
  },
});
