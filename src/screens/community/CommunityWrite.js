import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import commonStyles from '../../styles/commonStyle';
import TextBold from '../../component/text/TextBold';
import Header from '../../component/Header';
import colors from '../../styles/colors';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {customAlert} from '../../component/CustomAlert';
import FastImage from 'react-native-fast-image';

const CommunityWrite = ({navigation, route}) => {
  const {mutatePostFaq} = useCustomMutation();
  const isEdit = route.params?.isEdit;
  const routeData = route.params?.data;
  const {userInfo} = useSelector(state => state.authReducer);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [fsImage, setFsImage] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalPic, setModalPic] = useState(false);

  const [imgDel, setImgDel] = useState({
    qa_img_del1: 0,
    qa_img_del2: 0,
    qa_img_del3: 0,
    qa_img_del4: 0,
    qa_img_del5: 0,
  });

  const _postCommunity = () => {
    const data = {
      act: isEdit ? 'update' : 'insert',
      mt_id: userInfo.mt_id,
      qa_title: title,
      qa_content: body,
      isFaq: true,
      imgArr: fsImage,
      ...imgDel,
    };
    if (isEdit) {
      data.qa_id = routeData.qa_id;
    }

    console.log('data', data);

    if (!title.trim() || !body.trim())
      return customAlert('알림', '제목, 내용을 입력해주세요.');
    mutatePostFaq.mutate(data, {
      onSettled: e => {
        if (e.result === 'true') {
          customAlert('알림', '문의 작성이 완료되었습니다.');
          navigation.navigate('FAQ');
        }
        console.log('e', e);
      },
    });
  };

  const _setProfileImage = async () => {
    if (fsImage.length === 5)
      return customAlert('알림', '문의 사진은 최대 5장 등록가능합니다.');

    const image = await ImageCropPicker.openCamera({
      forceJpg: true,
      multiple: true,
      mediaType: 'photo',
      // compressImageQuality: 0.5,
      compressImageMaxHeight: 2700,
      compressImageMaxWidth: 1800,
      // cropping: true,
    });
    await ImageCropPicker.clean();
    if (image) {
      let temp = image.path.split('.');
      const convert = {
        uri: image?.path,
        name: image?.modificationDate + '.' + temp[temp.length - 1],
        type: image?.mime,
      };
      console.log('convert', convert);
      console.log('image :', image);

      setFsImage(prev => [...prev, convert]);
      setImageUrl(prev => [
        ...prev,
        {
          // url: convert.uri,
          // sizeKb: image.size,
          // originSizeKb: image.size,
          // originUrl: image.sourceURL,
          // freeHeight: true,
          // freeWidth: true,
          url: convert.uri,
        },
      ]);

      setModalPic(false);
    }
    // imageUrls={[{originSizeKb, originUrl, sizeKb, }]}
  };

  const _setProfileImageFromLocal = () => {
    if (fsImage.length === 5)
      return customAlert('알림', '리뷰 사진은 최대 5장 등록가능합니다.');
    ImageCropPicker.openPicker({}).then(image => {
      let temp = image.path.split('.');
      const convert = {
        uri: image.path,
        name: image.modificationDate + '.' + temp[temp.length - 1],
        type: image.mime,
      };
      console.log('convert', convert);
      console.log('image :', image);
      setModalPic(!modalPic);
      // let tempFs = JSON.parse(JSON.stringify(fsImage));
      // setFsImage();
      setFsImage(prev => [...prev, convert]);
      setImageUrl(prev => [...prev, {uri: convert.uri}]);
    });
  };

  const _removeImage = (itemUri, index) => {
    let copyObj = {...imgDel};
    copyObj[`qa_img_del${index + 1}`] = 1;
    setImgDel(copyObj);

    let arr = [...fsImage];
    let temp = arr.filter(item => item.uri !== itemUri);
    setFsImage(temp);
    // console.log('temp', temp);
  };

  useEffect(() => {
    if (isEdit) {
      setTitle(routeData.qa_subject);
      setBody(routeData.qa_content);
      let temp = [];
      if (routeData.pic.length > 0) {
        routeData.pic.map((item, idx) => {
          temp.push({uri: item});
        });
      }
      setFsImage(temp);
      console.log('temp ::', temp);
      console.log('routeData ::', routeData);
    }
  }, []);

  useEffect(() => {
    console.log(':: fs', fsImage);
    console.log(':: url', imageUrl);
  }, [fsImage, imageUrl]);

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header title={'커뮤니티'} navigation={navigation} showCart={true} />
      <ScrollView>
        <View style={{flex: 1, paddingHorizontal: 22, marginTop: 20}}>
          <TextBold>제목</TextBold>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
            style={{
              ...commonStyles.inputContainer,
              marginTop: 5,
              marginBottom: 20,
            }}></TextInput>
          <TextBold>내용</TextBold>
          <TextInput
            value={body}
            onChangeText={setBody}
            textAlignVertical="top"
            multiline
            maxLength={500}
            placeholder={'내용을 입력하세요(최대 500자)'}
            style={{
              ...commonStyles.inputContainer,
              marginTop: 5,
              marginBottom: 20,
              height: 200,
            }}></TextInput>

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            {fsImage.length > 0 &&
              fsImage.map((item, index) => (
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
                  }}>
                  <Pressable
                    onPress={() => {
                      _removeImage(item.uri, index);
                    }}
                    style={{
                      position: 'absolute',
                      zIndex: 100,
                      right: 3,
                      top: 3,
                    }}>
                    <Image
                      source={require('~/assets/pop_close.png')}
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: colors.primary,
                      }}
                    />
                  </Pressable>
                  <Image
                    source={{uri: item.uri ? item.uri : null}}
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
            onPress={() => setModalPic(!modalPic)}
            style={{
              height: 70,
              backgroundColor: colors.inputBoxBG,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('~/assets/btn_add.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: colors.fontColor2,
                marginRight: 10,
              }}
            />
            <TextBold
              style={{color: colors.fontColor2, includeFontPadding: false}}>
              사진을 등록해주세요. (최대 5개)
            </TextBold>
          </Pressable>

          <Pressable
            onPress={() => !mutatePostFaq.isLoading && _postCommunity()}
            style={{
              height: 50,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.couponBG,
              borderRadius: 10,
            }}>
            {mutatePostFaq.isLoading ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <TextBold style={{color: colors.fontColor2}}>
                {isEdit ? '수정하기' : '작성하기'}
              </TextBold>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={modal}
        onRequestClose={() => setModal(!modal)}
        transparent>
        <ImageViewer
          imageUrls={imageUrl}
          saveToLocalByLongPress={false}
          enablePreload={true}
          useNativeDriver={true}
          renderHeader={() => (
            <Pressable
              hitSlop={20}
              onPress={() => {
                setModal(!modal);
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

      <Modal
        transparent
        visible={modalPic}
        onRequestClose={() => {
          setModalPic(!modalPic);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 22,
            flexDirection: 'column',
          }}>
          <Pressable
            hitSlop={20}
            onPress={() => {
              setModalPic(!modalPic);
            }}
            style={{
              alignSelf: 'flex-end',
              zIndex: 300,
            }}>
            <Image
              source={require('~/assets/pop_close.png')}
              style={{
                top: 50,
                width: 30,
                height: 30,
                tintColor: 'white',
              }}
            />
          </Pressable>
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <View
              style={{
                width: '100%',
                height: 70,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                ...Platform.select({
                  ios: {
                    shadowColor: '#00000029',
                    shadowOpacity: 0.6,
                    shadowRadius: 50 / 2,
                    shadowOffset: {
                      height: 12,
                      width: 0,
                    },
                  },
                  android: {
                    elevation: 5,
                  },
                }),
              }}>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  onPress={() => _setProfileImage()}
                  style={{
                    flex: 1,
                    height: 70,
                    backgroundColor: colors.mainBG1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('~/assets/btn_add.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: colors.fontColor2,
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                    resizeMode="contain"
                  />
                  <TextBold
                    style={{
                      color: colors.fontColor2,
                      includeFontPadding: false,
                      flex: 1,
                    }}>
                    사진 촬영
                  </TextBold>
                </Pressable>

                <Pressable
                  onPress={() => _setProfileImageFromLocal()}
                  style={{
                    flex: 1,
                    height: 70,
                    backgroundColor: colors.mainBG2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('~/assets/btn_add.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: colors.fontColor2,
                      marginRight: 10,
                      marginLeft: 10,
                    }}
                    resizeMode="contain"
                  />
                  <TextBold
                    style={{
                      flex: 1,
                      color: colors.fontColor2,
                      includeFontPadding: false,
                    }}>
                    갤러리 가져오기
                  </TextBold>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityWrite;
