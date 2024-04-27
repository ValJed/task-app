import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Image,
  Pressable,
  Animated,
  Text,
  TextInput,
} from 'react-native';

import Header from './Header';
import List from './List';
import { fetchContexts } from '../lib/api';
import { colors } from '../lib/styles';

/* const { height: screenheight } = Dimensions.get('window'); */
/* const halfScreen = screenheight / 2; */
const sliderSize = 70;
const inputSize = sliderSize - 20;

export default () => {
  const [context, setContext] = useState(null);
  const [taskModalOpened, setTaskModalOpened] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const sliderAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const {
    isPending,
    isError,
    error,
    data: contexts,
  } = useQuery({
    queryKey: ['contexts'],
    queryFn: fetchContexts,
  });

  useEffect(() => {
    if (!contexts || !contexts.length) {
      return setContext(null);
    }
    setContext(contexts[0]);
  }, [contexts]);

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const btnSpin = btnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const toggleContext = (id) => {
    const selected = contexts.find((ctx) => ctx.id === id);
    if (selected) {
      return setContext(selected);
    }
  };

  async function createTask() {
    /* if (!taskInput) { */
    /*   return; */
    /* } */
    /**/
    /* console.log('taskInput', taskInput); */
    /**/
    /* try { */
    /*   const response = await fetch('http://10.0.2.2:3000/task', { */
    /*     method: 'POST', */
    /*     headers: { */
    /*       Accept: 'application/json', */
    /*       'Content-Type': 'application/json', */
    /*     }, */
    /*     body: JSON.stringify({ */
    /*       content: taskInput, */
    /*       context_id: currentId, */
    /*     }), */
    /*   }); */
    /*   const task = await response.json(); */
    /**/
    /*   const updated = contexts.map((ctx) => { */
    /*     if (ctx.id !== currentId) { */
    /*       return ctx; */
    /*     } */
    /**/
    /*     return { */
    /*       ...ctx, */
    /*       tasks: [task, ...ctx.tasks], */
    /*     }; */
    /*   }); */
    /*   setContexts(updated); */
    /*   setTaskInput(''); */
    /* } catch (err) { */
    /*   console.error(err); */
    /* } */
  }

  function toggleSlider() {
    if (taskModalOpened) {
      hideSlider();
    } else {
      showSlider();
    }
  }

  async function showSlider() {
    setTaskModalOpened(true);
    Animated.timing(sliderAnim, {
      toValue: -sliderSize,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(btnAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  const hideSlider = () => {
    setTaskModalOpened(false);
    Animated.timing(sliderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(btnAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onInputSizeChange = (e) => {
    console.log('sizes', e.contentSize);
    console.log('=====> RESIZE BRO <=====');
    // TODO resize input and slider
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        selected={context}
        contexts={contexts}
        toggleContext={toggleContext}
      />
      <List context={context} />
      <Animated.View
        style={[
          styles.createBtnView,
          { transform: [{ translateY: sliderAnim }, { rotate: btnSpin }] },
        ]}
      >
        <Pressable onPress={toggleSlider}>
          <Image
            style={[styles.createBtn]}
            source={require('../assets/plus.png')}
          />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[styles.slider, { transform: [{ translateY: sliderAnim }] }]}
      >
        <TextInput
          style={styles.textInput}
          multiline
          onChangeText={setTaskInput}
          value={taskInput}
          onContentSizeChange={onInputSizeChange}
        />
        <Pressable style={styles.sendBtn} onPress={createTask}>
          <Image
            style={styles.sendBtnImg}
            source={require('../assets/send.png')}
          />
        </Pressable>
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
};

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
  createBtnView: {
    width: 45,
    height: 45,
    position: 'absolute',
    right: 25,
    bottom: 25,
  },
  createBtn: {
    width: '100%',
    height: '100%',
  },
  slider: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -sliderSize,
    left: 0,
    width: '100%',
    height: sliderSize,
    backgroundColor: colors.primary,
    padding: 10,
  },
  textInput: {
    /* width: '100%', */
    /* flexGrow: 1, */
    height: inputSize,
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text2,
    padding: 10,
  },
  sendBtn: {
    width: 35,
    height: 35,
    marginLeft: 10,
    flexShrink: 0,
  },
  sendBtnImg: {
    width: '100%',
    height: '100%',
  },
});
