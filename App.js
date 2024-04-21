import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  Animated,
} from 'react-native';

import Header from './components/Header';
import Task from './components/Task';
import { colors } from './styles';

export default function App() {
  const [contexts, setContexts] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [taskModalOpened, setTaskModalOpened] = useState(false);
  const sliderAnim = useRef(new Animated.Value(-50).current);

  useEffect(() => {
    fetchContexts()
      .then((data) => {
        setContexts(data);
        const active = data.find((ctx) => ctx.active) || data[0];
        setCurrentId(active?.id);
      })
      .catch((err) => {
        console.error(err);
      });
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

  async function showSlider() {
    setTaskModalOpened(true);
    Animated.timing(sliderAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }

  const hideSlider = () => {
    setTaskModalOpened(false);
    Animated.timing(sliderAnim, {
      toValue: -50,
      duration: 3000,
      useNativeDriver: true,
    }).start();
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
      <Pressable onPress={showSlider}>
        <Image style={styles.createBtn} source={require('./assets/plus.png')} />
      </Pressable>
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [
              {
                translateY: sliderAnim,
              },
            ],
          },
        ]}
      >
        <Text>Modal</Text>
      </Animated.View>
      {/* <View style={styles.centeredView}> */}
      {/*   <Modal */}
      {/*     animationType="slide" */}
      {/*     transparent */}
      {/*     visible={taskModalOpened} */}
      {/*     onRequestClose={() => { */}
      {/*       setTaskModalOpened(false); */}
      {/*     }} */}
      {/*   > */}
      {/*     <View style={styles.centeredView}> */}
      {/*       <Text>Modal</Text> */}
      {/*     </View> */}
      {/*   </Modal> */}
      {/* </View> */}
    </View>
  );
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
    return contexts;
  } catch (err) {
    console.error(err);
    return [];
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
  slider: {
    position: 'absolute',
    bottom: '-50%',
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.primary,
    transition: 'transform 0.3s',
  },
});
