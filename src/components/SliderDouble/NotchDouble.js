import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

const NotchDouble = props => {
  return <View style={styles.root} {...props} />;
};

export default memo(NotchDouble);

const styles = StyleSheet.create({
  root: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'green',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
});
