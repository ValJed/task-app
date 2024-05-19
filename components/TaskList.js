import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FlatList, Text, StyleSheet } from 'react-native';

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
    isPending: isPendingCtx,
    isError: isErrCtx,
    error: contextsErr,
    data: tasks,
  } = useQuery({
    queryKey: ['tasks', context.id],
    queryFn: () => fetchTasks(context.id),
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteTask,
    onSuccess: (result) => {
      queryClient.setQueryData(['tasks', context.id], (tasks) => {
        return tasks.filter((task) => task.id !== result.id);
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  if (isErrCtx) {
    return <Loading text={`Error: ${contextsErr.message}`} />;
  }

  if (isPendingCtx || !context) {
    return <Loading text="Loading..." />;
  }

  return (
    <FlatList
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
    />
  );
};
