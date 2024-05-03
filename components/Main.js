import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  Pressable,
  Animated,
  Text,
  TextInput,
  Dimensions,
} from 'react-native';

import Header from './Header';
import List from './List';
import { fetchContexts, createTask } from '../lib/api';
import { colors } from '../lib/styles';

const { width: screenWidth } = Dimensions.get('window');
console.log('screenWidth', screenWidth);
/* const halfScreen = screenheight / 2; */
/* const sliderSize = 70; */
/* const inputSize = sliderSize - 20; */

export default () => {
  const queryClient = useQueryClient();
  const [context, setContext] = useState(null);
  const [taskModalOpened, setTaskModalOpened] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const btnAnim = useRef(new Animated.Value(0)).current;
  const sliderSize = useMemo(() => inputHeight + 20, [inputHeight]);
  const sliderAnim = useRef(new Animated.Value(-sliderSize)).current;

  const {
    isPending,
    isError,
    error,
    data: contexts,
  } = useQuery({
    queryKey: ['contexts'],
    queryFn: fetchContexts,
  });

  const { mutate: mutateCreateTask, error: createErr } = useMutation({
    mutationFn: () => createTask(taskInput, context.id),
    onSuccess: (result) => {
      queryClient.setQueryData(['tasks', context.id], (tasks) => {
        hideSlider();
        setTaskInput('');
        return [result, ...tasks];
      });
    },
  });

  useEffect(() => {
    Animated.timing(sliderAnim, {
      toValue: -sliderSize,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sliderAnim, sliderSize]);

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

  const onInputSizeChange = ({ nativeEvent }) => {
    if (nativeEvent.contentSize.height < 80) {
      setInputHeight(nativeEvent.contentSize.height);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        selected={context}
        contexts={contexts}
        toggleContext={toggleContext}
      />
      {context && <List context={context} />}
      <Animated.View
        style={[
          styles.createBtnView,
          {
            transform: [{ translateY: sliderAnim }, { rotate: btnSpin }],
          },
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
        style={[
          styles.slider,
          {
            transform: [{ translateY: sliderAnim }],
            bottom: -sliderSize,
          },
        ]}
      >
        <TextInput
          style={[styles.textInput, { height: inputHeight }]}
          multiline
          onChangeText={setTaskInput}
          value={taskInput}
          onContentSizeChange={onInputSizeChange}
        />
        <Pressable style={styles.sendBtn} onPress={mutateCreateTask}>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    width: '100%',
    backgroundColor: colors.primary,
    padding: 10,
  },
  textInput: {
    width: screenWidth - 65,
    borderColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    color: colors.text2,
    padding: 10,
  },
  sendBtn: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  sendBtnImg: {
    width: '100%',
    height: '100%',
  },
});
