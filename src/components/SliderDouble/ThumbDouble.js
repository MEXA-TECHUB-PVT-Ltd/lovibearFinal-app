import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {buttonColor} from '../../constants/colors';

const THUMB_RADIUS = 12;

const ThumbDouble = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 1.8,
    height: THUMB_RADIUS * 1.8,
    borderRadius: THUMB_RADIUS,
    // borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 7,
  },
});

export default memo(ThumbDouble);
