import { Picker } from '@react-native-picker/picker';
import React, { useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';

import { colors } from '../lib/styles';

export default ({
  selected,
  contexts,
  toggleContext,
  showContexts,
  setShowContexts,
  updateContext,
  menuOpened,
  setMenuOpened,
}) => {
  const pickerRef = useRef();
  const pickerItems = (contexts || []).map(({ id, name }) => (
    <Picker.Item key={id} label={name} value={id} />
  ));
  const openPicker = () => {
    if (pickerRef) {
      pickerRef.current.focus();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.select}>
        <Pressable onPress={openPicker}>
          <Text style={styles.headerText}>
            {selected?.name || 'Create a context'}
          </Text>
        </Pressable>
      </View>
      {selected && (
        <Picker
          ref={pickerRef}
          style={styles.headerText}
          selectedValue={selected.id}
          onValueChange={(value) => toggleContext(value)}
          dropdownIconColor={colors.text2}
        >
          {pickerItems}
        </Picker>
      )}
      <Pressable
        onPress={() => {
          if (!selected.active) {
            updateContext({ ...selected, active: true });
          }
        }}
      >
        {selected && (
          <Image
            style={styles.image}
            source={
              selected?.active
                ? require('../assets/star_yellow.png')
                : require('../assets/star.png')
            }
          />
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          setShowContexts(!showContexts);
        }}
      >
        <Image
          style={styles.image}
          source={
            showContexts
              ? require('../assets/checklist.png')
              : require('../assets/queue.png')
          }
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setMenuOpened(!menuOpened);
        }}
      >
        <Image
          style={styles.image}
          source={
            menuOpened
              ? require('../assets/close.png')
              : require('../assets/menu.png')
          }
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 20,
    width: '100%',
  },
  select: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
  },
  selectImg: {
    width: 16,
    height: 16,
    marginLeft: 10,
  },
  headerText: {
    color: colors.text2,
    fontSize: 20,
    textAlign: 'left',
    maxWidth: 200,
    paddingRight: 10,
  },
  image: {
    width: 28,
    height: 28,
  },
});
