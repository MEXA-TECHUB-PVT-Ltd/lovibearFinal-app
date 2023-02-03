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
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Right from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
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
import {Base_URL} from '../../../Base_URL';
import RNFetchBlob from 'rn-fetch-blob';
import {MyButton, MyButtonLoader} from '../../../components/MyButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const AddPhoto = props => {
  let apiarr = [];
  const [apiImagesList, setApiImagesList] = useState([]);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   AddUserId();
  // }, []);
  // const AddUserId = async () => {
  //   const userid = await AsyncStorage.getItem('userid');

  //   apiarr = apiImagesList;
  //   await apiarr.push({
  //     name: 'userId',
  //     data: userid,
  //   });

  //   console.log('PUTTING UID ========', apiarr);
  // };
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const refContainer = useRef();
  const [categorylist, setCategorylist] = useState([
    {
      id: 1,
      title: 'Upload From Camera',
      image: appImages.uploadcamera,
      onPress: () => imageTakeFromCamera(),
    },
    {
      id: 2,
      title: 'Upload From Gallery',
      image: appImages.uploadgallery,
      onPress: () => imageTakeFromGallery(),
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
          style={{width: responsiveWidth(6), height: responsiveWidth(6)}}
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
  const [mylist, setMylist] = useState([
    {
      flag: true,
    },
  ]);
  const [myimage, setMyimage] = useState('');
  const imageTakeFromGallery = () => {
    handleCancel();

    ImagePicker.openPicker({
      cropping: false,
      mediaType: 'photo',
    }).then(async image => {
      var filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      let arr = [...mylist];
      await arr.unshift({
        image: image.path,
      });
      await setMylist(arr);
      apiarr = [...apiImagesList];
      await apiarr.unshift({
        name: 'postImages',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      });
      setApiImagesList(apiarr);
      console.log('THE API IMAGES==============', apiarr);
      await console.log('MY LIST==============', mylist);
      await refContainer.current.close();
      console.log('ARR LENGTH', arr.length);
      if (arr.length > 9) {
        console.log('FOR POP===========');
        let arr = [...Animatedmylist];
        await arr.pop();
        setMylist(arr);
      }
    });
  };
  const imageTakeFromCamera = () => {
    handleCancel();
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'photo',
    }).then(async image => {
      var filename = image.path.substring(image.path.lastIndexOf('/') + 1);

      let arr = [...mylist];
      await arr.unshift({
        image: image.path,
      });
      await setMylist(arr);

      apiarr = [...apiImagesList];
      await apiarr.unshift({
        name: 'postImages',
        filename: filename,
        type: image.mime,
        data: RNFetchBlob.wrap(image.path),
      });
      setApiImagesList(apiarr);
      console.log('THE API IMAGES==============', apiarr);

      await console.log('MY LIST==============', mylist);
      await refContainer.current.close();
      console.log('ARR LENGTH', arr.length);
      if (arr.length > 9) {
        console.log('FOR POP===========');
        let arr = [...mylist];
        await arr.pop();
        setMylist(arr);
      }
    });
  };

  const removeImage = index => {
    let arr = [...mylist];
    arr.splice(index, 1);
    setMylist(arr);
    let arr2 = [...apiImagesList];
    arr2.splice(index, 1);
    setApiImagesList(arr2);
    console.log('AFTER DELETION LIST========', mylist);
    console.log('AFTER DELETION API LIST========', apiImagesList);
  };

  const UploadMedia = async () => {
    setLoading(true);
    const userid = await AsyncStorage.getItem('userid');
    console.log('ENTERED HERE', apiImagesList);
    console.log('API IMAGES LIST LENGTH HERE', apiImagesList.length);
    if (apiImagesList.length > 0) {
      console.log('INSIDE THE IF CONDITION');

      RNFetchBlob.fetch(
        'POST',
        Base_URL + '/posts/createPost',
        {
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        apiImagesList.concat({
          name: 'userId',
          data: userid,
        }),
      )
        .then(response => {
          console.log('response:', response.data);
          let myresponse = JSON.parse(response.data);
          console.log('AFTER PARSING=======', myresponse);
          Toast.show('New Post Added');
          props.navigation.goBack();

          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          borderWidth: responsiveWidth(0.2),
          borderColor: '#E75073',
          width: responsiveWidth(28),
          height: responsiveWidth(34),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: responsiveWidth(4),
          overflow: 'hidden',
          marginBottom: responsiveHeight(2),
          marginRight: responsiveWidth(2.8),
        }}>
        {item.flag != true ? (
          <TouchableOpacity
            onPress={() => removeImage(index)}
            style={{
              width: responsiveWidth(5),
              height: responsiveWidth(5),
              position: 'absolute',
              top: responsiveHeight(0.001),
              right: responsiveWidth(0.001),
              zIndex: 1,
              backgroundColor: 'lightgray',
              borderRadius: responsiveWidth(100),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={appImages.crossphoto}
              style={{
                width: responsiveWidth(3),
                height: responsiveWidth(3),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            showDialog();
          }}
          activeOpacity={0.7}
          disabled={item.flag || loading ? false : true}
          style={{
            width: responsiveWidth(28),
            height: responsiveWidth(34),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={item.flag ? appImages.addphoto : {uri: item.image}}
            style={{
              width: item.flag ? responsiveWidth(8) : responsiveWidth(28),
              height: item.flag ? responsiveWidth(8) : responsiveWidth(34),
              //   backgroundColor: 'red',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={STYLES.container}>
      <ScrollView contentContainerStyle={[STYLES.scrollviewJustify]}>
        <View>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              paddingHorizontal: responsiveWidth(5),
            }}>
            <View
              style={{
                marginTop: responsiveHeight(1.5),
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: responsiveHeight(1.9),
                justifyContent: 'space-between',
              }}>
              <Text style={styles.txt1}>Add Photo</Text>
              <TouchableOpacity
                disabled={loading ? true : false}
                activeOpacity={0.6}
                onPress={() => props.navigation.goBack()}>
                <Image
                  source={appImages.crossphoto}
                  style={{
                    width: responsiveWidth(5.3),
                    height: responsiveWidth(5.3),
                  }}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={appImages.photoheader}
              style={{
                height: responsiveWidth(35),
                width: responsiveWidth(65),
                resizeMode: 'contain',
                // backgroundColor: 'red',
                alignSelf: 'center',
              }}
            />

            <Text
              style={{
                marginTop: responsiveHeight(3),
                width: responsiveWidth(85),
                alignSelf: 'center',
                alignItems: 'center',
                color: '#707070',
                fontSize: responsiveFontSize(1.8),
                textAlign: 'center',
                
                lineHeight: responsiveHeight(3),
              }}>
              Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam
              Nonumy
            </Text>
            <View>
              <FlatList
                data={mylist}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                //   columnWrapperStyle={{justifyContent: 'space-between'}}
                contentContainerStyle={{
                  marginTop: responsiveHeight(4),
                  paddingBottom: responsiveHeight(5),
                }}
              />
            </View>
          </View>
        </View>

        <View>
          {loading ? (
            <MyButtonLoader
              myStyles={{
                width: responsiveWidth(70),
                backgroundColor: appColor.appColorMain,
                marginBottom: responsiveHeight(2),
              }}
              title={'Upload'}
              itsTextstyle={{
                color: '#fff',
              }}
            />
          ) : (
            <MyButton
              disabled={mylist.length == 1 ? true : false}
              onPress={() => {
                UploadMedia();
              }}
              myStyles={{
                width: responsiveWidth(70),
                backgroundColor: appColor.appColorMain,
                marginBottom: responsiveHeight(2),
              }}
              title={'Upload'}
              itsTextstyle={{
                color: '#fff',
              }}
            />
          )}
        </View>

        <RBSheet
          ref={refContainer}
          openDuration={250}
          animationType="slide"
          customStyles={{
            container: {
              // height: responsiveHeight(50),
              borderTopRightRadius: responsiveWidth(7),
              borderTopLeftRadius: responsiveWidth(7),
            },
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: responsiveWidth(85),
                alignSelf: 'center',
                marginTop: responsiveHeight(3),
              }}>
              <Text style={styles.selectcategorytxt}>Upload Image</Text>
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
        <Dialog.Container
          visible={visible}
          verticalButtons={true}
          onRequestClose={() => handleCancel()}>
          <Dialog.Title
            style={{
              
              alignSelf: 'center',
              color: appColor.appColorMain,
            }}>
            Upload Photos 
          </Dialog.Title>
          {/* <Dialog.Description>
            Take a photo or choose from your library
          </Dialog.Description> */}
          <Dialog.Button
            style={{
              
              alignSelf: 'center',
              backgroundColor:"#FF0047",
              borderRadius:20,
              width: responsiveWidth(54)
              
              
            }}
            label="Take a Photo"
            onPress={imageTakeFromCamera}
           // color={appColor.appColorMain}
           color="#FFF"
          />
          <Dialog.Button
            style={{
              
              alignSelf: 'center',
              backgroundColor:"#FF0047",
              marginTop:responsiveHeight(1),
              borderRadius:20,
              width: responsiveWidth(54)
            }}
            label="Choose from Gallery"
            onPress={imageTakeFromGallery}
            //color={appColor.appColorMain}
            color="#FFF"
          />
          <Dialog.Button
            style={{
              
              alignSelf: 'center',
              backgroundColor:"#FF0047",
              marginTop:responsiveHeight(1),
              borderRadius:20,
              width: responsiveWidth(54)
            }}
            label="Cancel"
            onPress={handleCancel}
            //color={appColor.appColorMain}
            color="#FFF"
          />
        </Dialog.Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPhoto;

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
    marginLeft: responsiveWidth(2.5),
    fontSize: responsiveFontSize(1.7),
    width: responsiveWidth(65),
    lineHeight: responsiveHeight(2.7),
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
    fontSize: responsiveFontSize(1.8),
    marginTop: responsiveHeight(0.4),
  },
  selectcategorytxt: {
    color: appColor.appColorMain,
    
    fontSize: responsiveFontSize(2.7),
  },
  sicon2: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
  },
});
