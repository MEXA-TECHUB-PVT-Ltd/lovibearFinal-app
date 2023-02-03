import {StyleSheet, Dimensions} from 'react-native';
// import Colors from "../../utills/Colors";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const {width} = Dimensions.get('window');

const style = StyleSheet.create({
  container: {
    flex: 1,
    //borderRadius:20,
    // backgroundColor: 'rgba(0,0,0,0.9)',
    // justifyContent: 'center',
    // paddingBottom: responsiveHeight(10),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  icon: {
    color: 'white',
    // flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 25,
    backgroundColor: 'red',
    alignSelf: 'center',
    height: responsiveHeight(15),
    marginLeft: responsiveWidth(40),
    alignSelf: 'center',
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  video: {
    width: responsiveWidth(88),
    height: responsiveHeight(30),
  },
  fullscreenVideo: {
    backgroundColor: 'black',
    ...StyleSheet.absoluteFill,
    elevation: 1,
  },
});
export default style;
