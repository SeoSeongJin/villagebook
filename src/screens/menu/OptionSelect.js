import {View, useWindowDimensions, SectionList, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import FastImage from 'react-native-fast-image';
import TextBold from '../../component/text/TextBold';
import {replaceString} from '../../config/utils/Price';
import TextMedium from '../../component/text/TextMedium';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import DividerL from '../../component/DividerL';
import OptionRenderItem from './OptionRenderItem';
import {useDispatch, useSelector} from 'react-redux';
import {setOptionHeader} from '../../store/reducers/MenuReducer';
import OptionCount from './OptionCount';
import CartButton from './CartButton';
import {initOption, setRequiredCount} from '../../store/reducers/CartReducer';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import Loading from '../../component/Loading';
import {hasNotch} from 'react-native-device-info';

const OptionSelect = ({navigation, route}) => {
  const routeData = route.params;
  console.warn('routeData', routeData);
  const {mutateMenuDetail} = useCustomMutation();
  const [convertedData, setConvertedData] = useState([]);
  const {optionHeader, currentStoreCode} = useSelector(
    state => state.menuReducer,
  );
  const dispatch = useDispatch();
  const _getMenuDetail = () => {
    const data = {
      jumju_id: routeData.jumju_id,
      jumju_code: routeData.jumju_code,
      it_id: routeData.it_id,
    };
    mutateMenuDetail.mutate(data);
  };

  const layout = useWindowDimensions();

  // const _getReqiredItem = () => {
  //   const temp = arr.filter((item, index) => item.required === true);
  //   console.log('get temp', temp);
  //   dispatch(
  //     initOption({
  //       count: 1,
  //       mainItemCode: data.itemCode,
  //       price: data.price,
  //       mainReqired: temp,
  //     }),
  //   );
  // };

  const _convertData = info => {
    let arr = [];
    if (info.option.length > 0) {
      info.option.map((item, index) => {
        arr.push({...item, required: true, data: item.option_data});
        delete arr[index].option_data;
      });
    }

    if (info.supply.length > 0) {
      info.supply.map((item, index) => {
        arr.push({...item, required: false, data: item.supply_option});
        delete arr[index].supply_option;
      });
    }

    const required = arr.filter(item => item['required'] === true);
    dispatch(setRequiredCount(required.length));
    console.log('arr', arr);
    setConvertedData(arr);

    // console.log('DetailInfo', arr);
  };

  useEffect(() => {
    if (mutateMenuDetail?.data?.data.arrItems) {
      const info = mutateMenuDetail?.data?.data.arrItems;
      console.log('INFO', info);
      dispatch(
        initOption({
          count: 1,
          mainItemCode: routeData.it_id,
          manuName: info.it_name,
          mainPrice: Number(info.it_price),
          price: Number(info.it_price),
        }),
      );
      _convertData(info);
    }
  }, [mutateMenuDetail.data]);

  useEffect(() => {
    _getMenuDetail();
    // _getReqiredItem();
  }, []);

  // console.log('convertedData', convertedData);

  if (!mutateMenuDetail?.data?.data?.arrItems) return <Loading />;
  const DetailInfo = mutateMenuDetail?.data?.data.arrItems;
  // console.log('DetailInfo', DetailInfo);

  // return <Loading />;

  return (
    <>
      {/* <SafeAreaView style={{flex: 0, backgroundColor: 'white'}} edges={} /> */}
      <SafeAreaView
        style={{...commonStyles.safeAreaStyle, backgroundColor: colors.primary}}
        edges={['bottom', 'left', 'right']}
      >
        <View style={{zIndex: 500}}>
          <Header
            title={''}
            navigation={navigation}
            fadeTitle={DetailInfo.it_name}
            style={{
              position: 'absolute',
              zIndex: 500,
              marginTop: hasNotch() ? '9%' : null,
            }}
            isOption={true}
          />
        </View>
        {/* {console.log('option selec data', route.params)} */}

        {/* <SectionList sections={convertedData} renderItem={item => <></>} /> */}

        <SectionList
          style={{backgroundColor: 'white'}}
          onScroll={e => {
            let positionY = e.nativeEvent.contentOffset.y;
            if (positionY > layout.width && optionHeader !== true)
              dispatch(setOptionHeader(true));
            else if (positionY < layout.width && optionHeader !== false)
              dispatch(setOptionHeader(false));
            // console.log('Native Scroll', e.nativeEvent.contentOffset);
          }}
          ListHeaderComponent={
            <>
              <FastImage
                source={
                  routeData.it_img1
                    ? {uri: routeData.it_img1}
                    : require('~/assets/no_img.png')
                }
                style={{width: layout.width, height: layout.width / 1.2}}
              />
              <View style={{paddingHorizontal: 22, paddingTop: 10}}>
                <TextBold style={{fontSize: 20, color: colors.fontColor2}}>
                  {DetailInfo.it_name}
                </TextBold>
                <View style={{marginVertical: 10}}>
                  <TextMedium style={{color: colors.fontColorA}}>
                    {DetailInfo.it_explan}
                  </TextMedium>
                </View>
              </View>
              <View
                style={{
                  marginTop: 10,
                  borderTopWidth: 1,
                  borderColor: colors.borderColor,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 22,
                    marginVertical: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <TextBold style={{fontSize: 16, color: colors.fontColor2}}>
                    가격
                  </TextBold>
                  <TextBold style={{color: colors.fontColor2}}>
                    {replaceString(DetailInfo.it_price)}원
                  </TextBold>
                </View>
              </View>
            </>
          }
          ListFooterComponent={() => (
            <View
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingHorizontal: 22,
                paddingVertical: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TextBold style={{color: colors.fontColor2}}>수량</TextBold>
              <OptionCount price={DetailInfo.it_price} />
            </View>
          )}
          sections={convertedData}
          contentContainerStyle={{paddingBottom: 100}}
          keyExtractor={(item, index) => item + index}
          renderItem={item => (
            <OptionRenderItem item={item} data={convertedData} />
          )}
          renderSectionHeader={({
            section: {option_subject, supply_subject, required},
          }) => (
            <View
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingHorizontal: 22,
                paddingVertical: 15,
              }}
            >
              <TextBold style={{color: colors.fontColor2}}>
                {option_subject || supply_subject}
                {required ? ' (필수)' : ' (선택)'}
              </TextBold>
            </View>
          )}
        />
        <View style={{flex: 1}}>
          <CartButton navigation={navigation} data={routeData} isOption />
        </View>
      </SafeAreaView>
    </>
  );
};

export default OptionSelect;
