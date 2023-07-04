import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import commonStyles from '../../styles/commonStyle';
import Header from '../../component/Header';
import TextBold from '../../component/text/TextBold';
import colors from '../../styles/colors';
import {_setRating} from '../../config/utils/modules';
import SetRating from '../../component/SetRating';
import {useCustomMutation} from '../../hooks/useCustomMutation';
import {useSelector} from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {customAlert} from '../../component/CustomAlert';
import Loading from '../../component/Loading';
import TextNotoR from '../../component/text/TextNotoR';

const CouponBookReview = ({navigation, route}) => {
  const routeData = route.params;
  const {mutateWriteReveiw} = useCustomMutation();
  const {userInfo} = useSelector(state => state.authReducer);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  console.log('userInfo', userInfo);
  const [fsImage, setFsImage] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);

  const [modal, setModal] = useState(false);
  // const [modalPic, setModalPic] = useState(false);

  console.log('data', routeData);
  const _writeReview = () => {
    const data = {
      mt_id: userInfo.mt_id,
      mt_name: userInfo.mt_name ? userInfo.mt_name : userInfo.mt_nickname,
      jumju_id: routeData.mb_id,
      jumju_code: routeData.mb_jumju_code,
      // od_id: routeData.od_id,
      wr_score: rating,
      mb_company: routeData.mb_company,
      rt_content: text,
      // rt_img1: {},
      // rt_img2: {},
      // rt_img3: {},
      // rt_img4: {},
      // rt_img5: {},
      isReview: true,
      imgArr: fsImage,
    };
    console.log('form data', data);

    mutateWriteReveiw.mutate(data, {
      onSuccess: e => {
        if (e.result === 'true') {
          customAlert('알림', '리뷰등록 완료 되었습니다');
          navigation.goBack();
        } else {
          customAlert('알림', '리뷰등록 실패 하였습니다');
          navigation.goBack();
        }
        console.log('e', e);
      },
    });
  };

  const _setImageFromCamera = () => {
    if (fsImage.length === 5)
      return customAlert('알림', '리뷰 사진은 최대 5장 등록가능합니다.');

    ImageCropPicker.openCamera({
      compressImageMaxHeight: 3000,
      compressImageMaxWidth: 2000,
      // cropping: true,
    }).then(image => {
      let temp = image.path.split('.');
      const convert = {
        uri: image.path,
        name: image.modificationDate + '.' + temp[temp.length - 1],
        type: image.mime,
      };
      console.log('convert', convert);
      console.log('image :', image);
      setFsImage(prev => [...prev, convert]);
      setImageUrl(prev => [...prev, convert.uri]);
    });
  };

  const _setImageFromLocal = () => {
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
      setFsImage(prev => [...prev, convert]);
      setImageUrl(prev => [...prev, convert.uri]);
    });
  };

  const _removeImage = itemUri => {
    let arr = [...fsImage];
    let temp = arr.filter(item => item.uri !== itemUri);
    setFsImage(temp);
    // console.log('temp', temp);
  };

  const ratingCompleted = rating => {
    console.log('Rating is: ' + rating);
  };

  if (mutateWriteReveiw.isLoading) return <Loading />;

  return (
    <SafeAreaView style={{...commonStyles.safeAreaStyle}}>
      <Header
        title={'리뷰쓰기'}
        navigation={navigation}
        style={{borderBottomWidth: 1, borderColor: colors.borderColor}}
      />
      <ScrollView>
        <View style={{paddingHorizontal: 22, marginBottom: 30}}>
          <View style={{alignItems: 'center', marginVertical: 30}}>
            {/* <Text style={{textAlign:'center'}}></Text> */}
            <TextBold
              style={{
                fontSize: 20,
                color: colors.fontColor2,
                textAlign: 'center',
              }}>
              {userInfo?.mt_name + '님,'} {routeData?.mb_name} 어떠셨나요?
            </TextBold>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              {/* {_setRating(false, {width: 40, height: 40})} */}
              <SetRating rating={rating} setRating={setRating} />
            </View>
          </View>
          <View
            style={{
              height: 230,
              borderWidth: 2,
              borderColor: colors.borderColor,
              paddingHorizontal: 10,
              paddingBottom: 40,
              borderRadius: 10,
            }}>
            <TextInput
              style={{
                borderRadius: 5,
                width: '100%',
                height: 180,
                backgroundColor: 'white',

                textAlignVertical: 'top',
              }}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={300}
              placeholder="리뷰를 남겨주세요"
            />
          </View>

          {console.log('fsImages', fsImage)}
          <View style={{flexDirection: 'row'}}>
            {fsImage.length > 0 &&
              fsImage.map((item, index) => (
                <Pressable
                  key={item.name + index}
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
                      _removeImage(item.uri);
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

          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => _setImageFromCamera()}
              style={{
                flex: 1,
                height: 70,
                backgroundColor: colors.mainBG1,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
                marginRight: 20,
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
              onPress={() => _setImageFromLocal()}
              style={{
                flex: 1,
                height: 70,
                backgroundColor: colors.mainBG2,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
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
          <Pressable
            onPress={() => _writeReview()}
            style={{
              height: 55,
              backgroundColor: colors.primary,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <TextBold
              style={{color: 'white', includeFontPadding: false, fontSize: 17}}>
              리뷰쓰기 완료
            </TextBold>
          </Pressable>
        </View>
      </ScrollView>
      {/* Modal for zooming image */}
      <Modal
        transparent
        visible={modal}
        onRequestClose={() => setModal(!modal)}>
        <ImageViewer
          imageUrls={[imageUrl]}
          useNativeDriver
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

      {/* Modal for selecting picture from where */}
      {/* <Modal
        transparent
        visible={modalPic}
        onRequestClose={() => setModal(!modalPic)}>
        <View style={{}}></View>
      </Modal> */}
    </SafeAreaView>
  );
};

export default CouponBookReview;
