import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {SvgXml} from 'react-native-svg';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import MyHeart from '../../../components/MyHeart';
import {fontFamily} from '../../../constants/fonts';
import {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

const Splash2 = props => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <SafeAreaView style={STYLES.containerJustify}>
      <StatusBar
        hidden={false}
        backgroundColor={appColor.appColorMain}
        barStyle={'light-content'}
      />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <View
          style={{
            // top: responsiveHeight(-12),
            alignSelf: 'center',
            height: responsiveHeight(50),
            overflow: 'hidden',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: responsiveWidth(100),
            // transform: [{rotate: '2deg'}],
            // backgroundColor: appColor.appColorMain,
          }}>
          <Image
            source={appImages.first}
            style={{
              //transform: [{rotate: '2deg'}],

              height: responsiveHeight(50),
              width: responsiveWidth(102),
              resizeMode: 'stretch',
              alignSelf: 'center',
              //transform: [{rotate: '2deg'}],
              //   right: responsiveWidth(-3),
              // backgroundColor: 'blue',
            }}
          />
        </View>
        <View
          style={{
            alignSelf: 'center',
            height: responsiveHeight(45),
            alignItems: 'center',
            position: 'absolute',
            width: responsiveWidth(100),
            justifyContent: 'center',
          }}>
          <Text style={styles.headertxt}>LoviBear</Text>
        </View>
        <View
          style={{
            marginBottom: responsiveHeight(2),
            marginTop: responsiveHeight(3.2),
          }}>
          {/* <TouchableOpacity
            style={styles.button1}
            activeOpacity={0.8}
            onPress={() => {
             
                props.navigation.navigate('SignUp', {
                  routeFrom: 'emailorphone',
                  userInfo: 'null',
                });
             
            }}>
            <FastImage
              source={appImages.signupphone}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                marginLeft: responsiveWidth(3),
                marginRight: responsiveWidth(3),
              }}
            />
            <Text style={styles.txt1}>SignUp With Email Address</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button1}
            activeOpacity={0.8}
            onPress={() => {
             
                props.navigation.navigate('SignUpWithPhone', {
                  routeFrom: 'emailorphone',
                  userInfo: 'null',
                });
             
            }}>
            <FastImage
              source={appImages.signupphone}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                marginLeft: responsiveWidth(5),
                marginRight: responsiveWidth(3),
              }}
            />
            <View style={{marginLeft: responsiveWidth(20),alignItems:"center"}}>
            <Text style={styles.txt1}>SignUp </Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button1}
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate('SignUp')}>
            <FastImage
              source={appImages.facebook}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                marginLeft: responsiveWidth(3),
                marginRight: responsiveWidth(3),
              }}
            />
            <Text style={styles.txt1}>Signup with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate('SignUp')}>
            <FastImage
              source={appImages.google}
              resizeMode="contain"
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                marginLeft: responsiveWidth(3),
                marginRight: responsiveWidth(3),
              }}
            />
            <Text style={styles.txt2}>Signup with Google</Text>
          </TouchableOpacity> */}
          {/* <View
            style={{
              flexDirection: 'row',
              width: responsiveWidth(95),
              alignSelf: 'center',
              flexWrap: 'wrap',
              // backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: responsiveHeight(3.5),
            }}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
            <Text style={styles.txt4}>
              By tapping Log In, you agree with our{' '}
            </Text>
            <TouchableOpacity>
              <Text style={styles.txt5}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.txt4}> and </Text>
            <TouchableOpacity>
              <Text style={styles.txt5}>Privacy Policy</Text>
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              marginTop: responsiveHeight(2),
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Text style={[styles.txt4]}>Already Have an Account ? </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Login')}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: responsiveFontSize(1.8),

                  
                  textDecorationLine: 'underline',
                }}>
                Login Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Splash2;

const styles = StyleSheet.create({
  txt1: {
    color: '#fff',
    fontSize: responsiveFontSize(2.35),
    
  },
  button1: {
    backgroundColor: '#0093FF',
    width: responsiveWidth(80),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    // paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(1.4),
    borderRadius: responsiveWidth(100),
    marginBottom: responsiveHeight(3.5),
    overflow: 'hidden',
  },
  txt2: {
    color: '#909090',
    fontSize: responsiveFontSize(2.35),

    
  },
  button2: {
    borderColor: '#0093FF',
    width: responsiveWidth(80),
    overflow: 'hidden',

    flexDirection: 'row',

    alignItems: 'center',
    alignSelf: 'center',
    // paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(1.4),
    borderRadius: responsiveWidth(100),
    marginBottom: responsiveHeight(2),
    borderWidth: responsiveWidth(0.2),
  },

  txt4: {
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
    color: '#000000',
    
  },
  txt5: {
    fontSize: responsiveFontSize(1.8),
    color: '#000000',
    textDecorationLine: 'underline',
    textAlign: 'center',
    
  },
  headertxt: {
    fontSize: responsiveFontSize(6),
    color: '#fff',
    
  },
});
