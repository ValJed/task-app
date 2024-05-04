import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Text, FlatList } from 'react-native';

import Context from './Context';

export default ({ contexts, deleteContext }) => {
  return (
    <FlatList
      data={contexts}
      renderItem={({ item }) => (
        <Context context={item} deleteContext={deleteContext} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
