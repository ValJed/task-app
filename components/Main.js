import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  Pressable,
  Animated,
  TextInput,
  Dimensions,
} from 'react-native';

import ContextList from './ContextList';
import Header from './Header';
import Loading from './Loading';
import Menu from './Menu';
import TaskList from './TaskList';
import getApiActions from '../lib/api';
import { getApiData, storeApiData } from '../lib/store';
import { colors } from '../lib/styles';

const { width: screenWidth } = Dimensions.get('window');

export default () => {
  const queryClient = useQueryClient();
  const [context, setContext] = useState(null);
  const [sliderOpened, setSliderOpened] = useState(false);
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [showContexts, setShowContexts] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [apiData, setApiData] = useState({ apiUrl: '', apiKey: '' });
  const [api, setApi] = useState({});
  const btnAnim = useRef(new Animated.Value(0)).current;
  const sliderSize = useMemo(() => inputHeight + 20, [inputHeight]);
  const sliderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getApiData()
      .then((data) => {
        setApiData(data);
        setApi(getApiActions(data));
      })
      .catch((err) => console.error(err.message));
  }, []);

  const {
    isPending,
    isError,
    error,
    data: contexts,
  } = useQuery({
    queryKey: ['contexts', 'apiData'],
    queryFn: api.fetchContexts,
  });

  const { mutate: mutateCreateTask } = useMutation({
    mutationFn: api.createTask,
    onSuccess(result) {
      hideSlider();
      queryClient.setQueryData(['tasks', context.id], (items) => {
        return [result, ...items];
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: mutateUpdateTask } = useMutation({
    mutationFn: ({ id, ...data }) => api.updateTask(id, data),
    onSuccess(result) {
      hideSlider();
      queryClient.setQueryData(['tasks', context.id], (items) => {
        return items.map((item) => (item.id === result.id ? result : item));
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: mutateCreateContext } = useMutation({
    mutationFn: api.createContext,
    onSuccess: (result) => {
      hideSlider();
      queryClient.setQueryData(['contexts', 'apiData'], (items) => {
        return [result, ...items];
      });
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: mutateUpdateContext } = useMutation({
    mutationFn: api.updateContext,
    onSuccess: (result) => {
      hideSlider();
      queryClient.invalidateQueries(['contexts', 'apiData']);
    },
    onError(err) {
      console.error(err);
    },
  });

  const { mutate: mutateDeleteContext } = useMutation({
    mutationFn: api.deleteContext,
    onSuccess: (result) => {
      if (context && context.id === result.id) {
        setContext(contexts[0] || null);
      }
      queryClient.setQueryData(['contexts', 'apiData'], (items) => {
        return items?.filter((ctx) => ctx.id !== result.id) || [];
      });
    },
    onError(err) {
      console.error(err);
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

    const active = contexts.find((ctx) => ctx.active);
    setContext(active || contexts[0]);
  }, [contexts]);

  /* if (!apiData.apiUrl || !apiData.apiKey) { */
  /*   return <Menu noHeader saveApiData={saveApiData} />; */
  /* } */

  if (isPending) {
    return <Loading text="Loading..." />;
  }

  const btnSpin = btnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const toggleContext = (id) => {
    const selected = contexts.find((ctx) => ctx.id === id);
    if (selected) {
      setShowContexts(false);
      return setContext(selected);
    }
  };

  function toggleSlider() {
    if (sliderOpened) {
      return hideSlider();
    }

    showSlider();
  }

  async function saveApiData(apiUrl, apiKey) {
    try {
      await storeApiData(apiUrl, apiKey);
      setApiData({ apiUrl, apiKey });
      const api = await getApiActions(apiData);
      setApi(api);
      setMenuOpened(false);
    } catch (err) {
      console.error(err);
    }
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
    setItemToUpdate(false);
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
  const enterInput = () => {
    if (!input) {
      return;
    }

    if (itemToUpdate) {
      if (itemToUpdate.name) {
        mutateUpdateContext({ ...itemToUpdate, name: input });
      } else {
        mutateUpdateTask({ id: itemToUpdate.id, content: input });
      }
      setItemToUpdate(false);
      return;
    }

    if (showContexts) {
      return mutateCreateContext(input);
    }

    if (context.id) {
      mutateCreateTask({ content: input, context_id: context.id });
    }
  };

  const updateItemContent = (item) => {
    setItemToUpdate(item);
    setInput(item.name || item.content);
    showSlider();
  };

  const renderList = () => {
    if (menuOpened) {
      return <Menu saveApiData={saveApiData} apiData={apiData} />;
    }

    if (isError) {
      if (!apiData.apiUrl || !apiData.apiKey) {
        return <Loading text="Configure API Data first" />;
      }
      return <Loading text={`Error: ${error.message}`} />;
    }

    if (context && !showContexts) {
      return (
        <TaskList
          context={context}
          updateTask={mutateUpdateTask}
          updateItemContent={updateItemContent}
          fetchTasks={api.fetchTasks}
          deleteTask={api.deleteTask}
        />
      );
    }

    if (showContexts) {
      return (
        <ContextList
          contexts={contexts}
          deleteContext={mutateDeleteContext}
          updateItemContent={updateItemContent}
        />
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
        menuOpened={menuOpened}
        setMenuOpened={setMenuOpened}
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
        <Pressable style={styles.sendBtn} onPress={enterInput}>
          <Image
            style={styles.sendBtnImg}
            source={require('../assets/send.png')}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginBottom: 50,
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
  list: {
    paddingBottom: 50,
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
