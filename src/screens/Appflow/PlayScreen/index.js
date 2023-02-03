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
  FlatList,
  Animated,
  RefreshControl,
  Platform,
  PermissionsAndroid,
  Alert,
  BackHandler,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Dialog from 'react-native-dialog';
import ImagePicker from 'react-native-image-crop-picker';
import {
  ThumbDouble,
  RailSelectedDouble,
  RailDouble,
  NotchDouble,
  LabelDouble,
} from '../../../components/SliderDouble';
import React, {useEffect, useRef, useState} from 'react';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MyHeart from '../../../components/MyHeart';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {MyButton} from '../../../components/MyButton';
import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';
import SliderDouble from 'rn-range-slider';

import {fontFamily} from '../../../constants/fonts';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Base_URL} from '../../../Base_URL';
import {ActivityIndicator, Modal} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useSelector, useDispatch} from 'react-redux';
import {setFromRoute, setRouteCard} from '../../../redux/actions';
import {useCallback} from 'react';

const PlayScreen = ({route, navigation}) => {
  const renderThumbdouble = useCallback(() => <ThumbDouble />, []);
  const renderRaildouble = useCallback(() => <RailDouble />, []);
  const renderRailSelecteddouble = useCallback(
    () => <RailSelectedDouble />,
    [],
  );
  const renderLabeldouble = useCallback(
    value => <LabelDouble text={value} />,
    [],
  );
  const renderNotchdouble = useCallback(() => <NotchDouble />, []);
  const handleValueChangeDistance = useCallback((low, high) => {
    setMindistancedouble(low);
    setMaxdistancedouble(high);
  }, []);
  const handleValueChangeDistance2 = useCallback((low2, high2) => {
    setMindistance(0);
    setMaxdistance(high2);
  }, []);
  const [mindistancedouble, setMindistancedouble] = useState(18);
  const [maxdistancedouble, setMaxdistancedouble] = useState(60);
  const dispatch = useDispatch();
  const {fromroute, routecard} = useSelector(state => state.userReducer);
  const [mylat, setMylat] = useState();
  const [mylong, setMylong] = useState();
  const [gettinglocation, setGettinglocation] = useState(true);
  const [swipeduser, setSwipedUser] = useState();
  const [undostatus, setUndoStatus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [firsttime, setFirsttime] = useState(true);
  const [dofilter, setDoFilter] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [modaltype, setModalType] = useState('');
  const [routefirsttime, setRouteFirstTime] = useState(true);
  const [pagination, setPagination] = useState(1);
  const [paginationref, setPaginationRef] = useState(false);
  const [bypost, setByPost] = useState('');
  const [minage, setMinAge] = useState(0);
  const [maxage, setMaxAge] = useState(100);
  const [myradius, setMyRadius] = useState('100');
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [gender, setGender] = useState('');
  const [CardsList, setCardsList] = useState([]);
  const refContainer = useRef();
  const [cardIndex, setCardIndex] = useState(0);
  const [thereference, setReference] = useState(true);
  const [radiusconfirm, setRadiusConfirm] = useState(false);
  const [confirmage, setConfirmAge] = useState(false);
  useEffect(() => {
    // getLocation();
    getuid();
  }, []);
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
    FromRoutes();
  }, [fromroute, routecard]);
  useEffect(() => {
    SingleCompleteFilter();
  }, [
    bypost,
    gender,
    minage,
    maxage,
    paginationref,
    radiusconfirm,
    confirmage,
  ]);

  const getuid = async () => {
    const userid = await AsyncStorage.getItem('userid');
    console.log('THE LOGIN USER ID ===========', userid);
  };

  const SingleCompleteFilter = async () => {
    setLoading(true);
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
    Geolocation.getCurrentPosition(async position => {
      console.log(position);
      setMylat(position.coords.latitude);
      setMylong(position.coords.longitude);
      CompleteFunctionResults(
        position.coords.latitude,
        position.coords.longitude,
      );
      error => {
        console.log(error.code, error.message);
        Alert.alert('Enable Location', 'Your location is required to proceed', [
          {
            text: 'OK',
            onPress: () => {
              SingleCompleteFilter();
            },
          },
        ]);
      },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000};
    });
  };

  const CompleteFunctionResults = async (customlat, customlong) => {
    console.log('PAGINATION=================', pagination);
    console.log('GENDER=================', gender);
    console.log('POST=================', bypost);
    console.log('MINAGE=================', mindistancedouble);
    console.log('MAXAGE=================', maxdistancedouble);
    console.log('CUSTOMLAT=============', customlat);
    console.log('CUSTOMLAT=============', customlong);
    console.log('MYRADIUS==============', myradius);
    console.log('FUNCTION STARTING');
    const userid = await AsyncStorage.getItem('userid');
    console.log('THE USER ID====================', userid);
    var axios = require('axios');
    var data = JSON.stringify({
      long: customlong,
      lat: customlat,
      radiusInKm: myradius,
      userId: userid,
    });
    var config = {
      method: 'post',
      url:
        Base_URL +
        '/user/usersInRadius/?page=' +
        pagination +
        '&limit=5' +
        '&gender=' +
        gender +
        '&byPosts=' +
        bypost +
        '&min_age=' +
        mindistancedouble +
        '&max_age=' +
        maxdistancedouble,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    console.log('FUNCTION MIDWAY');

    await axios(config)
      .then(response => {
        console.log('FUNCTION CONCLUSTION');

        // console.log(JSON.stringify('THE CARD LIST============', response.data));
        console.log('THE RESPONSE===========', response.data);
        if (response.data.users.length == 0) {
          console.log('No Results Found');
          setEmpty(true);
          setLoading(false);
        } else {
          setCardIndex(0);
          console.log('THE RESPONSE');
          // let myarr = response.data.users.filter(item => {
          //   return item._id !== userid;
          // });
          // setCardsList(myarr);
          setCardsList(response.data.users);
          console.log('THE CARD LIST================', response.data.users);
          // var thevar = response.data.users.map(item => {
          //   return item.document.userName;
          // });
          // console.log('THE VAR IN SIMPLE FILTER============', thevar);
          setEmpty(false);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log('FUNCTION CONCLUSTION');

        console.log('MY ERROR========', error);
        console.log(error.response.data);
        if (error.response.data.message == 'No user found with this query') {
          console.log('No Results Found');
          setPagination(pagination - 1);
          setEmpty(true);
          setLoading(false);
        }
      });
  };

  const FromRoutes = async () => {
    console.log('CHECKING ROUTE ==', fromroute);
    console.log('CHECKING ROUTE CARD ==', routecard);
    // console.log('REFERENCE INDEX==========', indexreference);
    if (fromroute == 'discover' || fromroute == 'search') {
      console.log('ROUTE FROM ============', fromroute);
      // console.log('REFERENCE INDEX==========', indexreference);
      setLoading(true);
      if (routefirsttime == true) {
        let _arr = [...CardsList];
        await _arr.splice(cardIndex, 0, routecard);
        setCardsList(_arr);
        // setCardIndex(0)
        setTimeout(() => {
          // dispatch(setRouteCard({}));
          dispatch(setFromRoute(''));
          setLoading(false);
          setEmpty(false);
        }, 700);
      }
    }
  };

  // APIS CALLS BELOW

  const RightSwipeApi = async rightswipedid => {
    console.log('RIGHT SWIPED USER ID============', rightswipedid);
    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');
    var data = JSON.stringify({
      swipedBy: userid,
      swipedUser: rightswipedid[0]._id,
    });

    var config = {
      method: 'put',
      url: Base_URL + '/swipe/rightSwipeUser',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        console.log('THE CARD INDEX======', cardIndex);
        console.log('THE LIST LENGTH=====', CardsList.length);

        if (response.data.result.matchFound == true) {
          sendMatchNotification(
            response.data.result.result.swipedBy,
            response.data.result.result.swipedUser,
            rightswipedid,
          );
          const myuserid = await AsyncStorage.getItem('userid');
          const myimg = await AsyncStorage.getItem('profileimage');

          navigation.navigate('Bingo', {
            myuserid: myuserid,
            myimg: myimg,
            userdata: response.data.result.result.swipedUser,
          });
        }
        console.log(
          'API RESPONSE AFTER RIGHT SWIPING============',
          response.data,
        );
        sendRightSwipeNotification(
          response.data.result.result.swipedBy,
          response.data.result.result.swipedUser,
          rightswipedid,
        );
        if (response.data.message == 'user has successfully right swiped') {
          setUndoStatus(true);
        }
      })

      .catch(function (error) {
        console.log(error);
      });
  };

  const sendRightSwipeNotification = async (myid, swipedid, rightswipedid) => {
    var axios = require('axios');
    var data = JSON.stringify({
      senderId: myid,
      receiverId: swipedid,
      senderType: 'user',
      receiverType: 'user',
      body: 'You got right swiped by',
    });

    var config = {
      method: 'post',
      url: Base_URL + '/notification/createNotification',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log('SENDING NOTI RIGHT ===============', response.data);
        FirebaseRight(rightswipedid, response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const FirebaseRight = async (swipeduser, senderDetail) => {
    console.log(
      'SWIPED USER FCM TOKEN===================',
      swipeduser[0].document.fcmToken,
    );
    var axios = require('axios');
    var data = JSON.stringify({
      registration_ids: [swipeduser[0].document.fcmToken],
      notification: {
        title: 'LoviBear',
        body: 'You got right swiped by ' + senderDetail.name,
        mutable_content: true,
        sound: 'Tri-tone',
        icon: 'ic_noti',
        color: 'purple',
      },
    });

    var config = {
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAbAHNGv8:APA91bEt5KW6o-qgxKeb39lOIY3nIdsJP6FOj7hK0kBR_aeHQ2clJXa4g9ySbdKX1WzdZi78HXdJ5A2JXJXpHKYbcmwgv0E-KhNXKhNK0hLv6m3xlYMGy1jeFUvtsi55l4iv16OpJTJC',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sendMatchNotification = async (myid, swipedid, rightswipedid) => {
    var axios = require('axios');
    var data = JSON.stringify({
      senderId: myid,
      receiverId: swipedid,
      senderType: 'user',
      receiverType: 'user',
      body: 'You found a match with',
    });

    var config = {
      method: 'post',
      url: Base_URL + '/notification/createNotification',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log('SENDING NOTI MATCH ===============', response.data);
        FirebaseMatch(rightswipedid, response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const FirebaseMatch = async (swipeduser, senderDetail) => {
    console.log(
      'SWIPED USER FCM TOKEN===================',
      swipeduser[0].document.fcmToken,
    );
    var axios = require('axios');
    var data = JSON.stringify({
      registration_ids: [swipeduser[0].document.fcmToken],
      notification: {
        title: 'LoviBear',
        body: 'You got a match with ' + senderDetail.name,
        mutable_content: true,
        sound: 'Tri-tone',
        icon: 'ic_noti',
        color: 'purple',
      },
    });

    var config = {
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAbAHNGv8:APA91bEt5KW6o-qgxKeb39lOIY3nIdsJP6FOj7hK0kBR_aeHQ2clJXa4g9ySbdKX1WzdZi78HXdJ5A2JXJXpHKYbcmwgv0E-KhNXKhNK0hLv6m3xlYMGy1jeFUvtsi55l4iv16OpJTJC',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const LeftSwipeApi = async leftswipedid => {
    console.log('LEFT SWIPED USER ID============', leftswipedid);
    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');
    var data = JSON.stringify({
      swipedBy: userid,
      swipedUser: leftswipedid[0]._id,
    });

    var config = {
      method: 'put',
      url: Base_URL + '/swipe/leftSwipeUser',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log(
          'API RESPONSE AFTER LEFT SWIPING============',
          response.data,
        );
        if (response.data.message == 'user has successfully left swiped') {
          setUndoStatus(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const RewindCardApi = async () => {
    setLoading(true);
    setUndoStatus(false);
    setTimeout(() => {
      setUndoStatus(false);
    }, 300);
    setTimeout(() => {
      setUndoStatus(false);
    }, 600);
    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');
    var config = {
      method: 'delete',
      url:
        Base_URL +
        '/swipe/deleteSwipeByUsers_id/?swipedBy=' +
        userid +
        '&swipedUser=' +
        swipeduser[0]._id,
      headers: {},
    };
    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setLoading(false);
      })
      .catch(function (error) {
        console.log('THE ERROR ON REWIND====', error.response);
        console.log(error);
        setLoading(false);
      });
  };

  // API CALLS ABOVE

  const [categorylist, setCategorylist] = useState([
    {
      id: 1,
      title: 'Posts',
      image: appImages.postsoption,
      onPress: () => {
        setModalType('posts');
        showModal();
        refContainer.current.close();
      },
    },
    {
      id: 2,
      title: 'Bio',
      image: appImages.biooption,
      onPress: () => {
        setModalType('bio');
        showModal();

        refContainer.current.close();
      },
    },
    {
      id: 3,
      title: 'Location',
      image: appImages.locationoption,
      onPress: () => {
        setModalType('location');
        showModal();

        refContainer.current.close();
      },
    },
    {
      id: 4,
      title: 'Age',
      image: appImages.ageoption,
      onPress: () => {
        setModalType('age');
        showModal();

        refContainer.current.close();
      },
    },
  ]);
  const renderItemCategory = ({item}) => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        activeOpacity={0.6}
        style={{
          width: responsiveWidth(83),
          alignSelf: 'center',

          paddingVertical: responsiveHeight(2),
          borderBottomWidth: responsiveWidth(0.2),
          borderColor: '#EBEBEB',
          flexDirection: 'row',
        }}>
        <Image
          source={item.image}
          resizeMode="contain"
          style={{width: responsiveWidth(5), height: responsiveWidth(5)}}
        />
        <Text
          style={{
            color: '#9D9D9D',
            
            fontSize: responsiveFontSize(2),
            marginLeft: responsiveWidth(4),
          }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const [mysize, setMysize] = useState(3);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [myvalue, setMyvalue] = useState(0);
  const [buttondirection, setButtonDirection] = useState('');
  const [processing, setProcessing] = useState(false);
  const fadeInRight = async () => {
    setButtonDirection('right');
    await Animated.timing(fadeAnim, {
      useNativeDriver: false,
      toValue: 1,
      duration: 300,
    }).start();
    await setTimeout(() => {
      console.log('HERE');
      Animated.timing(fadeAnim, {
        useNativeDriver: false,
        toValue: 0,
        duration: 80,
      }).start();
      swiperRef.current.swipeRight();
    }, 300);
    // await setTimeout(() => {
    //   RightSwipeApi();
    // }, 850);
  };
  const fadeInLeft = async () => {
    setButtonDirection('left');
    await Animated.timing(fadeAnim, {
      useNativeDriver: false,
      toValue: 1,
      duration: 300,
    }).start();
    await setTimeout(() => {
      console.log('HERE');
      Animated.timing(fadeAnim, {
        useNativeDriver: false,
        toValue: 0,
        duration: 80,
      }).start();
      swiperRef.current.swipeLeft();
    }, 300);
  };
  // const fadeInTop = async () => {
  //   setProcessing(true);

  //   setButtonDirection('top');
  //   await Animated.timing(fadeAnim, {
  //     useNativeDriver: false,
  //     toValue: 1,
  //     duration: 350,
  //   }).start();
  //   await setTimeout(() => {
  //     console.log('HERE');
  //     Animated.timing(fadeAnim, {
  //       useNativeDriver: false,
  //       toValue: 0,
  //       duration: 80,
  //     }).start();
  //     swiperRef.current.swipeTop();
  //     setProcessing(false);
  //   }, 350);
  // };

  const swiperRef = useRef();
  const Card = item => {
    console.log('ITEM DOUCMEN===========', item.document.profileImage);
    return (
      <View style={styles.mycard}>
        <Image
          source={
            item.document.profileImage == undefined
              ? appImages.noimg
              : {uri: item.document.profileImage.userPicUrl}
          }
          style={styles.cardimage}
        />

        <LinearGradient
          colors={['rgba(255, 255, 255,1)', 'rgba(255, 255, 255,1)']}
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: responsiveWidth(-0.1),
            width: responsiveWidth(100),
            paddingBottom: responsiveHeight(1.5),
            paddingTop: responsiveHeight(1.5),
          }}>
          <Text style={styles.txt1}>
            {item.document.userName}, {parseInt(item.Age)}
          </Text>
          <Text style={styles.txt2}>
            {item.document.dist.distance_km.toString().charAt(0) == 0
              ? 'Less than 1 km ,'
              : item.document.dist.distance_km.toFixed(1) + 'km ,'}

            {' ' + item.document.profession}
          </Text>
        </LinearGradient>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // alignItems: 'center',

        backgroundColor: '#fff',
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <StatusBar
          hidden={false}
          // translucent={true}
          backgroundColor={'#fff'}
          barStyle={'dark-content'}
        />

        <View style={styles.header}>
          <Text style={styles.headertxt}>Play Match Game</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loading ? true : false}
              onPress={() =>
                navigation.navigate('Search', {routeArray: CardsList})
              }>
              <FastImage
                source={appImages.searchicon}
                resizeMode="contain"
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  marginRight: responsiveWidth(7),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading ? true : false}
              activeOpacity={0.6}
              onPress={() => refContainer.current.open()}>
              <FastImage
                source={appImages.filtericon}
                resizeMode="contain"
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.swipercontainer}>
          <View
            style={{
              position: 'absolute',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}>
            {buttondirection == 'right' ? (
              <Animated.View style={{opacity: myvalue == 0 ? fadeAnim : null}}>
                <Image
                  source={appImages.yeplabel}
                  style={{
                    width: responsiveWidth(40),
                    height: responsiveWidth(40),
                    resizeMode: 'contain',
                  }}
                />
              </Animated.View>
            ) : buttondirection == 'left' ? (
              <Animated.View style={{opacity: fadeAnim}}>
                <Image
                  source={appImages.nopelabel}
                  style={{
                    width: responsiveWidth(40),
                    height: responsiveWidth(40),
                    resizeMode: 'contain',
                  }}
                />
              </Animated.View>
            ) : buttondirection == 'top' ? (
              <Animated.View style={{opacity: fadeAnim}}>
                <Image
                  source={appImages.superlabel}
                  style={{
                    width: responsiveWidth(90),
                    height: responsiveWidth(90),
                    resizeMode: 'contain',
                  }}
                />
              </Animated.View>
            ) : null}
          </View>

          {loading ? (
            <View
              style={{
                height: responsiveHeight(55),
                width: responsiveWidth(80),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: appColor.appColorMain,
                  
                  fontSize: responsiveFontSize(3),
                  marginBottom: responsiveHeight(2),
                }}>
                Please Wait ...
              </Text>
              <ActivityIndicator size={'large'} color={appColor.appColorMain} />
            </View>
          ) : empty ? (
            <View
              style={{
                height: responsiveHeight(57),
                width: responsiveWidth(80),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.headertxt}>End Of Results</Text>
            </View>
          ) : (
            <Swiper
              animateOverlayLabelsOpacity
              stackSize={3}
              stackScale={6}
              stackSeparation={24}
              showSecondCard={true}
              verticalSwipe={false}
              overlayLabels={{
                right: {
                  element: (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                      }}>
                      <Image
                        source={appImages.yeplabel}
                        style={{
                          width: responsiveWidth(40),
                          height: responsiveWidth(40),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  ),
                },
                left: {
                  element: (
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={appImages.nopelabel}
                        style={{
                          width: responsiveWidth(40),
                          height: responsiveWidth(40),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  ),
                },
                top: {
                  element: (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                      }}>
                      <Image
                        source={appImages.superlabel}
                        style={{
                          width: responsiveWidth(90),
                          height: responsiveWidth(90),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  ),
                },
              }}
              containerStyle={{
                height: responsiveHeight(62),
              }}
              cardVerticalMargin={0}
              // infinite={true}
              backgroundColor="transparent"
              cardStyle={{height: responsiveHeight(62)}}
              cards={CardsList}
              cardIndex={cardIndex}
              // cardIndex={0}
              horizontalSwipe={true}
              swipeAnimationDuration={300}
              onSwipedRight={cardIndex => {
                let arr = CardsList.filter((item, index) => {
                  return index == cardIndex;
                });
                RightSwipeApi(arr);
                setSwipedUser(arr);

                setProcessing(false);
              }}
              onSwiped={cardIndex => {
                // if (cardIndex == CardsList.length - 2) {
                //   console.log('ON FINAL CARD');
                //   getLocation();
                // }
                setCardIndex(cardIndex + 1);
                FromRoutes();
                console.log('Swiped');
                swiperRef.current.state.pan.setOffset({x: 0, y: 0});
                console.log('THE LIST AFTER SWIPING===========', CardsList);
              }}
              onSwiping={item => {
                console.log('ITS SWIPING CONTINOUS===========', item);
                setProcessing(true);
              }}
              onSwipedAborted={item => {
                console.log('SWIPED ABORTED============', item);
                setProcessing(false);
              }}
              onSwipedLeft={cardIndex => {
                let arr = CardsList.filter((item, index) => {
                  return index == cardIndex;
                });
                LeftSwipeApi(arr);
                setSwipedUser(arr);
                setProcessing(false);
              }}
              renderCard={item => Card(item)}
              ref={swiperRef}
              onSwipedAll={() => {
                setPagination(pagination + 1);
                setPaginationRef(!paginationref);
              }}
            />
          )}
        </View>
        <View style={styles.buttonsparent}>
          <TouchableOpacity
            disabled={
              processing == true || loading == true || empty == true
                ? true
                : false
            }
            onPress={() => {
              setProcessing(true);
              fadeInLeft();
              setTimeout(() => {
                setProcessing(false);
              }, 850);
            }}
            style={styles.buttonview3}
            activeOpacity={0.7}>
            <Image
              style={styles.cardicon}
              resizeMode="contain"
              source={appImages.leftcard}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              processing == true ||
              loading == true ||
              undostatus == false ||
              cardIndex == 0
                ? true
                : false
            }
            style={styles.buttonview3}
            activeOpacity={0.7}
            onPress={() => {
              if (undostatus == true) {
                // if (cardIndex !== 0) {
                console.log('HERE AT UNDO BUTTON PRESS');
                RewindCardApi();
                setEmpty(false);
                setCardIndex(cardIndex - 1);
                // }
              }
            }}>
            <Image
              style={styles.cardicon}
              resizeMode="contain"
              source={appImages.reloadcard}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              processing == true || loading == true || empty == true
                ? true
                : false
            }
            onPress={() => {
              setProcessing(true);

              fadeInRight();
              setTimeout(() => {
                setProcessing(false);
              }, 850);
            }}
            style={styles.buttonview2}
            activeOpacity={0.7}>
            <Image
              style={styles.cardicon}
              resizeMode="contain"
              source={appImages.rightcard}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <RBSheet
        ref={refContainer}
        openDuration={250}
        animationType="slide"
        customStyles={{
          container: {
            height: responsiveHeight(38),
            borderTopRightRadius: responsiveWidth(7),
            borderTopLeftRadius: responsiveWidth(7),
          },
        }}>
        <View style={{flex: 1,}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: responsiveWidth(85),
              alignSelf: 'center',
              marginTop: responsiveHeight(3),
            }}>
            <Text style={styles.selectcategorytxt}>
              View Profiles Of Matches
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => refContainer.current.close()}>
              <Image
                source={appImages.closerbsheet}
                resizeMode="contain"
                style={styles.sicon2}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, marginTop: responsiveHeight(2)}}>
            <FlatList
              data={categorylist}
              renderItem={renderItemCategory}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </RBSheet>
      <Modal
        dismissable={true}
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{flex: 1}}>
        <View
          style={{
            // backgroundColor: 'red',
            width: responsiveWidth(80),
            
            alignSelf: 'center',
            borderRadius: responsiveWidth(2),
            overflow: 'hidden',
          }}>
          {modaltype == 'posts' ? (
            <View
              style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                width: responsiveWidth(80),
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  paddingTop: responsiveHeight(4),
                  paddingBottom: responsiveHeight(5),
                  
                  color: appColor.appColorMain,
                  fontSize: responsiveFontSize(2.5),
                }}>
                Sort results by post?
              </Text>
              <View
                style={{
                  width: responsiveWidth(80),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingBottom: responsiveHeight(5),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setPagination(1);
                    setPaginationRef(!paginationref);
                    hideModal();

                    setByPost(true);

                    // postreference = true;
                  }}>
                  <Text
                    style={{
                      
                      color: appColor.appColorMain,
                      fontSize: responsiveFontSize(2.5),
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setPagination(1);
                    setPaginationRef(!paginationref);
                    hideModal();

                    setByPost('');
                    // postreference = '';
                  }}>
                  <Text
                    style={{
                      
                      color: appColor.appColorMain,
                      fontSize: responsiveFontSize(2.5),
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : modaltype == 'bio' ? (
            <View
              style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                width: responsiveWidth(80),
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  marginVertical: responsiveHeight(2),

                  
                  color: appColor.appColorMain,
                  fontSize: responsiveFontSize(2.5),
                }}>
                Sort by gender?
              </Text>
              <View
                style={{
                  width: responsiveWidth(80),

                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    hideModal();
                    setPagination(1);
                    setPaginationRef(!paginationref);
                    setGender('male');
                  }}
                  style={{
                    marginBottom: responsiveHeight(2),
                  }}>
                  <Text
                    style={{
                      
                      color: appColor.appColorMain,
                      fontSize: responsiveFontSize(2.5),
                    }}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    hideModal();
                    setPagination(1);
                    setPaginationRef(!paginationref);
                    setGender('female');
                  }}
                  style={{}}>
                  <Text
                    style={{
                      
                      color: appColor.appColorMain,
                      fontSize: responsiveFontSize(2.5),
                    }}>
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    hideModal();
                    setPagination(1);
                    setPaginationRef(!paginationref);
                    setGender('');
                  }}
                  style={{
                    marginVertical: responsiveHeight(2),
                  }}>
                  <Text
                    style={{
                      
                      color: appColor.appColorMain,
                      fontSize: responsiveFontSize(2.5),
                    }}>
                    Any
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : modaltype == 'location' ? (
            <View
              style={{
                backgroundColor: '#fff',
                alignItems: 'center',
                width: responsiveWidth(80),
                alignSelf: 'center',
                paddingVertical: responsiveHeight(2),
              }}>
              <Text
                style={{
                  
                  color: appColor.appColorMain,
                  fontSize: responsiveFontSize(2.5),
                }}>
                Enter Radius
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  maxLength={6}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: '#F2F2F2',
                    paddingHorizontal: responsiveWidth(3),
                    marginVertical: responsiveHeight(2.5),
                    
                    color: appColor.appColorMain,
                    fontSize: responsiveFontSize(2.5),
                  }}
                  value={myradius}
                  onChangeText={text => {
                    setMyRadius(text);
                  }}
                  onSubmitEditing={() => {
                    // hideModal();
                    // setRadiusConfirm(!radiusconfirm);
                  }}
                />
                <Text
                  style={{
                    
                    color: appColor.appColorMain,
                    fontSize: responsiveFontSize(2.5),
                    marginLeft: responsiveWidth(2),
                  }}>
                  KM
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  hideModal();
                  setPagination(1);
                  setPaginationRef(!paginationref);
                  setRadiusConfirm(!radiusconfirm);
                }}>
                <Text
                  style={{
                    
                    color: appColor.appColorMain,
                    fontSize: responsiveFontSize(2.5),
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : modaltype == 'age' ? (
            <View
              style={{
                width: responsiveWidth(80),
                backgroundColor: '#fff',
               // paddingVertical: responsiveHeight(2.5),
              }}>
              <Text
                style={{
                  
                  color: appColor.appColorMain,
                  fontSize: responsiveFontSize(2.5),
                  alignSelf: 'center',
                }}>
                Sort by age
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: responsiveWidth(5.5),
                }}>
                <Text
                  style={{
                    
                    color: appColor.appColorMain,
                    fontSize: responsiveFontSize(2.5),
                  }}>
                  {mindistancedouble}
                </Text>
                <Text
                  style={{
                    
                    color: appColor.appColorMain,
                    fontSize: responsiveFontSize(2.5),
                  }}>
                  {maxdistancedouble}
                </Text>
              </View>
              <SliderDouble
                style={{
                  paddingVertical: responsiveHeight(2.5),
                  width: responsiveWidth(70),
                  alignSelf: 'center',
                }}
                min={18}
                max={80}
                step={1}
                // disableRange
                high={maxdistancedouble}
                low={mindistancedouble}
                // selectedMaximum={maxdistancedouble}
                floatingLabel
                renderThumb={renderThumbdouble}
                renderRail={renderRaildouble}
                renderRailSelected={renderRailSelecteddouble}
                onValueChanged={handleValueChangeDistance}
                // renderNotch={renderNotchdouble}
                // renderLabel={renderLabeldouble}
              />
              <TouchableOpacity
                onPress={() => {
                  hideModal();
                  setPagination(1);
                  setPaginationRef(!paginationref);
                  setConfirmAge(!confirmage);
                }}
                style={{alignSelf: 'center'}}>
                <Text
                  style={{
                    
                    color: appColor.appColorMain,
                    fontSize: responsiveFontSize(2.5),
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: responsiveWidth(90),
    alignSelf: 'center',
    marginTop: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1.5),
  },
  headertxt: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.2),
  },
  mycard: {
    height: responsiveHeight(62),
    overflow: 'hidden',
    width: responsiveWidth(90),
    borderRadius: responsiveWidth(6),
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  swipercontainer: {
    height: responsiveHeight(65),
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardimage: {
    width: responsiveWidth(90),
    height: responsiveHeight(62),
  },
  txt1: {
    color: '#000',
    fontSize: responsiveFontSize(3.3),
    
  },
  txt2: {
    color: '#000',
    fontSize: responsiveFontSize(2),
    
  },
  buttonsparent: {
    width: responsiveWidth(80),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(9),
    marginBottom: responsiveHeight(2),
    marginTop: responsiveHeight(4.5),
  },
  buttonview1: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    backgroundColor: '#FFD0DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(100),
  },
  buttonview2: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    backgroundColor: appColor.appColorMain,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(100),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonview3: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    backgroundColor: '#FFD0DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(100),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardicon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
  },
  cardicon2: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
  },
  selectcategorytxt: {
    color: appColor.appColorMain,
    
    fontSize: responsiveFontSize(2.4),
  },
  sicon2: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
  },
});
