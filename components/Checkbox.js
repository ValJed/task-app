import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';

export default ({ onToggle, done }) => {
  const onPress = () => {
    onToggle();
  };
  return (
    <Pressable onPress={onPress}>
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
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 24,
    height: 24,
  },
});
