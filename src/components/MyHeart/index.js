import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {appColor, appImages} from '../../assets/utilities';
import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
const MyHeart = props => {
  return (
    <View
      style={[
        props.shadow == undefined || props.shadow == true
          ? styles.shadow
          : null,
        {
          width:
            props.width == undefined ? responsiveWidth(8) : props.width - 2,
          height:
            props.height == undefined ? responsiveWidth(8) : props.height - 2,
          position: 'absolute',
          zIndex: props.zIndex == undefined ? 1 : props.zIndex,
          borderRadius: responsiveWidth(100),
          alignItems: 'center',
          // justifyContent: 'center',
          transform:
            props.rotate == undefined
              ? props.scaleX == undefined || props.scaleX !== 1
                ? [{rotate: '10deg'}]
                : [{rotate: '-10deg'}]
              : [{rotate: props.rotate}],
        },
        props.myStyles,
      ]}>
      <FastImage
        source={
          props.type == undefined || props.type == 'white'
            ? appImages.heartwhite
            : appImages.heartred
        }
        resizeMode={'contain'}
        style={{
          width: props.width == undefined ? responsiveWidth(10) : props.width,
          resizeMode: 'contain',
          height:
            props.height == undefined ? responsiveWidth(10) : props.height,
          transform:
            props.scaleX == undefined
              ? [{scaleX: -1}]
              : [{scaleX: props.scaleX}],
        }}
      />
    </View>
  );
};

export default MyHeart;

const styles = StyleSheet.create({
  shadow: {
    // backgroundColor: 'red',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 15,
    backgroundColor: 'transparent',
  },
});
