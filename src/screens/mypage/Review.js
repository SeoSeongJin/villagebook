import {
  View,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import TextBold from '../../component/text/TextBold';
import FastImage from 'react-native-fast-image';
import TextLight from '../../component/text/TextLight';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Errorhandler} from '../../config/ErrorHandler';
import {useEffect} from 'react';

const Review = ({navigation}) => {
  const {mutateGetMyReview} = useCustomMutation();
  const [reviews, setReviews] = useState([]);
  const {userInfo} = useSelector(state => state.authReducer);
  const [modal, setModal] = useState({visible: false, image: []});
  const layout = useWindowDimensions();

  const limitItem = useRef(0);

  const _getMyReview = () => {
    const data = {
      item_count: 0,
      limit_count: 20,
      bo_table: 'review',
      mt_id: userInfo.mt_id,
    };
    mutateGetMyReview.mutate(data, {
      onError: e => {
        Errorhandler(e);
      },
      onSettled: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0)
          setReviews(e.data.arrItems);
        console.log('e', e);
      },
    });
  };

  const _getMore = () => {
    limitItem.current += 20;

    const data = {
      item_count: limitItem.current,
      limit_count: 20,
      bo_table: 'review',
      mt_id: userInfo.mt_id,
    };

    mutateGetMyReview.mutate(data, {
      onError: e => {
        Errorhandler(e);
      },
      onSettled: e => {
        if (e.result === 'true' && e.data.arrItems.length > 0)
          setReviews(prev => prev.concat(e.data.arrItems));
        console.log('e', e);
      },
    });
  };

  const _convertImage = images => {
    let temp = [];
    images?.map((item, index) => {
      temp.push({url: item});
    });
    return temp;
  };

  const _setRating = (isTotal, userRate) => {
    const temp = 5;
    let count = userRate ?? 0;
    let temp2 = [];

    for (let i = 0; i < temp; i++) {
      temp2.push(
        <Image
          key={i}
          source={
            count
              ? count > i
                ? require('~/assets/ico_star_on.png')
                : require('~/assets/ico_star_off.png')
              : require('~/assets/ico_star_off.png')
          }
          style={{width: isTotal ? 20 : 16, height: isTotal ? 20 : 16}}
          resizeMode="contain"
        />,
      );
    }

    return temp2;
  };

  const renderItem = item => {
    const data = item.item;

    return (
      <View
        style={{
          flex: 1,
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 22,
            paddingBottom: 10,
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FastImage
            source={
              data.mt_profile_url
                ? {uri: mt_profile_url}
                : require('~/assets/no_use_img.png')
            }
            style={{width: 70, height: 70, borderRadius: 20}}
          />
          <View
            style={{marginLeft: 10, flex: 1, justifyContent: 'space-between'}}>
            <TextBold style={{fontSize: 16, color: colors.fontColor2}}>
              {data.mb_company}
            </TextBold>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                {_setRating(false, data.rating)}
              </View>
            </View>
            {/*
            <TextRegular style={{color: colors.fontColor2}}>
              {data?.menu}
            </TextRegular>
            */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextLight style={{color: colors.fontColorA}}>
                {data.datetime}
              </TextLight>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => {
            if (data.pic.length > 0)
              setModal({visible: !modal.visible, image: data.pic});
          }}>
          {data?.pic.map((item, index) => (
            <FastImage
              key={index}
              source={{uri: item}}
              style={{
                borderRadius: 10,
                alignSelf: 'center',
                width: layout.width - 44,
                height: layout.width - 44,
              }}
            />
          ))}
        </Pressable>

        <View style={{padding: 22}}>
          <TextRegular>{data.content}</TextRegular>
        </View>
      </View>
    );
  };
  // if (mutateGetMyReview.isLoading) return <Loading />;

  useEffect(() => {
    _getMyReview();
  }, []);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={'내가 작성한 리뷰'}
        navigation={navigation}
        showCart={true}
      />
      <FlatList
        data={reviews}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 22,
            }}>
            <TextRegular>작성된 리뷰가 없습니다.</TextRegular>
          </View>
        }
        ListHeaderComponent={() => (
          <>
            {/* <View
              style={{
                paddingHorizontal: 22,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="제목으로 검색해주세요"
                style={{
                  flex: 1,
                  height: 50,
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                  borderRadius: 7,
                  paddingLeft: 20,
                  paddingRight: 40,
                }}></TextInput>
              <Image
                source={require('~/assets/ico_search.png')}
                style={{
                  position: 'absolute',
                  right: 36,
                  width: 20,
                  height: 20,
                  tintColor: colors.fontColor2,
                }}
              />
            </View>
            <DividerL /> */}
          </>
        )}
        ItemSeparatorComponent={() => <View style={{marginVertical: 20}} />}
        renderItem={item => renderItem(item)}
        keyExtractor={(item, index) => index}
        onEndReached={() => {
          console.warn('Get More Review');
          _getMore();
        }}
      />

      <Modal
        transparent
        visible={modal.visible}
        onRequestClose={() => {
          setModal({...modal, visible: !modal.visible});
        }}>
        {/* {console.log('modal img', modal.image)} */}
        <ImageViewer
          useNativeDriver
          enablePreload
          saveToLocalByLongPress={false}
          imageUrls={_convertImage(modal.image)}
          renderHeader={() => (
            <Pressable
              hitSlop={20}
              onPress={() => {
                setModal({...modal, visible: false});
              }}
              style={{alignItems: 'flex-end', margin: 20, zIndex: 300}}>
              <Image
                source={require('~/assets/pop_close.png')}
                style={{
                  top: 30,
                  zIndex: 100,
                  width: 30,
                  height: 30,
                  tintColor: 'white',
                  position: 'absolute',
                }}
              />
            </Pressable>
          )}
          loadingRender={() => (
            <ActivityIndicator size={'large'} color={colors.primary} />
          )}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Review;
