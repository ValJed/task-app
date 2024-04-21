import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from 'react-native';

import Task from './components/Task';

export default function App() {
  const [contexts, setContexts] = useState([]);
  const [currentId, setCurrent] = useState(null);

  useEffect(() => {
    fetchContexts();
  }, []);

  const getCurrentTasks = (id) =>
    contexts.find((ctx) => ctx.id === id)?.tasks || [];

  const getCurrentName = () =>
    contexts.find((c) => c.id === currentId)?.name || 'Select a context';

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{getCurrentName()}</Text>
        <Pressable
          onPress={() => {
            console.log('press');
          }}
        >
          <Image
            style={{ width: 32, height: 32 }}
            source={require('./assets/menu.png')}
          />
        </Pressable>
      </View>
      <FlatList
        data={getCurrentTasks(currentId)}
        renderItem={({ item }) => (
          <Task
            id={item.id}
            content={item.content}
            done={item.done}
            onToggle={toggleTaskDone}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

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
        setCurrent(contexts[0].id);
      }
    } catch (err) {
      console.error(err);
      setContexts([]);
    }
  }
}

const styles = StyleSheet.create({
  container: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2D0605',
    padding: 20,
    width: '100%',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'left',
  },
  text: {
    color: '#000000',
  },
});
