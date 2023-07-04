import {View, Text, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Pressable} from 'react-native';
import TextBold from '../../component/text/TextBold';
import TextMedium from '../../component/text/TextMedium';
import dayjs from 'dayjs';
import colors from '../../styles/colors';
import {useState} from 'react';
import {Image} from 'react-native';

const PushLIstRenderItem = ({data}) => {
  const [toggle, setToggle] = useState({id: '', visible: false});
  const [height, setHeight] = useState(0);

  const _onPressTitle = id => {
    console.log('id', id);
    setToggle({id: id, visible: !toggle.visible});
  };

  // const animHeight = useRef(new Animated.Value(0)).current;

  // const showAnim = () => {
  //   Animated.timing(animHeight, {
  //     toValue: toggle.visible ? 40 : 0,
  //     useNativeDriver: false,
  //     duration: 400,
  //   }).start();
  // };

  // useEffect(() => {
  //   showAnim();
  // }, [toggle]);

  // useEffect(() => {
  //   console.log('height', height);
  // }, [height]);

  return (
    <Pressable
      onPress={() => _onPressTitle(data.od_id)}
      style={{
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
      }}>
      <View
        style={{marginBottom: 4, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <TextBold style={{color: colors.fontColor2, fontSize: 15}}>
            {data.pst_title}
          </TextBold>
        </View>
        <Image
          source={require('~/assets/arrow.png')}
          style={{
            width: 17,
            height: 17,
            // tintColor: 'black',
            transform: [{rotate: toggle.visible ? '180deg' : '0deg'}],
          }}
        />
      </View>
      {toggle.id === data.od_id && toggle.visible && (
        <View
          style={{
            marginBottom: 2,
            // height: animHeight,
          }}>
          <View onLayout={e => setHeight(e.nativeEvent.layout.height)}>
            <TextMedium style={{color: colors.fontColor2}}>
              {data.pst_content}
            </TextMedium>
          </View>
        </View>
      )}
      <TextMedium style={{color: colors.fontColorA, fontSize: 12}}>
        {dayjs(data.pst_wdate).format('YYYY년 MM월 DD일 HH:mm')}
      </TextMedium>
    </Pressable>
  );
};

export default PushLIstRenderItem;
