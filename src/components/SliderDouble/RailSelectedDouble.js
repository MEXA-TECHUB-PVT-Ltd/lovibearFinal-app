import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const RailSelectedDouble = () => {
  return <View style={styles.root} />;
};

export default memo(RailSelectedDouble);

const styles = StyleSheet.create({
  root: {
    height: 3,
    backgroundColor: '#D3AEB1',
    borderRadius: 2,
  },
});
