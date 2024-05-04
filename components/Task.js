import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

import CheckBox from './Checkbox';
import { updateTask, deleteTask } from '../lib/api';
import { colors } from '../lib/styles';

export default ({ id, content, done, mutateDone, mutateDelete }) => {
  const onToggle = () => {
    mutateDone({ id, done: !done });
  };

  return (
    <View style={styles.item}>
      <CheckBox done={done} onToggle={onToggle} />
      <Text style={styles.text}>{content}</Text>
      <Pressable onPress={() => mutateDelete(id)}>
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
