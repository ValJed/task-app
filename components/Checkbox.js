import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';

import { colors } from '../lib/styles';

export default ({ onToggle, done }) => {
  return (
    <Pressable onPress={onToggle}>
      <View style={styles.base}>
        {done && (
          <Image style={styles.check} source={require('../assets/check.png')} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.text1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 24,
    height: 24,
  },
});
