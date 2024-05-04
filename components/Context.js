import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

import { colors } from '../lib/styles';

export default ({ context, deleteContext }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{context.name}</Text>
      <Pressable onPress={() => deleteContext(context.id)}>
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
