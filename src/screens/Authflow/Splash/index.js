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
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {SvgXml} from 'react-native-svg';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import FastImage from 'react-native-fast-image';
import MyHeart from '../../../components/MyHeart';
import {fontFamily} from '../../../constants/fonts';
import {useFocusEffect} from '@react-navigation/native';
import {Base_URL} from '../../../Base_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Checkbox} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
const Splash = props => {
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const GoogleLoginApi = async info => {
    var axios = require('axios');
    var data = JSON.stringify({
      email: info.email,
      password: info.id,
      ip: '192.168.20.1',
      country: 'japan',
    });

    var config = {
      method: 'post',
      url: Base_URL + '/user/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.message == 'Logged in successfully') {
          // console.log('THE USER ID==========', response.data);
          await AsyncStorage.setItem('userid', response.data.Data._id);
          await AsyncStorage.setItem(
            'signuptype',
            response.data.Data.signupType,
          );
          await AsyncStorage.setItem('password', 'googlesignup');
          props.navigation.navigate('CheckUserImage');
        }
      })
      .catch(async function (error) {
        console.log('THE ERROR==========', error);
        // console.log('THE ERROR=========', error.response.data);
        if (error.response.data == 'Email or password is wrong') {
          props.navigation.navigate('SignUp', {
            routeFrom: 'google',
            userInfo: info,
          });
          _signOut();
        }
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    GoogleSignin.configure();
    _isSignedIn();
  }, []);
  console.log('USER INFO==============', userInfo);
  console.log('LOGIN STATUS===========', gettingLoginStatus);
  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      console.log('User is already signed in');
      // Set User Info if user is already signed in
      _getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
    setGettingLoginStatus(false);
  };
  const _getCurrentUserInfo = async () => {
    try {
      let info = await GoogleSignin.signInSilently();
      console.log('User Info --> ', info);
      setUserInfo(info);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // console.log('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        // console.log("Unable to get user's info");
        console.log("Unable to get user's info");
      }
    }
  };
  const _signIn = async () => {
    // It will prompt google Signin Widget
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      setUserInfo(userInfo);
      console.log('MY CUSTOM INFO=========', userInfo.user);
      GoogleLoginApi(userInfo.user);
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services Not Available or Outdated');
      } else {
        alert(error.message);
      }
    }
  };
  const _signOut = async () => {
    setGettingLoginStatus(true);
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      setUserInfo(null);
    } catch (error) {
      console.log(error);
    }
    setGettingLoginStatus(false);
  };
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
             // transform: [{rotate: '2deg'}],
             //marginLeft:2,
              height: responsiveHeight(50),
              width: responsiveWidth(102),
              resizeMode: 'stretch',
              //alignSelf: 'center',
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
            marginTop: responsiveHeight(5),
          }}>
          {/* <TouchableOpacity
            style={styles.button1}
            activeOpacity={0.8}
            onPress={() => {
             
                props.navigation.navigate('Login');
              
            }}>
            <Text style={styles.txt1}>Login With Email</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.button1,
              {
                marginTop: responsiveHeight(4),
              },
            ]}
            activeOpacity={0.8}
            onPress={() => {
              
                props.navigation.navigate('LoginWithPhone');
              
            }}>
            <Text style={styles.txt1}>Login </Text>
          </TouchableOpacity>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: responsiveWidth(80),
              alignSelf: 'center',
              marginTop: responsiveHeight(2),
              marginBottom: responsiveHeight(7),
            }}> */}
          <TouchableOpacity
            style={[
              styles.button2,
              {
                marginTop: responsiveHeight(5),
              },
            ]}
            activeOpacity={0.7}
            onPress={() => {
              // _signOut();
              // props.navigation.navigate('Login');
            }}>
            <Text style={styles.txt2}>Login With</Text>
            <Image
              source={appImages.facebook2}
              resizeMode="contain"
              style={{
                width: responsiveWidth(6),
                height: responsiveWidth(6),
                marginLeft: responsiveWidth(2),
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button3,
              {
                marginTop: responsiveHeight(5),
              },
            ]}
            activeOpacity={0.7}
            onPress={() => {
           
                _signIn();
             
              // props.navigation.navigate('Login')
            }}>
            <Text style={styles.txt3}>Login With</Text>
            <Image
              source={appImages.google}
              resizeMode="contain"
              style={{
                width: responsiveWidth(6),
                height: responsiveWidth(6),
                marginLeft: responsiveWidth(2),
              }}
            />
          </TouchableOpacity>
          {/* </View> */}
          {/* <View
            style={{
              flexDirection: 'row',
              width: responsiveWidth(95),
              alignSelf: 'center',
              flexWrap: 'wrap',
              // backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',

              // marginTop: responsiveHeight(6),
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
            <Text style={styles.txt4}>Don't Have an Account ? </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
             
                props.navigation.navigate('SignUpWithPhone', {
                  routeFrom: 'emailorphone',
                  userInfo: 'null',
                });
             
            }}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: responsiveFontSize(1.8),

                  
                  textDecorationLine: 'underline',
                }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  txt1: {
    color: '#fff',
    fontSize: responsiveFontSize(2.3),

    
  },
  button1: {
    backgroundColor: appColor.appColorMain,
    width: responsiveWidth(80),
    alignItems: 'center',
    alignSelf: 'center',
    // paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(1.7),
    borderRadius: responsiveWidth(100),
  },
  txt2: {
    color: '#fff',
    fontSize: responsiveFontSize(2.3),

    
  },
  button2: {
    backgroundColor: '#3B5998',
    alignSelf: 'center',
    paddingVertical: responsiveHeight(1.6),
    borderRadius: responsiveWidth(100),
    flexDirection: 'row',
    width: responsiveWidth(80),

    alignItems: 'center',
    justifyContent: 'center',
  },
  txt3: {
    color: '#909090',
    
    fontSize: responsiveFontSize(2.3),
  },
  button3: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    paddingVertical: responsiveHeight(1.6),
    borderRadius: responsiveWidth(100),
    flexDirection: 'row',
    borderColor: '#909090',
    borderWidth: responsiveWidth(0.2),
    width: responsiveWidth(80),

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
  },
  txt4: {
    fontSize: responsiveFontSize(1.8),

    textAlign: 'center',
    color: '#000000',
    
  },
  txt5: {
    fontSize: responsiveFontSize(1.8),

    textDecorationLine: 'underline',
    textAlign: 'center',
    color: '#000000',
    
  },
  headertxt: {
    fontSize: responsiveFontSize(6),
    color: '#fff',

    
  },
});
