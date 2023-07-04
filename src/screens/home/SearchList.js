import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SectionList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Shadow} from 'react-native-shadow-2';
import {useDispatch, useSelector} from 'react-redux';
import Chip from '../../component/Chip';
import {customAlert} from '../../component/CustomAlert';
import Divider from '../../component/Divider';
import DividerL from '../../component/DividerL';
import Dot from '../../component/Dot';
import ImageCover from '../../component/ImageCover';
import Loading from '../../component/Loading';
import ReviewSimple from '../../component/reviews/ReviewSimple';
import TextBold from '../../component/text/TextBold';
import TextMedium from '../../component/text/TextMedium';
import TextRegular from '../../component/text/TextRegular';
import TextSBold from '../../component/text/TextSBold';
import {replaceString} from '../../config/utils/Price';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {setIsLifeStyle} from '../../store/reducers/CategoryReducer';
import {setSearchResult} from '../../store/reducers/SearchReducer';
import colors from '../../styles/colors';

const SearchList = ({navigation, JType, route}) => {
  const dispatch = useDispatch();
  const {mutateSearch, mutateSearchLifeStyle} = useCustomMutation();
  const {
    foodResult,
    marketResult,
    lifestyleResult,
    isLoading,
    // searchResult,
  } = useSelector(state => state.searchReducer);
  const {keyword} = useSelector(state => state.searchReducerSub);
  const {currentLocation} = useSelector(state => state.locationReducer);
  const {currentFilter} = useSelector(state => state.categoryReducer);
  // console.log('searchResult', searchResult);
  const layout = useWindowDimensions();
  const IMG_CONTAINER = layout.width * 0.66; //레이아웃 높이
  const IMG_HEIGHT = IMG_CONTAINER * 0.64; //이미지
  // console.log('TYPE:::::::::::', type);
  const limitItem2 = useRef(0);
  // useEffect(() => {
  //   limitItem2.current = 0;
  // }, [keyword]);
  const _getMoreSearch = () => {
    limitItem2.current += 20;

    const data = {
      item_count: limitItem2.current,
      limit_count: 20,
      stx: keyword,
      mb_jumju_type: JType,
      mb_lat: currentLocation.lat,
      mb_lng: currentLocation.lon,
    };

    if (JType === 'lifestyle') {
      mutateSearchLifeStyle.mutate(data, {
        onSuccess: e => {
          if (e.result === 'true') {
            // console.warn(e.data);
            // console.warn(lifestyleResult);
            let temp = e.data.arrItems;
            let origin = JSON.parse(JSON.stringify(lifestyleResult));
            origin = origin.concat(temp);
            console.log('jtype', JType);
            dispatch(setSearchResult({type: JType, item: origin}));
            // dispatch(setSearchResult(temp));
            // console.log('mutateSearchLifeStyle', e);
            // console.warn(e.data.resultItem.countItem);
            // dispatch(setSearchResult(temp));
          }
        },
      });
    } else {
      mutateSearch.mutate(data, {
        onSuccess: e => {
          // console.warn('food market', temp);
          // temp = temp.filter(item => item !== null);
          if (e.result === 'true') {
            let copyOrigin;
            let temp = e.data.arrItems;
            temp = temp.filter(item => item !== null);

            if (temp.length > 0) {
              if (JType === 'food') {
                copyOrigin = JSON.parse(JSON.stringify(foodResult));
              } else {
                copyOrigin = JSON.parse(JSON.stringify(marketResult));
              }
              console.warn('copy', copyOrigin);
              console.warn('temp', temp);

              copyOrigin[0].data = copyOrigin[0].data.concat(temp[0].data);
              dispatch(setSearchResult({type: JType, item: copyOrigin}));
            }
          }
          // else return customAlert('알림', '더보기 가능한 스토어가 없습니다.');
        },
      });
    }
  };

  // const _init = () => {
  //   const data = {
  //     item_count: 0,
  //     limit_count: 20,
  //     stx: keyword,
  //     mb_jumju_type: JType,
  //     mb_ca_sort: currentFilter + 1,
  //     mb_lat: currentLocation.lat,
  //     mb_lng: currentLocation.lon,
  //   };

  //   if (JType === 'lifestyle') {
  //     mutateSearchLifeStyle.mutate(data, {
  //       onSuccess: e => {
  //         if (e.result === 'true') {
  //           let temp = e.data.arrItems;
  //           dispatch(setSearchResult({type: JType, item: temp}));
  //         }
  //       },
  //     });
  //   } else {
  //     mutateSearch.mutate(data, {
  //       onSuccess: e => {
  //         if (e.result === 'true') {
  //           let temp = e.data.arrItems;
  //           temp = temp.filter(item => item !== null);
  //           dispatch(setSearchResult({type: JType, item: temp}));
  //         }
  //       },
  //     });
  //   }
  // };

  // useEffect(() => {
  //   console.warn('food changed', foodResult);
  // }, [foodResult]);

  // useEffect(() => {
  //   _init();
  // }, [currentFilter]);

  const renderItem = item => {
    // console.log('items', item);
    const storeInfo = item.item;
    return (
      <>
        <Shadow
          offset={[0, 1]}
          distance={3}
          style={{width: '100%', height: '100%'}}
          containerStyle={{
            marginVertical: 7,
            flex: 1,
          }}
        >
          <Pressable
            onPress={() => {
              if (JType === 'lifestyle') {
                dispatch(setIsLifeStyle(true));
                navigation.navigate('LifeStyleStoreInfo', {
                  jumju_id: storeInfo.mb_id,
                  jumju_code: storeInfo.mb_jumju_code,
                  category: JType,
                  mb_company: storeInfo.mb_company,
                });
              } else {
                dispatch(setIsLifeStyle(false));
                navigation.navigate('MenuDetail2', {
                  jumju_id: storeInfo.mb_id,
                  jumju_code: storeInfo.mb_jumju_code,
                  category: JType,
                  mb_company: storeInfo.mb_company,
                });
              }
            }}
            style={{
              borderRadius: 10,
              backgroundColor: 'white',
            }}
          >
            <View
              style={{
                height: IMG_HEIGHT,
                borderRadius: 10,
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginRight: 1,
                  backgroundColor: colors.inputBoxBG,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius:
                    storeInfo.store_image?.length === 1 ? 10 : null,
                  // borderBottomLeftRadius: 10,
                  overflow: 'hidden',
                }}
              >
                {!item?.section?.isOpen && JType !== 'lifestyle' && (
                  <ImageCover text />
                )}
                <FastImage
                  source={
                    item.item.store_image[0]
                      ? {uri: item.item.store_image[0]}
                      : require('~/assets/no_img.png')
                  }
                  resizeMode={FastImage.resizeMode.cover}
                  style={{flex: 1}}
                />
              </View>

              {item.item.store_image.length > 1 && (
                <>
                  <View
                    style={{
                      width: layout.width * 0.24,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        borderTopRightRadius: 10,
                        marginBottom: 1,
                        overflow: 'hidden',
                      }}
                    >
                      {!item?.section?.isOpen && JType !== 'lifestyle' && (
                        <ImageCover />
                      )}
                      <FastImage
                        source={
                          item.item.store_image[1]
                            ? {uri: item.item.store_image[1]}
                            : require('~/assets/no_img.png')
                        }
                        resizeMode={FastImage.resizeMode.cover}
                        style={{flex: 1}}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        // borderBottomRightRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      {!item?.section?.isOpen && JType !== 'lifestyle' && (
                        <ImageCover />
                      )}
                      <FastImage
                        source={
                          storeInfo.store_image[2]
                            ? {uri: storeInfo.store_image[2]}
                            : storeInfo.store_image[2] ??
                              require('~/assets/no_img.png')
                        }
                        resizeMode={FastImage.resizeMode.cover}
                        style={{flex: 1}}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>

            <View
              style={{
                flex: 1,
                // justifyContent: 'flex-end',
                padding: 10,
              }}
            >
              <View style={{}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{flex: 1}}>
                    <View
                      style={{
                        // marginBottom: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                        }}
                      >
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={{flex: 1}}>
                            <Text
                              style={{
                                fontFamily: 'Pretendard-Medium',
                                fontSize: 16,
                              }}
                              ellipsizeMode="tail"
                              numberOfLines={1}
                            >
                              {storeInfo.mb_company}
                            </Text>
                          </View>

                          {JType !== 'lifestyle' && (
                            <ReviewSimple
                              star={storeInfo.stars}
                              review={storeInfo.store_review}
                            />
                          )}
                        </View>
                        <View style={{marginLeft: 5, flex: 1}}>
                          <TextRegular
                            numberOfLines={1}
                            style={{color: colors.fontColorA2, fontSize: 12}}
                          >
                            {storeInfo.mb_jongmog}
                          </TextRegular>
                        </View>
                      </View>
                      {JType === 'lifestyle' && (
                        <View
                          style={{
                            width: 40,
                            justifyContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 5,
                          }}
                        >
                          <Image
                            source={require('~/assets/top_heart_on.png')}
                            style={{width: 20, height: 20, marginRight: 5}}
                          />
                          <TextRegular>
                            {storeInfo?.mb_zzim_count
                              ? storeInfo?.mb_zzim_count
                              : 0}
                          </TextRegular>
                        </View>
                      )}
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{}}>
                        <TextRegular
                          style={{color: colors.fontColorA2, fontSize: 12}}
                        >
                          {storeInfo.distance}
                        </TextRegular>
                      </View>
                      <Divider style={{marginHorizontal: 5}} />
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily: 'Pretendard-Medium',
                            fontSize: 12,
                            color: colors.fontColorA,
                          }}
                          ellipsizeMode="tail"
                          numberOfLines={1}
                        >
                          {storeInfo?.mb_addr1} {storeInfo?.mb_addr2}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {JType === 'lifestyle' && (
                  <View
                    style={{
                      marginTop: 2,
                      // flexDirection: 'row',
                    }}
                  >
                    <TextRegular
                      numberOfLines={1}
                      style={{color: colors.fontColorA2, fontSize: 12}}
                    >
                      {storeInfo?.mb_opening_hours2}
                    </TextRegular>
                  </View>
                )}

                {JType === 'market' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      // marginTop: 9,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      <TextRegular
                        style={{color: colors.fontColorA2, fontSize: 12}}
                      >
                        배달팁{' '}
                      </TextRegular>
                      <TextRegular
                        style={{color: colors.fontColor6, fontSize: 12}}
                      >
                        {replaceString(storeInfo.tipFrom)}원~
                        {replaceString(storeInfo.tipTo)}원
                      </TextRegular>
                      <Dot />
                      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TextRegular
                          style={{color: colors.fontColorA2, fontSize: 12}}
                        >
                          최소 주문{' '}
                        </TextRegular>
                        <TextRegular style={{fontSize: 12}}>
                          {replaceString(storeInfo.minPrice)}원{' '}
                        </TextRegular>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            source={require('~/assets/time.png')}
                            style={{width: 14, height: 14}}
                          />
                          <TextRegular style={{fontSize: 12}}>
                            {storeInfo.delivery_time}
                          </TextRegular>
                          {/* <TextRegular style={{fontSize: 12}}>40분</TextRegular> */}
                          <Dot />
                        </View>
                      </>

                      {/* <View style={{}}>
                      <TextRegular
                        style={{color: colors.fontColorA2, fontSize: 12}}>
                        {storeInfo.distance}
                      </TextRegular>
                    </View> */}
                    </View>
                  </View>
                )}
              </View>
              {JType === 'food' && (
                <>
                  {storeInfo.forHere && (
                    <View
                      style={{
                        // flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 20,
                          backgroundColor: '#ff7800',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5,
                          marginTop: 4,
                          marginRight: 10,
                        }}
                      >
                        <TextMedium style={{fontSize: 12, color: 'white'}}>
                          먹고가기
                        </TextMedium>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexWrap: 'wrap',
                          // backgroundColor: 'teal',
                          flexDirection: 'row',
                          alignItems: 'center',
                          // justifyContent: 'center',
                        }}
                      >
                        <Image
                          source={require('~/assets/time.png')}
                          style={{width: 14, height: 14}}
                        />
                        <TextRegular style={{fontSize: 12}}>
                          {' ' + storeInfo.cooking_time}
                        </TextRegular>
                        <Dot />

                        <TextRegular
                          style={{color: colors.fontColorA2, fontSize: 12}}
                        >
                          최소 주문{' '}
                        </TextRegular>

                        <TextRegular
                          style={{color: colors.fontColor2, fontSize: 12}}
                        >
                          {replaceString(storeInfo.minPriceForHere)}원{' '}
                        </TextRegular>

                        {/* <Dot /> */}
                        {/* <TextRegular
                            style={{color: colors.fontColorA2, fontSize: 12}}>
                            배달팁{' '}
                          </TextRegular>
                          <TextRegular
                            style={{color: colors.fontColor6, fontSize: 12}}>
                            {replaceString(storeInfo.tipFrom)}원~
                            {replaceString(storeInfo.tipTo)}원
                          </TextRegular> */}
                      </View>
                    </View>
                  )}

                  {storeInfo.delivery && (
                    <View
                      style={{
                        // flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 22,
                          backgroundColor: '#00bef0',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5,
                          marginTop: 4,
                          marginRight: 10,
                        }}
                      >
                        <TextMedium style={{fontSize: 12, color: 'white'}}>
                          배달하기
                        </TextMedium>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexWrap: 'wrap',
                          // backgroundColor: 'teal',
                          flexDirection: 'row',
                          alignItems: 'center',
                          // justifyContent: 'center',
                        }}
                      >
                        <Image
                          source={require('~/assets/time.png')}
                          style={{width: 14, height: 14}}
                        />
                        <TextRegular style={{fontSize: 12}}>
                          {' ' + storeInfo.delivery_time}
                        </TextRegular>
                        <Dot />

                        <TextRegular
                          style={{color: colors.fontColorA2, fontSize: 12}}
                        >
                          최소 주문{' '}
                        </TextRegular>

                        <TextRegular
                          style={{color: colors.fontColor2, fontSize: 12}}
                        >
                          {replaceString(storeInfo.minPrice)}원{' '}
                        </TextRegular>
                        <Dot />
                        <TextRegular
                          style={{color: colors.fontColorA2, fontSize: 12}}
                        >
                          배달팁{' '}
                        </TextRegular>
                        <TextRegular
                          style={{color: colors.fontColor6, fontSize: 12}}
                        >
                          {replaceString(storeInfo.tipFrom)}원~
                          {replaceString(storeInfo.tipTo)}원
                        </TextRegular>
                      </View>
                    </View>
                  )}

                  {storeInfo.wrap && (
                    <View
                      style={{
                        // flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 22,
                          backgroundColor: '#57cc98',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5,
                          marginTop: 4,
                          marginRight: 10,
                        }}
                      >
                        <TextMedium style={{fontSize: 12, color: 'white'}}>
                          포장하기
                        </TextMedium>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexWrap: 'wrap',
                          // backgroundColor: 'teal',
                          flexDirection: 'row',
                          alignItems: 'center',
                          // justifyContent: 'center',
                        }}
                      >
                        <Image
                          source={require('~/assets/time.png')}
                          style={{width: 14, height: 14}}
                        />
                        <TextRegular style={{fontSize: 12}}>
                          {' ' + storeInfo.cooking_time}
                        </TextRegular>
                        <Dot />

                        <TextRegular
                          style={{color: colors.fontColorA2, fontSize: 12}}
                        >
                          최소 주문{' '}
                        </TextRegular>

                        <TextRegular
                          style={{color: colors.fontColor2, fontSize: 12}}
                        >
                          {replaceString(storeInfo.minPriceWrap)}원{' '}
                        </TextRegular>

                        {/* <Dot />
                          <TextRegular
                            style={{color: colors.fontColorA2, fontSize: 12}}>
                            배달팁{' '}
                          </TextRegular>
                          <TextRegular
                            style={{color: colors.fontColor6, fontSize: 12}}>
                            {replaceString(storeInfo.tipFrom)}원~
                            {replaceString(storeInfo.tipTo)}원
                          </TextRegular> */}
                      </View>
                    </View>
                  )}
                </>
              )}
              {JType !== 'lifestyle' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* <Text style={{color: colors.fontColorA, fontSize: 12}}>
                  {storeInfo?.major_menu}
                </Text> */}
                  <Chip
                    coupon={storeInfo.coupon}
                    newStore={storeInfo.new}
                    takeout={storeInfo.wrap}
                  />
                </View>
              )}
            </View>
          </Pressable>
        </Shadow>
      </>
    );
  };
  // console.log('ISLOADING', isLoading);
  if (isLoading) return <Loading />;

  return (
    <View style={{flex: 1}}>
      {JType === 'lifestyle' ? (
        <FlatList
          data={lifestyleResult}
          renderItem={item => renderItem(item)}
          contentContainerStyle={{paddingHorizontal: 14}}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                marginTop: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextSBold>검색결과가 없습니다.</TextSBold>
              {/* <Image
                source={require('~/assets/no_store.png')}
                style={{width: 250, height: 250}}
              /> */}
            </View>
          }
          // ListFooterComponentStyle={{
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   marginVertical: 20,
          // }}
          // ListFooterComponent={
          //   mutateSearch.isLoading ? (
          //     <Loading />
          //   ) : foodResult.length > 0 ? (
          //     <Pressable
          //       onPress={() => {
          //         _getMoreSearch();
          //       }}
          //       style={{
          //         width: 150,
          //         height: 50,
          //         borderRadius: 10,
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //         backgroundColor: colors.primary,
          //       }}>
          //       <TextBold style={{color: 'white'}}>더보기</TextBold>
          //     </Pressable>
          //   ) : (
          //     <></>
          //   )
          // }
          keyExtractor={(item, index) => item + index}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (lifestyleResult.length % 20 === 0) _getMoreSearch();
          }}
        />
      ) : (
        <SectionList
          sections={JType === 'food' ? foodResult : marketResult}
          contentContainerStyle={{paddingHorizontal: 14}}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                marginTop: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextSBold>검색결과가 없습니다.</TextSBold>
              {/* <Image
                source={require('~/assets/no_store.png')}
                style={{width: 250, height: 250}}
              /> */}
            </View>
          }
          // ListFooterComponentStyle={{
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   marginVertical: 20,
          // }}
          // ListFooterComponent={
          //   mutateSearch.isLoading ? (
          //     <Loading />
          //   ) : foodResult.length > 0 ? (
          //     <Pressable
          //       onPress={() => {
          //         _getMoreSearch();
          //       }}
          //       style={{
          //         width: 150,
          //         height: 50,
          //         borderRadius: 10,
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //         backgroundColor: colors.primary,
          //       }}>
          //       <TextBold style={{color: 'white'}}>더보기</TextBold>
          //     </Pressable>
          //   ) : (
          //     <></>
          //   )
          // }
          keyExtractor={(item, index) => item + index}
          renderItem={item => renderItem(item)}
          renderSectionHeader={({section: {isOpen}}) =>
            !isOpen && (
              <>
                <DividerL style={{marginBottom: 20}} />
                {/* <TextBold style={{fontSize: 20}}>준비중이에요</TextBold> */}
              </>
            )
          }
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            // console.warn('length', foodResult);
            if (foodResult.length % 20 === 0 || marketResult.length % 20 === 0)
              _getMoreSearch();
          }}
        />
      )}
    </View>
  );
};

export default SearchList;
