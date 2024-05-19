import { Text, View, StyleSheet } from 'react-native';

export default ({ header, text }) => (
  <View style={styles.container}>
    <Text>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
