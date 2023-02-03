import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {Icon} from 'react-native-vector-icons';

import styles from './style';
export const MyButton = props => {
  const {
    onPress,
    title,
    myStyles,
    iconName,
    iconType,
    itsTextstyle,
    iconColor,
    iconSize,
    customimg,
    imageStyle,
    disabled,
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled == undefined ? false : disabled}
      style={[styles.container, myStyles]}>
      {iconName && (
        <View style={styles.IconCon}>
          <Icon
            name={iconName}
            size={iconSize ? iconSize : responsiveFontSize(3)}
            type={iconType}
            // color={iconColor ? iconColor : "white"}
          />
        </View>
      )}
      {title && (
        <Text
          style={[
            styles.title,
            {width: iconName ? responsiveWidth(50) : null},
            itsTextstyle,
          ]}>
          {'  '}
          {title}
          {'  '}
        </Text>
      )}
      {customimg && (
        <Image source={customimg} style={[styles.imgstyle, imageStyle]} />
      )}
    </TouchableOpacity>
  );
};

export const MyButtonLoader = props => {
  const {
    onPress,
    title,
    myStyles,
    iconName,
    iconType,
    itsTextstyle,
    iconColor,
    iconSize,
    customimg,
    imageStyle,
    buttonColor,
  } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={true}
      activeOpacity={0.8}
      style={[
        styles.container,
        myStyles,
        {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
      ]}>
      {title && (
        <Text style={[styles.title, itsTextstyle]}>
          {'  '}
          {title}
          {'  '}
        </Text>
      )}
      <ActivityIndicator
        size={'small'}
        style={{
          marginLeft: responsiveWidth(4),
        }}
        color={
          buttonColor == undefined ? '#fff' : buttonColor
        }></ActivityIndicator>
    </TouchableOpacity>
  );
};
