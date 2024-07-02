import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native';

import { colors } from '../lib/styles';

export default ({ noHeader, apiData, saveApiData }) => {
  const [apiUrl, setApiUrl] = useState(apiData.apiUrl || '');
  const [apiKey, setApiKey] = useState(apiData.apiKey || '');

  return (
    <View style={[styles.menuContainer, { paddingTop: noHeader ? 100 : 0 }]}>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        style={styles.textInput}
        multiline
        onChangeText={setApiUrl}
        placeholder="API url"
        value={apiUrl}
      />
      <TextInput
        style={styles.textInput}
        multiline
        onChangeText={setApiKey}
        placeholder="API key"
        value={apiKey}
      />
      <Pressable style={styles.btn} onPress={() => saveApiData(apiUrl, apiKey)}>
        <Text style={styles.text}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginBottom: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  textInput: {
    marginTop: 40,
    borderColor: '#000000',
    borderRadius: 20,
    borderWidth: 1,
    color: colors.text1,
    padding: 10,
  },
  btn: {
    display: 'flex',
    justifyCcontent: 'center',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: colors.primary,
    textColor: colors.text2,
    padding: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    color: colors.text2,
    fontWeight: 'bold',
  },
});
