import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Text, FlatList } from 'react-native';

import Context from './Context';

export default ({ contexts, deleteContext, updateItemContent }) => {
  return (
    <FlatList
      data={contexts}
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
