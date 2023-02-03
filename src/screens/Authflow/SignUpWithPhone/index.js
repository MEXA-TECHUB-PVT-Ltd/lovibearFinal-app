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
  PermissionsAndroid,
  Permission,
  Alert
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
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
import {DateSelect} from '../../../components/dateTimePicker/dateTimePicker';
import {fontFamily} from '../../../constants/fonts';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import {Modal} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Base_URL} from '../../../Base_URL';
import messaging from '@react-native-firebase/messaging';
import CountryPicker from 'react-native-country-picker-modal';

const SignUpWithPhone = ({navigation, route}) => {
  const refContainer = useRef();
  const [myfocus, setMyfocus] = useState('');
  const [apigender, setApiGender] = useState('');
  const [securepassword, setSecurepassword] = useState(true);
  const [secureconfirmpassword, setSecureConfirmpassword] = useState(true);
  const passwordinputref = useRef();
  const confirmpasswordinputref = useRef();
  const emailinputref = useRef();
  const professionref = useRef();
  const [softinput, setSoftinput] = useState(false);
  const [mydate, setMydate] = useState('');
  const [isVisible, setisVisible] = useState(false);
  const [checkemail, setCheckemail] = useState(false);
  const [checkpassword, setCheckpassword] = useState(false);
  const [checkconfirmpassword, setCheckConfirmpassword] = useState(false);
  const [checkgender, setCheckgender] = useState(false);
  const [checkprofession, setCheckprofession] = useState(false);
  const [gendererror, setGendererror] = useState('');
  const [checkusername, setCheckusername] = useState(false);
  const [emailerror, setEmailerror] = useState('');
  const [passworderror, setPassworderror] = useState('');
  const [confirmpassworderror, setConfirmPassworderror] = useState('');
  const [professionerror, setProfessionerror] = useState('');
  const [usernameerror, setUsernameerror] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [firstchar, setFirstChar] = useState('+');
  const [apiformatdate, setApiFormatDate] = useState('');
  const [mylat, setMylat] = useState();
  const [mylong, setMylong] = useState();
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setcountryCode] = useState('PK');
  const [callingCode, setcallingCode] = useState('1');
  const [countryname, setcountryname] = useState('Country');
  const OnSelect = country => {
    console.log('country', country);
    const {cca2, callingCode, name} = country;
    setcountryCode(cca2);
    setcallingCode(callingCode[0]);
    setcountryname(name);
  };
  const {routeFrom, userInfo} = route.params;
  console.log('ROUTE FROM IN SIGN UP ==============', routeFrom, userInfo);

  let regchecknumber = /^[0-9]*$/;
  let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
  let regphone =
    /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
  console.log('MYDATE==================', mydate);
  useFocusEffect(
    React.useCallback(() => {
      setSoftinput(true);
    }, []),
  );
  useEffect(() => {
    CheckingRoute();
    getLocation();
    checkPermission();
  }, []);
  const CheckingRoute = () => {
    if (routeFrom == 'google') {
      setUsername(userInfo.name);
      setEmail(userInfo.email);
      setPassword(userInfo.id);
      setConfirmPassword(userInfo.id);
    }
  };

  const getLocation = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    await Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setMylat(position.coords.latitude);
        setMylong(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        navigation.goBack();
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const checkPermission = async () => {
    console.log('check permission function call');
    const enabled = await messaging().hasPermission();
    messaging().notifi;
    console.log('check permission function call enable', enabled);
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  };
  const getToken = async () => {
    console.log('get token call');
    const fcmToken = await messaging().getToken();
    console.log('check fcm token', fcmToken);
    await AsyncStorage.setItem('Device_id', fcmToken);
    const asyncFcmToken = await AsyncStorage.getItem('Device_id');
    console.log('ASYNC FCM TOKEN=============', asyncFcmToken);
  };
  const requestPermission = async () => {
    console.log('requestPermission call');
    try {
      await messaging().requestPermission();
      getToken();
    } catch (error) {}
  };

  const Validations = () => {
    if (username == '') {
      setCheckusername(true);
      setUsernameerror('Enter Username');
      return false;
    }
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
    if (gender == '') {
      setCheckgender(true);
      setGendererror('Select Gender');
      return false;
    }
    if (profession == '') {
      setCheckprofession(true);
      setProfessionerror('Enter Profession');
      return false;
    }
    if (password == '') {
      setCheckpassword(true);
      setPassworderror('Enter Valid Password');
      return false;
    }
   
    if (password.length < 6) {
      setCheckpassword(true);
      setPassworderror('Password should be greater than six characters!');
      return false;
    }
    if (password != confirmpassword) {
      setCheckConfirmpassword(true);
      setConfirmPassworderror("Password Doesn't Match");
      return false;
    }
    if (moment().diff(moment(mydate, 'DD-MM-YYYY'), 'years') < 18) {
      refContainer.current.open();
      return false;
    }
    if (mydate == '') {
      refContainer.current.open();
      return false;
    }

    if (
      checkpassword == false &&
      checkemail == false &&
      checkusername == false &&
      checkconfirmpassword == false &&
      mydate !== '' &&
      moment().diff(moment(mydate, 'DD-MM-YYYY'), 'years') > 18
    ) {
      SignUpApi();
    }
  };

  const SignUpApi = async () => {
    setLoading(true);
    console.log('ALL NUMBER===========', firstchar + callingCode + email);
    const myfcm = await AsyncStorage.getItem('Device_id');
    var formdata = new FormData();

    formdata.append('userName', username);
    formdata.append('password', password);
    formdata.append('gender', apigender);
    formdata.append('dateOfBirth', apiformatdate);
    formdata.append('profession', profession);
    formdata.append(
      'location',
      ' {"coordinates":[' + mylong + ',' + mylat + '] }',
    );
    formdata.append('fcmToken', myfcm);
    formdata.append('phoneNumber', firstchar + callingCode + email);
    formdata.append('signupType', 'phoneNumber');

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };
    await fetch(Base_URL + '/user/register', requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(
        //   'THE RESULT FIRST==========',
        //   result.result.location.coordinates[0],
        // );
        console.log('THE RESULT SECOND==========', result);

        console.log('THE RESULT==========', result.message);
        if (result.message == 'this phone Number already exists') {
          setCheckemail(true);
          setEmailerror('Phone Number Already Registered');
          setLoading(false);
        } else if (result.message == 'email already in exists') {
          setCheckemail(true);
          setEmailerror('Email Already Registered');
          setLoading(false);
        } else {
          setLoading(false);

          if (routeFrom == 'google') {
            navigation.navigate('AddProfileImage', {
              routeFrom: routeFrom,
              userid: result.result._id,
              mylong: result.result.location.coordinates[0],
              mylat: result.result.location.coordinates[1],
              email: userInfo.email,
              password: userInfo.id,
              screenFrom: 'signup',
            });
          } else {
            navigation.navigate('AddProfileImage', {
              routeFrom: routeFrom,
              userid: result.result._id,
              mylong: result.result.location.coordinates[0],
              mylat: result.result.location.coordinates[1],
              phoneNumber: result.result.phoneNumber,
              password: password,
              screenFrom: 'signup',
            });
          }
        }
      })

      .catch(error => console.log('error', error));
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
          <Text style={styles.maintxt}>Create Account</Text>

          <View
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'username' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.user}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              editable={routeFrom == 'google' ? false : true}
              placeholderTextColor={'#8D8D8D'}
              showSoftInputOnFocus={
                routeFrom == 'google' ? !softinput : softinput
              }
              autoFocus={routeFrom == 'google' ? false : true}
              value={username}
              onChangeText={text => {
                setUsername(text);
                setCheckusername(false);
              }}
              selectionColor={appColor.appColorMain}
              placeholder="Username"
              style={styles.txtinputusername}
              onFocus={() => setMyfocus('username')}
              onBlur={() => setMyfocus('')}
             // onSubmitEditing={() => emailinputref.current.focus()}
              blurOnSubmit={false}
              returnKeyType={'next'}
            />
          </View>
          {checkusername ? (
            <Text style={styles.errortxt}>{usernameerror}</Text>
          ) : null}
          <View
            style={[
              styles.numberparent,
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

                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                pointerEvents="none">
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
              }}
              placeholderTextColor={'#8D8D8D'}
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
          <TouchableOpacity
            onPress={() => {
              showModal();
            }}
            activeOpacity={0.7}
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'gender' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.gender}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              editable={false}
              placeholderTextColor={'#8D8D8D'}
              value={gender}
              selectionColor={appColor.appColorMain}
              placeholder="Gender"
              style={styles.txtinputusername}
              onFocus={() => setMyfocus('gender')}
              onBlur={() => setMyfocus('')}
              // onSubmitEditing={() => emailinputref.current.focus()}
              blurOnSubmit={false}
              returnKeyType={'next'}
            />
          </TouchableOpacity>
          {checkgender ? (
            <Text style={styles.errortxt}>{gendererror}</Text>
          ) : null}
          <View
            style={[
              styles.emailparent,
              {
                borderColor:
                  myfocus == 'profession' ? appColor.appColorMain : '#D7D7D7',
              },
            ]}>
            <Image
              source={appImages.profession}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
                // backgroundColor: 'red',
                marginLeft: responsiveWidth(5),
              }}
            />
            <TextInput
              value={profession}
              onChangeText={text => {
                setProfession(text);
                setCheckprofession(false);
              }}
              placeholderTextColor={'#8D8D8D'}
              selectionColor={appColor.appColorMain}
              placeholder="Profession"
              style={styles.txtinputusername}
              onFocus={() => setMyfocus('profession')}
              onBlur={() => setMyfocus('')}
              onSubmitEditing={() => passwordinputref.current.focus()}
              ref={professionref}
              blurOnSubmit={false}
              returnKeyType={'next'}
            />
          </View>
          {checkprofession ? (
            <Text style={styles.errortxt}>{professionerror}</Text>
          ) : null}
          {routeFrom != 'google' ? (
            <>
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
                    width: responsiveWidth(5.5),
                    height: responsiveWidth(5.5),
                    // backgroundColor: 'red',
                    marginLeft: responsiveWidth(5),
                  }}
                />
                <TextInput
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setCheckpassword(false);
                  }}
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  placeholderTextColor={'#8D8D8D'}
                  selectionColor={appColor.appColorMain}
                  placeholder="Password"
                  style={styles.txtinputpassword}
                  onFocus={() => setMyfocus('password')}
                  onBlur={() => setMyfocus('')}
                  secureTextEntry={securepassword}
                  ref={passwordinputref}
                  onSubmitEditing={() =>
                    confirmpasswordinputref.current.focus()
                  }
                />
                <EyeIcon
                  style={{
                    fontSize: responsiveFontSize(3.7),
                    color: 'lightgray',
                  }}
                  name={securepassword ? 'eye-off' : 'eye'}
                  onPress={() => setSecurepassword(!securepassword)}
                />
              </View>
              {checkpassword ? (
                <Text style={styles.errortxt}>{passworderror}</Text>
              ) : null}
            </>
          ) : null}

          {routeFrom != 'google' ? (
            <>
              <View
                style={[
                  styles.passwordparent,
                  {
                    borderColor:
                      myfocus == 'confirmpassword'
                        ? appColor.appColorMain
                        : '#D7D7D7',
                  },
                ]}>
                <Image
                  source={appImages.password}
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(5.5),
                    height: responsiveWidth(5.5),
                    // backgroundColor: 'red',
                    marginLeft: responsiveWidth(5),
                  }}
                />
                <TextInput
                  value={confirmpassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    setCheckConfirmpassword(false);
                  }}
                  placeholderTextColor={'#8D8D8D'}
                  selectionColor={appColor.appColorMain}
                  placeholder="Confirm Password"
                  style={styles.txtinputpassword}
                  onFocus={() => setMyfocus('confirmpassword')}
                  onBlur={() => setMyfocus('')}
                  secureTextEntry={secureconfirmpassword}
                  ref={confirmpasswordinputref}
                />
                <EyeIcon
                  style={{
                    fontSize: responsiveFontSize(3.7),
                    color: 'lightgray',
                  }}
                  name={secureconfirmpassword ? 'eye-off' : 'eye'}
                  onPress={() =>
                    setSecureConfirmpassword(!secureconfirmpassword)
                  }
                />
              </View>
              {checkconfirmpassword ? (
                <Text style={styles.errortxt}>{confirmpassworderror}</Text>
              ) : null}
            </>
          ) : null}

          <DateSelect
            getDate={date => setMydate(date)}
            getApiDate={date => setApiFormatDate(date)}
            value={mydate}
          />
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
            height: responsiveHeight(28),
            overflow: 'hidden',
            // marginTop: responsiveHeight(8),
            // justifyContent: 'flex-end',
            // alignSelf: 'flex-end',
          }}>
          <Image
            source={appImages.second}
            style={{
              width: responsiveWidth(107),
              height: responsiveHeight(85),
              resizeMode: 'stretch',
              //   backgroundColor: 'red',
              //   top: responsiveHeight(-50),
            }}
          />
        </View>
        <View
          style={{
            height: responsiveHeight(20),
            position: 'absolute',

            width: responsiveWidth(100),
            bottom: responsiveWidth(0.001),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {loading ? (
            <MyButtonLoader
              title={'SIGN UP'}
              buttonColor={appColor.appColorMain}
            />
          ) : (
            <MyButton
              title={'SIGN UP'}
              onPress={() => {
                Validations();
              }}
            />
          )}

          <View style={{flexDirection: 'row', marginTop: responsiveHeight(4)}}>
            <Text style={styles.txt4}>Already Have an Account ? </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('LoginWithPhone')}>
              <Text style={styles.txt4}>Login</Text>
            </TouchableOpacity>
          </View>
         
        </View>
        
      </ScrollView>
      <Modal visible={visible} onDismiss={hideModal}>
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            width: responsiveWidth(65),
            paddingVertical: responsiveHeight(2),
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setCheckgender(false);
              professionref.current.focus();
              setGender('Male');
              setApiGender('male');
              hideModal();
            }}
            style={styles.genderview}>
            <Text style={styles.genderselecttxt}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCheckgender(false);
              professionref.current.focus();

              setGender('Female');
              setApiGender('female');
              hideModal();
            }}
            style={styles.genderview}>
            <Text style={styles.genderselecttxt}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCheckgender(false);
              setGender('Trans-men');
              professionref.current.focus();

              setApiGender('transmen');
              hideModal();
            }}
            style={styles.genderview}>
            <Text style={styles.genderselecttxt}>Trans-men</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCheckgender(false);
              setGender('Trans-women');
              professionref.current.focus();

              setApiGender('transwomen');
              hideModal();
            }}
            style={styles.genderview}>
            <Text style={styles.genderselecttxt}>Trans-women</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <RBSheet
        ref={refContainer}
        openDuration={250}
        animationType="fade"
        customStyles={{
          container: {
            // height: responsiveHeight(50),
            borderTopRightRadius: responsiveWidth(7),
            borderTopLeftRadius: responsiveWidth(7),
          },
        }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <Image
            source={appImages.alert}
            style={{
              width: responsiveWidth(18),
              height: responsiveWidth(18),
              alignSelf: 'center',
              marginTop: responsiveHeight(2.8),
            }}
          />
          <Text
            style={{
              alignSelf: 'center',
              color: appColor.appColorMain,
              
              fontSize: responsiveFontSize(2.3),
              textAlign: 'center',
              width: responsiveWidth(90),
              marginBottom: responsiveHeight(2),
            }}>
            You Should Be 18+ To Use this App
          </Text>
          <MyButton
            myStyles={{
              backgroundColor: appColor.appColorMain,
              marginBottom: responsiveHeight(2.8),
            }}
            title={'OK'}
            itsTextstyle={{
              color: '#fff',
            }}
            onPress={() => refContainer.current.close()}
          />
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  );
};

export default SignUpWithPhone;

const styles = StyleSheet.create({
  txt4: {
    textAlign: 'center',
    color: '#fff',
    
    fontSize: responsiveFontSize(1.8),
  },
  headertxt: {
    fontSize: responsiveFontSize(4.5),
    color: '#fff',
    
  },
  maintxt: {
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.2),
    alignSelf: 'center',
    
    marginTop: responsiveHeight(-0.8),
  },
  emailparent: {
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D7D7D7',
    marginTop: responsiveHeight(3),
    paddingVertical: responsiveHeight(0.9),
    width: responsiveWidth(85),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberparent: {
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D7D7D7',
    marginTop: responsiveHeight(3),
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
    marginTop: responsiveHeight(3),
    paddingVertical: responsiveHeight(0.9),
    flexDirection: 'row',
    alignItems: 'center',
    width: responsiveWidth(85),
    alignSelf: 'center',
  },
  txtinputemail: {
    width: responsiveWidth(70),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  txtinputusername: {
    width: responsiveWidth(70),
    paddingLeft: responsiveWidth(3),
    color: '#080808',
    
    fontSize: responsiveFontSize(2),
  },
  errortxt: {
    width: responsiveWidth(83),
    alignSelf: 'center',
    color: 'red',
    
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1),
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
  forgetview: {
    marginTop: responsiveHeight(2.5),
    width: responsiveWidth(85),
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  forgettxt: {
    color: '#000000',
  },
  genderview: {
    paddingVertical: responsiveHeight(2),
    width: responsiveWidth(65),
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  genderselecttxt: {
    color: '#000000',
    
    fontSize: responsiveFontSize(2.3),
  },
  countrypick: {
    borderWidth: responsiveWidth(0.1),
    borderColor: '#E1E1E5',
    justifyContent: 'center',
    paddingLeft: responsiveWidth(1),
    width: responsiveWidth(19),
    height: responsiveHeight(9),
    alignSelf: 'flex-start',
    borderTopLeftRadius: responsiveWidth(3),
    borderBottomLeftRadius: responsiveWidth(3),
  },
});
