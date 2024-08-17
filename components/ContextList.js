import { useQueryClient } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native';

import Context from './Context';

export default ({ contexts, deleteContext, updateItemContent, isPending }) => {
  const queryClient = useQueryClient();
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
      refreshControl={
        <RefreshControl
          refreshing={isPending}
          onRefresh={() =>
            queryClient.invalidateQueries(['contexts', 'apiData'])
          }
        />
      }
    />
  );
};
