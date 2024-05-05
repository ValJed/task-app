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

import ContextList from './ContextList';
import Header from './Header';
import Loading from './Loading';
import TaskList from './TaskList';
import {
  fetchContexts,
  createTask,
  createContext,
  deleteContext,
  updateContext,
} from '../lib/api';
import { colors } from '../lib/styles';

const { width: screenWidth } = Dimensions.get('window');

export default () => {
  const queryClient = useQueryClient();
  const [context, setContext] = useState(null);
  const [sliderOpened, setSliderOpened] = useState(false);
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [showContexts, setShowContexts] = useState(false);
  const btnAnim = useRef(new Animated.Value(0)).current;
  const sliderSize = useMemo(() => inputHeight + 20, [inputHeight]);
  const sliderAnim = useRef(new Animated.Value(0)).current;

  const {
    isPending,
    isError,
    error,
    data: contexts,
  } = useQuery({
    queryKey: ['contexts'],
    queryFn: fetchContexts,
  });

  const { mutate: mutateCreateTask, error: createTaskErr } = useMutation({
    mutationFn: createTask,
    onSuccess: (result) => {
      hideSlider();
      queryClient.setQueryData(['tasks', context.id], (items) => {
        return [result, ...items];
      });
    },
  });

  const { mutate: mutateCreateContext, error: createCtxErr } = useMutation({
    mutationFn: createContext,
    onSuccess: (result) => {
      console.log('result', result);
      hideSlider();
      queryClient.setQueryData(['contexts'], (items) => {
        return [result, ...items];
      });
    },
  });

  const { mutate: mutateUpdateContext, error: updateCtxErr } = useMutation({
    mutationFn: updateContext,
    onSuccess: (result) => {
      hideSlider();
      console.log('result', result);
      queryClient.setQueryData(['contexts'], (items) => {
        return items.map((ctx) => (ctx.id === result.id ? result : ctx));
      });
    },
  });

  const { mutate: mutateDeleteContext, error: deleteCtxErr } = useMutation({
    mutationFn: deleteContext,
    onSuccess: (result) => {
      if (context && context.id === result.id) {
        setContext(contexts[0] || null);
      }
      queryClient.setQueryData(['contexts'], (items) => {
        return items.filter((ctx) => ctx.id !== result.id);
      });
    },
  });

  useEffect(() => {
    if (!sliderOpened) {
      setTimeout(() => {
        setInputHeight(40);
        setInput('');
      }, 300);
    }
  }, [sliderOpened]);

  useEffect(() => {
    if (sliderOpened) {
      Animated.timing(sliderAnim, {
        toValue: -sliderSize,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [sliderOpened, sliderSize, sliderAnim]);

  useEffect(() => {
    if (!contexts || !contexts.length) {
      setShowContexts(true);
      return setContext(null);
    }

    setShowContexts(false);
    setContext(contexts[0]);
  }, [contexts]);

  if (isError) {
    return <Loading text={`Error: ${error.message}`} />;
  }

  if (isPending || !Array.isArray(contexts)) {
    return <Loading text="Loading..." />;
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
    if (sliderOpened) {
      return hideSlider();
    }

    showSlider();
  }

  async function showSlider() {
    setSliderOpened(true);
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
    setSliderOpened(false);
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
  const createItem = () => {
    if (!input) {
      return;
    }

    if (showContexts) {
      return mutateCreateContext(input);
    }

    if (context.id) {
      mutateCreateTask({ content: input, context_id: context.id });
    }
  };

  const renderList = () => {
    if (context && !showContexts) {
      return <TaskList context={context} />;
    }

    if (showContexts) {
      return (
        <ContextList contexts={contexts} deleteContext={mutateDeleteContext} />
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        selected={context}
        contexts={contexts}
        toggleContext={toggleContext}
        showContexts={showContexts}
        setShowContexts={setShowContexts}
        updateContext={mutateUpdateContext}
      />
      {renderList()}
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
          onChangeText={setInput}
          value={input}
          onContentSizeChange={onInputSizeChange}
        />
        <Pressable style={styles.sendBtn} onPress={createItem}>
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
  loading: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
