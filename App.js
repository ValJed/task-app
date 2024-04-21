import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from 'react-native';

import Header from './components/Header';
import Task from './components/Task';
import { colors } from './styles';

export default function App() {
  const [contexts, setContexts] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchContexts();
  }, []);

  const getCurrentTasks = (id) =>
    contexts.find((ctx) => ctx.id === id)?.tasks || [];

  const toggleTaskDone = (id, done) => {
    // TODO: Should request API to update task done
    const updated = contexts.map((ctx) => {
      if (ctx.id !== currentId) {
        return ctx;
      }

      return {
        ...ctx,
        tasks: ctx.tasks.map((task) => {
          if (task.id !== id) {
            return task;
          }

          return {
            ...task,
            done: !done,
          };
        }),
      };
    });

    setContexts(updated);
  };

  const onDelete = (id) => {
    console.log('=====> delete task <=====');
  };

  const toggleContext = (id) => {
    console.log('select context id', id);
    setCurrentId(id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        contextId={currentId}
        contexts={contexts}
        toggleContext={toggleContext}
      />
      <FlatList
        data={getCurrentTasks(currentId)}
        renderItem={({ item }) => (
          <Task
            id={item.id}
            content={item.content}
            done={item.done}
            onToggle={toggleTaskDone}
            onDelete={onDelete}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Pressable onPress={addTask}>
        <Image style={styles.createBtn} source={require('./assets/plus.png')} />
      </Pressable>
    </View>
  );

  async function addTask() {
    console.log('=====> add task <=====');
  }

  async function fetchContexts() {
    try {
      const response = await fetch('http://10.0.2.2:3000/task', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const contexts = await response.json();
      setContexts(contexts);

      if (!currentId && contexts.length) {
        setCurrentId(contexts[0].id);
      }
    } catch (err) {
      console.error(err);
      setContexts([]);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    padding: 20,
    width: '100%',
  },
  headerText: {
    color: colors.text2,
    fontSize: 20,
    textAlign: 'left',
  },
  text: {
    color: colors.text1,
  },
  createBtn: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 64,
    height: 64,
  },
});
