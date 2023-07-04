import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import colors from '../styles/colors';

const Pagination = ({
  selectedPage,
  total,
  numberOfItems,
  handlePage,
  marginVertical,
}) => {
  const totalPage = total > 0 ? Math.ceil(total / numberOfItems) : 1;
  const showingPage = 5;
  const [pager, setPager] = useState(1);
  const [page, setPage] = useState([]);

  const nextPageNum = () => {
    setPager(prev => {
      if (prev < totalPage / showingPage) {
        handlePage(prev * showingPage + 1);
        return prev + 1;
      } else {
        return prev;
      }
    });
  };

  const prevPageNum = () => {
    setPager(prev => {
      if (prev > 1) {
        handlePage((prev - 1) * showingPage);
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  useEffect(() => {
    const arr = new Array(showingPage)
      .fill(null)
      .map((item, index) =>
        index + 1 + (pager - 1) * showingPage <= totalPage
          ? index + 1 + (pager - 1) * showingPage
          : item,
      );
    setPage(arr);
  }, [totalPage, pager]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: marginVertical,
        backgroundColor: colors.pagenationBG,
      }}>
      <TouchableOpacity onPress={prevPageNum}>
        <Image
          source={require('~/assets/arrow_l.png')}
          style={{
            width: 15,
            height: 15,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        {page.map(item =>
          item ? (
            <TouchableOpacity
              key={`pagination-${item}`}
              style={{
                width: 28,
                height: 28,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handlePage(item)}>
              <Text
                style={{
                  color:
                    item === selectedPage
                      ? colors.fontColor2
                      : colors.fontColorA,
                  fontFamily: 'NotoSansKR-Regular',
                  includeFontPadding: false,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ) : null,
        )}
      </View>
      <TouchableOpacity onPress={nextPageNum}>
        <Image
          source={require('~/assets/arrow_r.png')}
          style={{
            width: 15,
            height: 15,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
