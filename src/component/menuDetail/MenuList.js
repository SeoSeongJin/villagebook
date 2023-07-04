import React, {useState} from 'react';
import {View} from 'react-native';

const MenuList = ({focusTarget, scrollRef, arr}) => {
  const [index, setIndex] = useState();
  const FirstRoute = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          opacity: trigger ? 1 : 0,
          backgroundColor: 'white',
        }}>
        <ScrollView
          horizontal
          hitSlop={20}
          showsHorizontalScrollIndicator={false}>
          {arr.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                focusTarget.current[index].measureLayout(
                  scrollRef.current,
                  (left, top, width, height) => {
                    scrollRef.current.scrollTo({
                      x: 0,
                      y: top - 90,
                      animated: true,
                    });
                    console.log('position', left, top, width, height);
                  },
                );
                setSelected({idx: index, isScrolling: false});
              }}
              style={{
                height: 35,
                width: 50,
                backgroundColor: selected.idx === index ? 'tomato' : 'gray',
                margin: 10,
                borderRadius: 30,
              }}></Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const SecondRoute = () => {
    return <></>;
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  return (
    <>
      <TabView
        swipeEnabled={false}
        renderScene={renderScene}
        style={{
          height: 100,
        }}
        navigationState={{index, routes}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: 'rgb(240, 80, 20)',
            }}
            labelStyle={{color: 'black'}}
            style={{
              backgroundColor: 'white',
              fontWeight: 'bold',
              shadowOffset: {height: 0, width: 0},
              shadowColor: 'transparent',
            }}
            pressColor={'transparent'}
          />
        )}
        onIndexChange={setIndex}
      />
      {index === 0 && (
        <View
          style={{flex: 1, top: -50}}
          onLayout={e => {
            setTemp(e.nativeEvent.layout.y - 100);
          }}>
          {arr.map((item, index) => (
            <View
              key={index}
              ref={el => (focusTarget.current[index] = el)}
              style={{
                height: 400,
                backgroundColor: index % 2 === 0 ? 'teal' : 'linen',
              }}></View>
          ))}
        </View>
      )}
      {index === 1 && (
        <View style={{flex: 1}}>
          <Text>
            oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
          </Text>
        </View>
      )}
    </>
  );
};

export default MenuList;
