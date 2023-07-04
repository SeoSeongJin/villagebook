import {View, Text} from 'react-native';
import React from 'react';
import ImageSwipe from '../../component/menuDetail/ImageSwipe';
import MenuDesc from '../../component/menuDetail/MenuDesc';

const MenuHeader = ({item, routeData, navigation}) => {
  const info = item[0].StoreInfo;

  return (
    <View>
      <ImageSwipe images={info.store_image} />
      <MenuDesc
        categoryMain={routeData.category}
        info={info}
        navigation={navigation}
        routeData={routeData}
        likeCount={info.mb_zzim_count}
      />
    </View>
  );
};

export default MenuHeader;
