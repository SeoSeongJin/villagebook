import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {Provider} from 'react-redux';
import Splash from './src/component/Splash';
import MainStackNavigator from './src/navigator/MainStackNavigator';
import store from './src/store/store';
import messaging from '@react-native-firebase/messaging';
import { createInstance, HackleProvider } from "@hackler/react-native-sdk";
import {
  Alert,
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import notifee, {
  EventType,
  AndroidBadgeIconType,
  AndroidImportance,
} from '@notifee/react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Text} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {APP_VERSION_AOS, APP_VERSION_IOS} from '@env';
import {customAlert} from './src/component/CustomAlert';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const qeuryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: e => {
      console.error('::: useQuery Error occurred', e);
    },
    onSuccess: s => {
      // console.log('::: useQuery Success', s);
    },
  }),
  mutationCache: new MutationCache({
    onError: e => {
      console.error('::: useMutation Error occurred', e);
    },
    onSuccess: s => {
      // console.log('::: useMutation Success', s);
    },
  }),
});



const config = {
  debug: true
};
const hackleClient = createInstance("tLKGZ9Z8LVNokOAB96Eze2HDpJpEIVnp", config);

const App = () => {
  // VersionCheck.getCountry().then(country => console.log(country)); // KR
  // console.log(VersionCheck.getPackageName()); // com.reactnative.app
  // console.log(VersionCheck.getCurrentBuildNumber()); // 10
  // console.log(VersionCheck.getCurrentVersion()); // 0.1.1
  // if (Platform.OS === 'android' && version !== APP_VERSION_AOS) {
  // return <>{VersionCheck.needUpdate()}</>;
  // return <>{customAlert('알림', '최신 버전이 아닙니다.', () => {})}</>;
  // }
  // if (Platform.OS === 'ios' && version !== APP_VERSION_IOS) {
  // return customAlert('알림', '최신 버전이 아닙니다.', () => {});
  // }

  const [isSplash, setIsSplash] = useState(false);
  const [checkVersion, setChekcVersion] = useState(false);

  const _checkVersion = () => {
    VersionCheck.needUpdate().then(async res => {
      console.log(res.isNeeded); // true
      VersionCheck.getLatestVersion().then(res =>
        console.log('getLatestVersion', res),
      );
      if (res.isNeeded) {
        customAlert(
          '알림',
          '현재 최신버전이 아닙니다. 업데이트를 위해 스토어 페이지로 이동합니다.',
          () =>
            VersionCheck.getStoreUrl({
              appID: 'com.dmonster.dongnaebook',
              packageName: 'com.dmonster.dongnaebook',
            }).then(e => Linking.openURL(res.storeUrl)),
        );
        // VersionCheck.getStoreUrl().then(e => Linking.openURL(res.storeUrl)); // open store if update is needed.
      } else setChekcVersion(true);
    });
  };

  // const onMessageReceived = async message => {
  //   console.log('message', message);
  //   const channelId2 = await notifee.createChannel({
  //     id: 'onForeground',
  //     name: 'Default Channel onForeground',
  //     importance: AndroidImportance.HIGH,
  //   });
  //   // Display a notification
  //   notifee.onForegroundEvent(e => {
  //     console.log('onForegroundEvent', e);
  //     if (e.type === 1) {
  //       switch (message.data.type) {
  //         case 'order':
  //           navi.navigate('Main');
  //       }
  //     }
  //   });

  //   await notifee.displayNotification({
  //     title: message.notification.title,
  //     body: message.notification.body,
  //     android: {
  //       channelId: channelId2,
  //       importance: AndroidImportance.HIGH,
  //     },
  //     ios: {},
  //   });
  // };
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    let enabled;
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    )
      enabled = true;

    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  // useEffect(() => {
  //   Linking.getInitialURL().then(link => console.warn('app::::::', link));
  //   dynamicLinks()
  //     .getInitialLink()
  //     .then(link => console.warn('app dynamic :::::::', link));
  // }, []);

  useEffect(() => {
    requestUserPermission();
    // _deepLink();
    // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // // When the component is unmounted, remove the listener
    // return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     onMessageReceived(remoteMessage);
  //     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    _checkVersion();
    if (checkVersion) {
      setTimeout(() => {
        setIsSplash(true);
      }, 2000);
    }
  }, [checkVersion]);

  if (!isSplash) return <Splash />;
  // if (!checkVersion)
  //   return (
  //     <>
  //       {_checkVersion()}
  //       <Splash />
  //     </>
  //   );

  return (
    <HackleProvider hackleClient={hackleClient}>
    <Provider store={store}>
      <QueryClientProvider client={qeuryClient}>
        <MainStackNavigator />
      </QueryClientProvider>
    </Provider>
    </HackleProvider>
  );
};

export default App;
