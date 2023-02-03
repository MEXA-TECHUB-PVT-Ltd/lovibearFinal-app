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
  Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {SvgXml} from 'react-native-svg';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import EyeIcon from 'react-native-vector-icons/Ionicons';
import MyHeart from '../../../components/MyHeart';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {MyButton, MyButtonLoader} from '../../../components/MyButton';
import {fontFamily} from '../../../constants/fonts';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import CountryPicker from 'react-native-country-picker-modal';
import CheckBox from '@react-native-community/checkbox';
import {Base_URL} from '../../../Base_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginWithPhone = ({route, navigation}) => {
  let regchecknumber = /^[0-9]*$/;
  let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  let regphone =
    /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

  const [myfocus, setMyfocus] = useState('');
  const [securepassword, setSecurepassword] = useState(true);
  const passwordinputref = useRef();
  const emailinputref = useRef();
  const [softinput, setSoftinput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailerror, setEmailerror] = useState('');
  const [passworderror, setPassworderror] = useState('');
  const [checkemail, setCheckemail] = useState(false);
  const [checkpassword, setCheckpassword] = useState(false);
  const [firstchar, setFirstChar] = useState('+');
  const [loading, setLoading] = useState(false);
  const [countryCode, setcountryCode] = useState('PK');
  const [callingCode, setcallingCode] = useState('92');
  const [countryname, setcountryname] = useState('Country');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const OnSelect = country => {
    console.log('country', country);
    const {cca2, callingCode, name} = country;
    setcountryCode(cca2);
    setcallingCode(callingCode[0]);
    setcountryname(name);
  };

  useFocusEffect(
    React.useCallback(() => {
      setSoftinput(true);
      // setEmailerror(false);
      // setPassworderror(false);
    }, []),
  );

  const Validations = async () => {
    console.log(
      'COMPLETE PHONE NUMBER=========',
      firstchar + callingCode + email,
    );
    if (email == '') {
      setCheckemail(true);
      setEmailerror('Enter Valid Phone Number');
      return false;
    }
    if (regphone.test(firstchar + callingCode + email) == false) {
      console.log('IN FIRST');
      if (regchecknumber.test(callingCode + email)) {
        console.log(' IN NUMBER CHECK ');
        console.log(firstchar + callingCode + email);
        setCheckemail(true);
        setEmailerror('Enter Valid Phone Number');
        return false;
      }
    }
    if (password == '') {
      setCheckpassword(true);
      setPassworderror('Enter Valid Password');
      return false;
    }
    if (checkpassword == false && checkemail == false) {
      // props.navigation.navigate('App', {screen: 'PlayScreenScreens'})
      var axios = require('axios');
      console.log('FINAL======', firstchar + callingCode + email);
      var data = JSON.stringify({
        phoneNumber: firstchar + callingCode + email,
        password: password,
      });

      var config = {
        method: 'post',
        url: Base_URL + '/user/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      setLoading(true);

      await axios(config)
        .then(async function (response) {
          console.log('MY LOADER=======', loading);
          console.log(JSON.stringify(response.data));

          if (response.data.message == 'Logged in successfully') {
            // console.log('THE USER ID==========', response.data);
            await AsyncStorage.setItem('userid', response.data.Data._id);
            await AsyncStorage.setItem(
              'signuptype',
              response.data.Data.signupType,
            );
            await AsyncStorage.setItem('password', password);

            if (response.data.Data.profileImage == undefined) {
              console.log('PROFILE IMAGE UNDEFINED');
              await AsyncStorage.setItem('profileimage', '');
            } else {
              await AsyncStorage.setItem(
                'profileimage',
                response.data.Data.profileImage.userPicUrl,
              );
            }

            // await AsyncStorage.setItem('userid', response.data.Data._id);
            navigation.navigate('CheckUserImage');
            console.log('MY LOADER=======', loading);
            setLoading(false);
          }
          setLoading(false);
        })
        .catch(async function (error) {
          console.log('THE ERROR=========', error.response);
          if (error.response.data == 'phoneNumber or password is wrong') {
            setCheckpassword(true);
            setPassworderror('Wrong phone number or password');
            setLoading(false);
          } else if (error.response.data == 'Email or password is wrong') {
            setCheckpassword(true);
            setPassworderror('Wrong Email or password');
            setLoading(false);
          } else if ('"password" length must be at least 6 characters long') {
            setCheckpassword(true);
            setPassworderror('Password length must be atleast 6 digits');
            setLoading(false);
          }
          setLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={STYLES.container}>
      <StatusBar
        hidden={false}
        backgroundColor={appColor.appColorMain}
        barStyle={'light-content'}
      />
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <View>
          <View
            style={{
              height: responsiveHeight(22),
              overflow: 'hidden',
              justifyContent: 'flex-end',

              // alignSelf: 'center',
            }}>
            <Image
              source={appImages.first}
              style={{
                transform: [{rotate: '2deg'}],

                width: responsiveWidth(110),
                height: responsiveHeight(70),

                resizeMode: 'stretch',
                alignSelf: 'center',

                //   backgroundColor: 'red',
                //   top: responsiveHeight(-50),
              }}
            />
          </View>
          <Text style={styles.maintxt}>LOGIN WITH YOUR PHONE NUMBER</Text>

          <View
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'email' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <View style={{justifyContent: 'center'}}>
              <CountryPicker
                onOpen={() => {
                  setCheckemail(false);
                  setCheckpassword(false);
                }}
                withFilter
                containerButtonStyle={[
                  styles.countrypick,
                  {
                    // width: responsiveWidth(24),
                    // flexDirection: 'row',
                    // backgroundColor: 'lightgray',
                    // paddingVertical: responsiveHeight(1.4),
                  },
                ]}
                //   withCountryNameButton
                countryCode={countryCode}
                withFlag
                // withAlphaFilter={false}
                withFlagButton={false}
                withCallingCode
                onSelect={OnSelect}
              />
              <View
                style={{
                  position: 'absolute',
                  // left: responsiveWidth(1.5),
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                pointerEvents="none">
                {/* <Image
                  source={appImages.phone}
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(6.5),
                    height: responsiveWidth(6.5),
                    // backgroundColor: 'red',
                    marginLeft: responsiveWidth(5),
                  }}
                /> */}
                <Text
                  style={{
                    paddingLeft: responsiveWidth(1.5),
                    color: '#080808',
                    
                    fontSize: responsiveFontSize(2),
                  }}>
                  {firstchar}
                </Text>
                <Text
                  style={{
                    paddingLeft: responsiveWidth(1),
                    color: '#080808',
                    
                    fontSize: responsiveFontSize(2),
                  }}>
                  {callingCode}
                </Text>
                <Image
                  style={{
                    width: responsiveWidth(2.5),
                    height: responsiveWidth(2.5),
                    resizeMode: 'contain',
                    marginLeft: responsiveWidth(2),
                  }}
                  source={appImages.dropdown}
                />
              </View>
            </View>

            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setCheckemail(false);
                setCheckpassword(false);
              }}
              placeholderTextColor={'#8D8D8D'}
              showSoftInputOnFocus={softinput}
              autoFocus
              selectionColor={appColor.appColorMain}
              placeholder="Phone Number"
              style={styles.txtinputemail}
              onFocus={() => setMyfocus('email')}
              onBlur={() => setMyfocus('')}
              keyboardType="numeric"
              onSubmitEditing={() => passwordinputref.current.focus()}
              blurOnSubmit={false}
              returnKeyType={'next'}
            />
          </View>
          {checkemail ? (
            <Text style={styles.errortxt}>{emailerror}</Text>
          ) : null}
          <View
            style={[
              styles.passwordparent,
              {
                borderColor:
                  myfocus == 'password' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.password}
              resizeMode="contain"
              style={{
                width: responsiveWidth(6.5),
                height: responsiveWidth(6.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setCheckpassword(false);
                setCheckemail(false);
              }}
              placeholderTextColor={'#8D8D8D'}
              selectionColor={appColor.appColorMain}
              placeholder="Password"
              style={styles.txtinputpassword}
              onFocus={() => setMyfocus('password')}
              onBlur={() => setMyfocus('')}
              secureTextEntry={securepassword}
              ref={passwordinputref}
            />
            <EyeIcon
              style={{fontSize: responsiveFontSize(3.7), color: 'lightgray'}}
              name={securepassword ? 'eye-off' : 'eye'}
              onPress={() => setSecurepassword(!securepassword)}
            />
          </View>
          {checkpassword ? (
            <Text style={styles.errortxt}>{passworderror}</Text>
          ) : null}
        <View style={styles.forgetview}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgettxt}>Forget Password?{'  '}</Text>
          </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems:"center"}}>
        <View style={{marginTop:responsiveHeight(6),width:responsiveWidth(44)}}>
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.txt6, {textDecorationLine: 'underline',}]}>
              Login with Email Address
            </Text>
          </TouchableOpacity>
          </View>
          </View>
        <View
          style={{
            position: 'absolute',
            //   top: responsiveHeight(1),
            alignSelf: 'center',
            height: responsiveHeight(17),
            alignItems: 'center',
            // backgroundColor: 'blue',
            justifyContent: 'center',
            width: responsiveWidth(100),
          }}>
          <Text style={styles.headertxt}>LoviBear</Text>
        </View>
        <View
          style={{
            height: responsiveHeight(30),
            overflow: 'hidden',
            marginTop: responsiveHeight(1),
            // justifyContent: 'flex-end',
            // alignSelf: 'flex-end',
          }}>
          <Image
            source={appImages.second}
            style={{
              width: responsiveWidth(107),
              height: responsiveHeight(75),
              resizeMode: 'stretch',
              //   backgroundColor: 'red',
              //   top: responsiveHeight(-50),
            }}
          />
        </View>
        <View
          style={{
            height: responsiveHeight(22),
           position: 'absolute',

            width: responsiveWidth(100),
            bottom: responsiveWidth(0.001),
            alignItems: 'center',
            justifyContent: 'center',
           // marginTop: responsiveHeight(-50),
          }}>
          {loading ? (
            <MyButtonLoader
              title={'LOGIN'}
              buttonColor={appColor.appColorMain}
            />
          ) : (
            <MyButton title={'LOGIN'} onPress={() => {
              if(toggleCheckBox){
                Validations()}
                if(!toggleCheckBox){
                  Alert.alert("Check",'First, Agree with terms and conditions')
                }

              
              }
              }
             
              />
            
          )}
          <View
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
           
            tintColors={{ true: '#ffffff', false: '#ffffff' }}
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              // justifyContent: 'center',
              marginTop: responsiveHeight(1),
            }}>
            <Text style={styles.txt4}>Don't have an account ? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('SignUpWithPhone', {
                  routeFrom: 'emailorphone',
                  userInfo: 'null',
                })
              }>
              <Text style={[styles.txt4, {textDecorationLine: 'underline'}]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={[styles.txt4, {marginVertical: responsiveHeight(0.4)}]}>
            Or
          </Text> */}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginWithPhone;

const styles = StyleSheet.create({
  txt4: {
    textAlign: 'center',
    color: '#fff',
    
    fontSize: responsiveFontSize(1.8),
  },
  txt6: {
    textAlign: 'center',
    color: '#FF0047',
    
    fontSize: responsiveFontSize(1.8),
  },
  headertxt: {
    fontSize: responsiveFontSize(4.5),
    color: '#fff',
    
  },
  maintxt: {
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3),
    width: responsiveWidth(75),
    textAlign: 'center',
    lineHeight: responsiveHeight(4.3),
    alignSelf: 'center',
    
    marginTop: responsiveHeight(-0.8),
  },
  emailparent: {
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D7D7D7',
    marginTop: responsiveHeight(5),
    // paddingVertical: responsiveHeight(0.9),
    width: responsiveWidth(85),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordparent: {
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D7D7D7',
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(0.9),
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(85),
    alignSelf: 'center',
  },
  txtinputemail: {
    width: responsiveWidth(55),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
    paddingLeft: responsiveWidth(2),
    // backgroundColor: 'red',
  },
  txtinputpassword: {
    width: responsiveWidth(59.5),
    paddingLeft: responsiveWidth(3),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  forgetview: {
    marginTop: responsiveHeight(2.5),
    width: responsiveWidth(85),
    alignItems: 'flex-end',
    alignSelf: 'center',
    
  },
  forgettxt: {
    color: '#000000',
    
    fontSize: responsiveFontSize(1.8),
  },
  errortxt: {
    width: responsiveWidth(83),
    alignSelf: 'center',
    color: 'red',
    
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1),
  },
  countrypick: {
    borderWidth: responsiveWidth(0.1),
    borderColor: '#E1E1E5',
    // borderRadius: responsiveWidth(20),
    // paddingHorizontal: responsiveWidth(4.5),
    // marginTop: responsiveHeight(1.5),
    // paddingVertical: responsiveHeight(2.7),
    justifyContent: 'center',
    // borderTopLeftRadius: responsiveWidth(3),
    // borderBottomLeftRadius: responsiveWidth(3),
    paddingLeft: responsiveWidth(1),
    // paddingVertical: responsiveHeight(1),
    width: responsiveWidth(19),
    height: responsiveHeight(9),

    alignSelf: 'flex-start',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  txt5: {
    fontSize: responsiveFontSize(1.8),

    textDecorationLine: 'underline',
    textAlign: 'center',
    color: '#ffffff',
    
  },
});
