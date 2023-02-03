import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

const RailDouble = () => {
  return <View style={styles.root} />;
};

export default memo(RailDouble);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
  },
});
