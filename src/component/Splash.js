import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';

const Splash = () => {
  const layout = useWindowDimensions();
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setTimeout(() => {
      fadeOut();
    }, 1500);
  }, []);

  return (
    <Animated.View
      style={[
        styles.fadingContainer,
        {
          // Bind opacity to animated value
          opacity: fadeAnim,
        },
      ]}
    >
      <SafeAreaView style={{...styles.container}}>
        {Platform.OS === 'ios' ? (
          <Image
            source={require('../assets/splash.png')}
            style={{width: layout.width, height: layout.height}}
            resizeMode="contain"
          ></Image>
        ) : (
          <Image
            source={require('../assets/splash.png')}
            style={{width: '100%', height: '100%'}}
            resizeMode="center"
          ></Image>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadingContainer: {
    flex: 1,
    backgroundColor: '#20ABC8',
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
});

export default Splash;
