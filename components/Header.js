import { Picker } from '@react-native-picker/picker';
import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';

import { colors } from '../styles';

export default ({ contextId, contexts, toggleContext }) => {
  const pickerRef = useRef();

  const getCurrentName = () =>
    contexts.find((c) => c.id === contextId)?.name || 'Select a context';

  const current = {
    id: contextId,
    name: getCurrentName(),
  };

  const pickerItems = contexts.map(({ id, name }) => (
    <Picker.Item key={id} label={name} value={id} />
  ));
  const openPicker = () => {
    pickerRef.current.focus();
  };

  return (
    <View style={styles.header}>
      <View style={styles.select}>
        <Pressable onPress={openPicker}>
          <Text style={styles.headerText}>{current.name}</Text>
        </Pressable>
        <Image
          style={styles.selectImg}
          source={require('../assets/chevron.png')}
        />
      </View>
      <Picker
        ref={pickerRef}
        style={styles.headerText}
        selectedValue={current.id}
        onValueChange={(value) => toggleContext(value)}
      >
        {pickerItems}
      </Picker>
      <Pressable
        onPress={() => {
          console.log('press');
        }}
      >
        <Image style={styles.image} source={require('../assets/menu.png')} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 20,
    width: '100%',
  },
  select: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectImg: {
    width: 16,
    height: 16,
    marginLeft: 10,
  },
  headerText: {
    color: colors.text2,
    fontSize: 20,
    textAlign: 'left',
  },
  image: {
    width: 32,
    height: 32,
  },
});
