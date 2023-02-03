import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState, useRef, createRef} from 'react';
import Video from 'react-native-video';
import STYLES from '../../STYLES';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import {
//   hideNavigationBar,
//   showNavigationBar,
// } from 'react-native-navigation-bar-color';
import Slider from '@react-native-community/slider';
import {appImages} from '../../../assets/utilities';
import {fontFamily} from '../../../constants/fonts';
import {useFocusEffect} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
const FinalVideoPlayer = ({route}) => {
  const {mysource} = route.params;

  const samplevideo = require('../../../components/VideoComponent/sample.mp4');
  // useEffect(() => {
  //   hideNavigationBar();
  // }, []);
  const [currentTime, setcurrentTime] = useState(0);
  const [duration, setduration] = useState(0);
  const [isfullscreen, setIsfullscreen] = useState(false);
  const checkref = useRef();
  const [mypause, setMypause] = useState(false);
  const load = ({duration}) => setduration(duration);
  const progress = ({currentTime}) => setcurrentTime(currentTime);
  const [controlsvisible, setControlsvisible] = useState(false);
  const getTime = t => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ':' + min + ':' + sec;
  };
  //   useFocusEffect(
  //     React.useCallback(() => {
  //       if (isfullscreen == true) {
  //         Orientation.lockToLandscape();
  //       } else {
  //         Orientation.lockToPortrait();
  //       }
  //     }, []),
  //   );
  useEffect(() => {
    if (isfullscreen == true) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    // const backAction = () => {
    //   showNavigationBar();
    // };
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );
    // return () => backHandler.remove();
  }, [isfullscreen]);
  return (
    <View style={[STYLES.container, {backgroundColor: '#000'}]}>
      <StatusBar hidden={true} />
      <Pressable
        disabled={duration == 0 ? true : false}
        style={{flex: 1}}
        onPress={() => {
          if (controlsvisible == false) {
            setControlsvisible(true);
          }
        }}>
        <Video
          source={{uri: mysource}}
          ref={checkref}
          paused={mypause}
          style={styles.backgroundVideo}
          resizeMode="contain"
          onLoad={load}
          onProgress={progress}
          onEnd={() => {
            setcurrentTime(0);
            setMypause(true);
            checkref.current.seek(0);
          }}
        />
      </Pressable>
      {controlsvisible ? (
        <Pressable
          style={styles.controlsstyle}
          onPress={() => setControlsvisible(false)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              //   backgroundColor: 'red',
              flex: 1,
              width: '70%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (currentTime < 5.5) {
                  checkref.current.seek(0);
                  setcurrentTime(0);
                } else if (currentTime > 5.5) {
                  checkref.current.seek(currentTime - 5);
                  setcurrentTime(currentTime - 5);
                }
              }}
              activeOpacity={0.7}
              style={{
                // backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
              }}>
              <Image
                source={appImages.rewindicon}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setMypause(!mypause)}
              style={{
                // backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
              }}>
              <Image
                source={mypause ? appImages.playiconfinal : appImages.pauseicon}
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
              }}
              onPress={() => {
                if (duration > currentTime) {
                  checkref.current.seek(currentTime + 5);
                  setcurrentTime(currentTime + 5);
                }
              }}>
              <Image
                source={appImages.forwardicon}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
          <Pressable
            style={{
              position: 'absolute',
              bottom: 0.001,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderTopRightRadius: responsiveWidth(3),
              borderTopLeftRadius: responsiveWidth(3),
              width: '100%',
              paddingTop: 15,
            }}>
            <Slider
              maximumTrackTintColor="white"
              minimumTrackTintColor="red"
              thumbTintColor="red"
              value={currentTime / duration}
              onValueChange={slide => {
                console.log('SLIDE=======VALUE CHANGE', slide * duration);
              }}
              onSlidingComplete={slide => {
                checkref.current.seek(slide * duration);
                setcurrentTime(slide * duration);
              }}
              style={{}}
            />
            <View
              style={{
                paddingHorizontal: responsiveWidth(4),
                paddingBottom: 10,
                paddingTop: 5,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: fontFamily.OpenSans_SemiBold,
                  fontSize: responsiveFontSize(1.7),
                }}>
                {getTime(currentTime)}
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: fontFamily.OpenSans_SemiBold,
                    fontSize: responsiveFontSize(1.7),
                    marginRight: responsiveWidth(5),
                  }}>
                  {getTime(duration)}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setIsfullscreen(!isfullscreen)}
                  style={{
                    width: 27,
                    height: 27,
                    // backgroundColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={
                      isfullscreen
                        ? appImages.fullscreenout
                        : appImages.fullscreenicon
                    }
                    style={{
                      width: 17,
                      height: 17,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      ) : null}
    </View>
  );
};

export default FinalVideoPlayer;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // backgroundColor: '#000',
  },
  controlsstyle: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.15)',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // width: '100%',
    // height: responsiveHeight(10),
    // flex: 1,
    // top: 0,
    // left: 0,
    // bottom: 0.001,
    // right: 0,
    // backgroundColor: '#000',
  },
});
