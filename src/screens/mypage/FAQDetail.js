import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import TextBold from '../../component/text/TextBold';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import TextRegular from '../../component/text/TextRegular';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import Loading from '../../component/Loading';
import ImageViewer from 'react-native-image-zoom-viewer';

const FAQDetail = ({navigation, route}) => {
  const boardIdx = route.params.boardIndex;
  const {userInfo} = useSelector(state => state.authReducer);
  const {mutateGetFaqDetail} = useCustomMutation();
  const [detail, setDetail] = useState([]);
  const [modal, setModal] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);

  const _getDetail = () => {
    const data = {
      item_count: '0',
      limit_count: '10',
      mt_id: userInfo.mt_id,
      qa_id: boardIdx,
    };

    mutateGetFaqDetail.mutate(data, {
      onSettled: e => {
        if (e.result === 'true') setDetail(e.data.arrItems);
        console.log('e', e);
      },
    });
  };

  const _convertImage = images => {
    let temp = [];
    if (images?.length > 0) {
      images.map((item, index) => {
        temp.push({url: item});
      });
      return temp;
    } else return [];
  };
  useEffect(() => {
    _getDetail();
  }, []);

  if (!detail) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'1:1문의'} navigation={navigation} showCart={true} />
      <ScrollView>
        <View style={{flex: 1, paddingHorizontal: 22, marginTop: 20}}>
          <TextBold>제목</TextBold>
          <View
            style={{
              ...commonStyles.inputContainer,
              marginTop: 5,
              marginBottom: 20,
              justifyContent: 'center',
            }}
          >
            <TextRegular>{detail.qa_subject}</TextRegular>
          </View>

          <TextBold>문의내용</TextBold>
          <View
            style={{
              ...commonStyles.inputContainer,
              paddingTop: 10,
              marginTop: 5,
              marginBottom: 20,
              height: 200,
            }}
          >
            <TextRegular>{detail.qa_content}</TextRegular>
          </View>
          {detail.qa_status === '1' && (
            <>
              <TextBold>답변</TextBold>
              <View
                style={{
                  ...commonStyles.inputContainer,
                  paddingTop: 10,
                  marginTop: 5,
                  marginBottom: 20,
                  height: 200,
                }}
              >
                <TextRegular>{detail.answer_content}</TextRegular>
              </View>
            </>
          )}

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            {detail?.pic?.length > 0 &&
              detail.pic.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setModal(!modal);
                  }}
                  style={{
                    flex: 1,
                    maxWidth: 100,
                    height: 100,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginHorizontal: 3,
                    marginTop: 10,
                  }}
                >
                  <Image
                    source={{uri: item ? item : null}}
                    style={{
                      flex: 1,
                      height: 100,
                      backgroundColor: colors.inputBoxBG,
                    }}
                  />
                </Pressable>
              ))}
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate('FAQWrite', {isEdit: true, data: detail})
            }
            style={{
              height: 50,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.couponBG,
              borderRadius: 10,
            }}
          >
            <TextBold style={{color: colors.fontColor2}}>수정</TextBold>
          </Pressable>
          <Pressable
            style={{
              height: 50,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.inputBoxBG,
              borderRadius: 10,
            }}
          >
            <TextBold style={{color: colors.fontColor2}}>삭제</TextBold>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        saveToLocalByLongPress={false}
        // transparent
        visible={modal}
        onRequestClose={() => setModal(!modal)}
      >
        <ImageViewer
          imageUrls={_convertImage(detail?.pic)}
          useNativeDriver
          renderHeader={() => (
            <Pressable
              hitSlop={20}
              onPress={() => {
                setModal(!modal);
              }}
              style={{alignItems: 'flex-end', margin: 20, zIndex: 300}}
            >
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

export default FAQDetail;
