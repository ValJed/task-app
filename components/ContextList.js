import { FlatList, StyleSheet } from 'react-native';

import Context from './Context';

export default ({ contexts, deleteContext, updateItemContent }) => {
  return (
    <FlatList
      data={contexts}
      contentContainerStyle={{ paddingBottom: 70 }}
      renderItem={({ item }) => (
        <Context
          context={item}
          deleteContext={deleteContext}
          updateItemContent={updateItemContent}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
