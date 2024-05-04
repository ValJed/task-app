import { Text, View, StyleSheet } from 'react-native';

export default ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.loading}>{text}</Text>
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
