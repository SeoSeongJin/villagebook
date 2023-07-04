import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../component/Header';
import ImageSwipe from '../../component/menuDetail/ImageSwipe';
import MenuDesc from '../../component/menuDetail/MenuDesc';
import commonStyles from '../../styles/commonStyle';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import Dot from '../../component/Dot';
import FastImage from 'react-native-fast-image';
import TextMedium from '../../component/text/TextMedium';
import TextBold from '../../component/text/TextBold';
import TextNotoM from '../../component/text/TextNotoM';
import TextNotoR from '../../component/text/TextNotoR';
import TextNotoB from '../../component/text/TextNotoB';
import DividerL from '../../component/DividerL';
import {Slider} from '@miblanchard/react-native-slider';
import Loading from '../../component/Loading';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {customAlert} from '../../component/CustomAlert';
import {replaceString} from '../../config/utils/Price';
import {useSelector} from 'react-redux';
import MenuReview from './MenuReview';
import MiniMap from '../map/MiniMap';
import Caution from '../../component/Caution';
import AuthStorageModuel from '../../store/localStorage/AuthStorageModuel';
import {Shadow} from 'react-native-shadow-2';
import {FlatList} from 'react-native';
import {hasNotch} from 'react-native-device-info';

const MenuDetail3 = ({navigation, route}) => {
  const [tabVisible, setTabVisible] = useState(false);
  const [index, setIndex] = useState();
  const [showHeader, setShowHeader] = useState(false);
  const tempRef = useRef();
  const [tabPosition, setTabPosition] = useState();
  const [showFilter, setShowFilter] = useState(false);

  const data = [{key: 0, title: 'title1', data: [1]}];

  const renderItem = item => {
    console.log('ITEM::', item);
    return (
      <View
        style={{
          flex: 1,
          height: 1200,
          backgroundColor: 'tomato',
        }}
      >
        <Text style={{fontSize: 30}}>{item.item}</Text>
      </View>
    );
  };

  useEffect(() => {
    tempRef?.current.measure((fx, fy, width, height, px, py) => {
      console.log('Component width is: ' + width);
      console.log('Component height is: ' + height);
      console.log('X offset to frame: ' + fx);
      console.log('Y offset to frame: ' + fy);
      console.log('X offset to page: ' + px);
      console.log('Y offset to page: ' + py);
      setTabPosition(py);
    });
  }, []);

  const ListHeader = () => {
    return (
      <View>
        {/* <Image
        source={require('~/assets/no_use_img.png')}
        style={{width: '100%', height: 400}}
      /> */}
        <ImageSwipe images={[1, 2, 3]} />
      </View>
    );
  };

  const sectionHeader = section => {
    // if (section.key !== 1)
    //   return (
    //     <View
    //       style={{backgroundColor: 'teal', width: '100%', height: 50}}
    //     ></View>
    //   );
    return (
      <SafeAreaView
        edges={['left', 'right']}
        // style={{marginTop: 101}}
        style={{marginTop: hasNotch() ? 101 : 57}}
      >
        <View>
          <View
            //aos
            collapsable={false}
            ref={tempRef}
            style={{
              flexDirection: 'row',
              height: 55,
              // borderTopColor: colors.borderColor,
            }}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: index === 0 ? 2 : 1,
                borderBottomWidth: index === 0 ? 0 : 1,
                borderRightWidth: index === 0 ? 1 : 0,
                borderRightColor: colors.borderColor,
                borderTopColor:
                  index === 0 ? colors.borderColor22 : colors.borderColor,
                borderBottomColor: colors.borderColor,
                zIndex: 300,
              }}
              onPress={() => {
                setIndex(0);
              }}
            >
              {/* 헤더에 설명 쭉 넣고 섹션 1번 헤더는 탭으로  */}
              <TextMedium style={{fontSize: 17}}>메뉴</TextMedium>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: index === 1 ? 2 : 1,
                borderBottomWidth: index === 1 ? 0 : 1,
                borderRightWidth: index === 1 ? 1 : 0,
                borderRightColor: colors.borderColor,
                borderLeftWidth: index === 1 ? 1 : 0,
                borderLeftColor: colors.borderColor,
                borderTopColor:
                  index === 1 ? colors.borderColor22 : colors.borderColor,
                borderBottomColor: colors.borderColor,
                zIndex: 300,
              }}
              onPress={() => {
                setIndex(1);
              }}
            >
              <TextMedium style={{fontSize: 17}}>정보</TextMedium>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: index === 2 ? 2 : 1,
                borderBottomWidth: index === 2 ? 0 : 1,
                borderLeftWidth: index === 2 ? 1 : 0,
                borderLeftColor: colors.borderColor,
                borderTopColor:
                  index === 2 ? colors.borderColor22 : colors.borderColor,
                borderBottomColor: colors.borderColor,
                zIndex: 300,
              }}
              onPress={() => {
                setIndex(2);
              }}
            >
              <TextMedium style={{fontSize: 17}}>리뷰</TextMedium>
            </Pressable>
          </View>
          {showFilter && (
            <ScrollView
              style={{
                backgroundColor: 'white',
                top: Platform.OS === 'android' ? -0.1 : null,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              {data.map((item, index) => (
                <View key={index}>
                  <Pressable
                    style={{
                      height: 34,
                      // width: chipWidth,
                      minWidth: 67,
                      // backgroundColor:
                      //   selected.idx === index ? colors.primary : 'white',
                      borderWidth: 1,
                      // borderColor:
                      //   selected.idx === index ? 'white' : colors.colorE3,
                      marginVertical: 10,
                      paddingHorizontal: 5,
                      marginHorizontal: 5,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TextMedium
                      style={{
                        fontSize: 14,
                        // color:
                        //   selected.idx === index ? 'white' : colors.fontColor2,
                      }}
                    >
                      {item.ca_name}
                    </TextMedium>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      {/* <SafeAreaView style={{flex: 0}} edges={['top']} /> */}
      <View style={{...commonStyles.safeAreaStyle}}>
        <SafeAreaView
          style={{
            zIndex: 100,
            backgroundColor: showHeader ? 'white' : 'rgba(0,0,0,0)',
          }}
          edges={['top']}
        >
          <View style={{flex: 1}}>
            <Header
              style={{
                backgroundColor: showHeader ? 'white' : 'rgba(0,0,0,0)',
                position: 'absolute',
                zIndex: 100,
              }}
            />
          </View>
        </SafeAreaView>

        <FlatList
          overScrollMode="never"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          onScroll={e => {
            const offset = e.nativeEvent.contentOffset;

            console.log(offset);
            if (offset.y < tabPosition * 0.5) setShowHeader(false);
            if (offset.y > tabPosition * 0.6) setShowHeader(true);

            console.log('tabPosition', tabPosition, '::', 'offset', offset.y);
            if (offset.y > tabPosition) setShowFilter(true);
            if (offset.y < tabPosition) setShowFilter(false);

            // console.warn(e.nativeEvent.contentOffset);
          }}
          //   data={}?
        />

        <SectionList
          overScrollMode="never"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          // contentInset={{top: 57}}
          onScroll={e => {
            const offset = e.nativeEvent.contentOffset;

            console.log(offset);
            if (offset.y < tabPosition * 0.5) setShowHeader(false);
            if (offset.y > tabPosition * 0.6) setShowHeader(true);

            console.log('tabPosition', tabPosition, '::', 'offset', offset.y);
            if (offset.y > tabPosition) setShowFilter(true);
            if (offset.y < tabPosition) setShowFilter(false);

            // console.warn(e.nativeEvent.contentOffset);
          }}
          sections={data}
          // contentContainerStyle={{}}
          ListHeaderComponent={<ListHeader />}
          ListHeaderComponentStyle={{marginBottom: hasNotch() ? -101 : -57}}
          // ListHeaderComponentStyle={{marginBottom: -101}
          stickySectionHeadersEnabled={true}
          keyExtractor={(item, index) => item.key}
          renderItem={item => renderItem(item)}
          renderSectionHeader={({section}) => sectionHeader(section)}
        />
      </View>
    </>
  );
};

export default MenuDetail3;

const styles = StyleSheet.create({
  titleTakout: {
    color: colors.fontColor99,
    marginVertical: 11,
  },
  subTitleTakeout: {
    color: colors.fontColor3,
  },
});
