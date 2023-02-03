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
  Platform,
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
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Search = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const {routeArray} = route.params;
  useEffect(() => {
    setList(routeArray);
  }, []);

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
        setTimeout(() => {
          SearchApi(position.coords.latitude, position.coords.longitude);
        }, 500);
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
  const [filteredlist, setFilteredlist] = useState([]);
  const [myfocus, setMyfocus] = useState('search');
  const [list, setList] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');

  // const search = searchText => {
  //   console.log('okiuhh');
  //   console.log(searchText);
  //   setSearchQuery(searchText);
  //   let filteredData = list.filter(function (item) {
  //     var searchIdNameLowerCase = searchText.toLowerCase();
  //     var itemNameLowerCase = item.document.userName.toLowerCase();
  //     console.log(item);
  //     var a = itemNameLowerCase.includes(searchIdNameLowerCase);

  //     return a;
  //   });
  //   console.log('SEARCH', search);
  //   setFilteredlist(filteredData);
  // };

  const [singlesearch, setSingleSearch] = useState('');
  const [myradius, setMyRadius] = useState(50000);

  const SearchApi = async (mylat, mylong) => {
    var axios = require('axios');
    const userId = await AsyncStorage.getItem('userid');
    var data = JSON.stringify({
      long: mylong,
      lat: mylat,
      userId: userId,
    });

    var config = {
      method: 'post',
      url:
        Base_URL +
        '/user/getUserByName/?name=' +
        singlesearch +
        '&radiusInKm=10000000',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log('ARRAY LENGTH===============', response.data.users.length);
        if (response.data.users.length == 0) {
          setList();
          setEmpty(true);
          setLoading(false);
        } else {
          setList(response.data.users);
          setLoading(false);
          setEmpty(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const renderItem = ({item}) => {
    console.log('THE ITEM=======', item.swipedStatus);
    return (
      <TouchableOpacity
        // onPress={() => props.navigation.navigate('Messaging')}
        onPress={() => {
          dispatch(setFromRoute('search'));
          dispatch(setRouteCard(item));
          navigation.navigate('PlayScreen');
        }}
        disabled={item.swipedStatus == 'true' ? true : false}
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
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: responsiveHeight(1),
            width: responsiveWidth(90),
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginBottom: responsiveHeight(2.5),
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}
            style={{
              paddingLeft: responsiveWidth(2),
              marginLeft: responsiveWidth(-2),
              paddingRight: responsiveWidth(2),
              paddingVertical: responsiveHeight(1.5),
              marginVertical: responsiveHeight(0.5),
              //   marginTop: responsiveHeight(2),
            }}>
            <Image
              source={appImages.backicon}
              resizeMode="contain"
              style={{
                width: responsiveWidth(5.5),
                height: responsiveWidth(5.5),
              }}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.inputview,
              {
                borderColor:
                  myfocus == 'search' ? appColor.appColorMain : '#C7C7C7',
              },
            ]}>
            <TextInput
              style={styles.inputstyle}
              placeholder={'Search'}
              onFocus={() => setMyfocus('search')}
              onSubmitEditing={() => setMyfocus('')}
              placeholderTextColor={'#8D8D8D'}
              // onChangeText={text => {
              //   search(text);
              // }}
              // value={searchQuery}
              onChangeText={text => {
                setSingleSearch(text);
              }}
              value={singlesearch}
              autoFocus
            />
            <TouchableOpacity
              disabled={singlesearch == '' ? true : false}
              onPress={() => {
                getLocation();
              }}>
              <Image
                source={appImages.searchicon}
                style={{width: responsiveWidth(5), height: responsiveWidth(5)}}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View
            style={{
              flexGrow: 1,
              width: responsiveWidth(80),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: responsiveHeight(10),
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
              flexGrow: 1,
              width: responsiveWidth(80),
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: responsiveHeight(10),
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
            keyboardShouldPersistTaps={'always'}
            data={list}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
          />
        
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  txt1: {
    
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(3.5),
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
  inputview: {
    width: responsiveWidth(80),
    borderWidth: responsiveWidth(0.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
    // paddingVertical: responsiveWidth(0.1),
    borderRadius: responsiveWidth(4),
  },
  inputstyle: {
    
    color: '#000',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(65),
    paddingVertical: responsiveHeight(1),
  },
});
