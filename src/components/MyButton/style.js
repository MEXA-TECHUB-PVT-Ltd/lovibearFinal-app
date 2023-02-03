import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {appColor} from '../../assets/utilities';
// import {buttonColor, textColor} from '../../constants/colors';
import {fontFamily} from '../../constants/fonts';
// import {fonts} from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(67),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(20),
    backgroundColor: '#Fff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    color: appColor.appColorMain,
    fontSize: responsiveFontSize(2.6),
    
    // marginBottom: responsiveHeight(0.8),
  },
  IconCon: {
    width: responsiveWidth(10),
  },
  imgstyle: {
    resizeMode: 'contain',
    // backgroundColor: 'red',
    height: responsiveHeight(2),
    width: responsiveWidth(2.5),
  },
});
