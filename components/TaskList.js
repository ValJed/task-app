import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FlatList, Text } from 'react-native';

import Task from './Task';
import { fetchTasks, createTask, deleteTask, updateTask } from '../lib/api';

export default ({ context }) => {
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

  const { mutate: mutateDone, error: doneErr } = useMutation({
    mutationFn: ({ id, done }) => updateTask(id, { done }),
    onSuccess: (result) => {
      queryClient.setQueryData(['tasks', context.id], (tasks) => {
        return tasks.map((task) => (task.id === result.id ? result : task));
      });
    },
  });

  const { mutate: mutateDelete, error: deleteErr } = useMutation({
    mutationFn: deleteTask,
    onSuccess: (result) => {
      queryClient.setQueryData(['tasks', context.id], (tasks) => {
        return tasks.filter((task) => task.id !== result.id);
      });
    },
  });

  if (isErrCtx) {
    return <Text>Error: {contextsErr.message}</Text>;
  }

  if (isPendingCtx || !context) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <Task
          id={item.id}
          content={item.content}
          done={item.done}
          mutateDone={mutateDone}
          mutateDelete={mutateDelete}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
