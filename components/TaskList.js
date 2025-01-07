import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import Loading from './Loading';
import Task from './Task';

export default ({
  context,
  updateTask,
  updateItemContent,
  fetchTasks,
  deleteTask,
}) => {
  const queryClient = useQueryClient();
  const {
    isPending,
    isError,
    error,
    data: tasks,
  } = useQuery({
    queryKey: ['tasks', context.id],
    queryFn: () => fetchTasks(context.id),
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteTask,
    onSuccess: (result) => {
      queryClient.setQueryData(['tasks', context.id], (tasks) => {
        return tasks.filter(
          (task) => !result.some((deleted) => task.id === deleted.id),
        );
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  if (isError) {
    return <Loading text={`Error: ${error.message}`} />;
  }

  if (isPending || !context) {
    return <Loading text="Loading..." />;
  }

  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 70 }}
      data={tasks}
      renderItem={({ item }) => (
        <Task
          id={item.id}
          content={item.content}
          done={item.done}
          updateTask={updateTask}
          deleteTask={mutateDelete}
          updateItemContent={updateItemContent}
        />
      )}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={isPending}
          onRefresh={() => queryClient.invalidateQueries(['tasks', context.id])}
        />
      }
    />
  );
};
