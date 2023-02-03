import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Right from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import STYLES from '../../STYLES';
import {appColor, appImages} from '../../../assets/utilities';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Carousel from 'react-native-snap-carousel';
import {fontFamily} from '../../../constants/fonts';
import MyHeart from '../../../components/MyHeart';
import LinearGradient from 'react-native-linear-gradient';
import {Base_URL} from '../../../Base_URL';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import {setFromRoute, setRouteCard} from '../../../redux/actions';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator, Modal} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Discover = props => {
  const [myradius, setMyRadius] = useState('10');
  const [radiusconfirm, setRadiusConfirm] = useState(false);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   getLocation();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getLocation();
    }, [radiusconfirm]),
  );
  const getLocation = async () => {
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
    await Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        // setMylat(position.coords.latitude);
        // setMylong(position.coords.longitude);

        GetAllUsers(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Enable Location', 'Your location is required to proceed', [
          {
            text: 'OK',
            onPress: () => {
              getLocation();
            },
          },
        ]);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const GetAllUsers = async (mylat, mylong) => {
    console.log('MYRADIUS==============', myradius);

    const userid = await AsyncStorage.getItem('userid');
    var axios = require('axios');
    var data = JSON.stringify({
      long: mylong,
      lat: mylat,
      radiusInKm: myradius,
      userId: userid,
    });

    var config = {
      method: 'post',
      url:
        Base_URL +
        '/user/usersInRadius/?page=1&limit=1000000&min_age=1&max_age=100',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.users.length == 0) {
          setEmpty(true);
          setLoading(false);
        } else {
          setList(response.data.users);
          setEmpty(false);
          setLoading(false);
        }
      })
      .catch(function (error) {
        if (error.response.data.message == 'No user found with this query') {
          console.log('No Results Found');
          setEmpty(true);
          setLoading(false);
        }
        console.log(error);
      });
  };
  const [list, setList] = useState([]);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setFromRoute('discover'));
          dispatch(setRouteCard(item));
          props.navigation.navigate('PlayScreen');
        }}
        activeOpacity={0.85}
        style={{
          borderRadius: responsiveWidth(5),
          overflow: 'hidden',
          marginBottom: responsiveHeight(2.2),
          borderWidth: responsiveWidth(0.3),
          borderColor: '#FA6B5B',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={
            item.document.profileImage == undefined
              ? appImages.noimg
              : {uri: item.document.profileImage.userPicUrl}
          }
          style={{
            width: responsiveWidth(42),
            height: responsiveWidth(50),
          }}
        />

        <View
          style={{
            // alignItems: 'center',
            paddingLeft: responsiveWidth(3),
            position: 'absolute',
            bottom: responsiveWidth(-0.1),
            width: responsiveWidth(42),
            backgroundColor: '#fff',
            paddingBottom: responsiveHeight(2),
            paddingTop: responsiveHeight(1.5),
          }}>
          <Text style={styles.info1}>
            {item.document.userName}, {parseInt(item.Age)}
          </Text>
          <Text style={styles.info2}>
            {item.document.dist.distance_km.toString().charAt(0) == 0
              ? 'Less than 1 km , '
              : item.document.dist.distance_km.toFixed(1) + 'km , '}

            {item.document.profession}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={STYLES.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          // paddingHorizontal: responsiveWidth(5),
          width: responsiveWidth(90),
          alignSelf: 'center',
          zIndex: 1,
        }}>
        <View
          style={{
            marginTop: responsiveHeight(1.5),

            marginBottom: responsiveHeight(1.5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.txt1}>Discover</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {loading ? (
              <ActivityIndicator
                color={appColor.appColorMain}
                size={'small'}
                style={{marginRight: responsiveWidth(6)}}
              />
            ) : null}
            <TouchableOpacity
              onPress={() => {
                showModal();
              }}>
              <Image
                source={appImages.locationoption}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {empty ? (
          <View
            style={{
              flexGrow: 1,
              width: responsiveWidth(80),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: responsiveHeight(5),
            }}>
            <Text
              style={{
                
                color: appColor.appColorMain,
                fontSize: responsiveFontSize(3.2),
              }}>
              No Results Found
            </Text>
          </View>
        ) : (
          <FlatList
            data={list}
            renderItem={renderItem}
            contentContainerStyle={{}}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
          />
        )}
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
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Discover;

const styles = StyleSheet.create({
  txt1: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.2),
  },

  nametxt: {
    
    color: '#080808',
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(-0.4),
  },
  worktxt: {
    
    color: '#080808',
    opacity: 0.3,
    fontSize: responsiveFontSize(1.7),
    marginBottom: responsiveHeight(0.7),
    marginTop: responsiveHeight(1),
  },
  companytxt: {
    
    color: '#080808',
    opacity: 0.3,
    fontSize: responsiveFontSize(1.8),
  },
  timetxt: {
    textAlign: 'right',
    
    color: '#000',
    opacity: 0.55,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(-0.3),
  },
  answertxt: {
    textAlign: 'right',
    
    color: '#000',
    opacity: 0.55,
    fontSize: responsiveFontSize(1.7),
    marginTop: responsiveHeight(0.4),
  },
  selectcategorytxt: {
    color: '#080808',
    
    fontSize: responsiveFontSize(3.2),
  },
  sicon2: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
  },
  info1: {
    color: '#000',
    fontSize: responsiveFontSize(2.7),
    
  },
  info2: {
    color: '#000',
    fontSize: responsiveFontSize(1.6),
    
  },
});
