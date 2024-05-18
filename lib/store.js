import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getApiData() {
  try {
    const apiUrl = await AsyncStorage.getItem('apiUrl');
    const apiKey = await AsyncStorage.getItem('apiKey');

    return {
      apiUrl,
      apiKey,
    };
  } catch (err) {
    console.error('Error getting store data', err);
    return {};
  }
}

export async function storeApiData(apiUrl, apiKey) {
  try {
    await AsyncStorage.setItem('apiUrl', apiUrl);
    await AsyncStorage.setItem('apiKey', apiKey);
  } catch (err) {
    console.error('Error storing API data', err);
  }
}
