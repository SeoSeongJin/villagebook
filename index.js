/**
 * @format
 */

import {AppRegistry, Linking, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import VersionCheck from 'react-native-version-check';
import {customAlert} from './src/component/CustomAlert';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  const channelId1 = await notifee.createChannel({
    id: 'onBackground',
    name: 'Default Channel onBackground',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  // await notifee.displayNotification({
  //   title: 'BG' + remoteMessage.notification.title,
  //   body: remoteMessage.notification.body,
  //   android: {
  //     channelId: channelId1,
  //     importance: AndroidImportance.HIGH,
  //   },
  // });
});

notifee.onBackgroundEvent(async ({type, detail, ...etc}) => {
  const {notification, pressAction} = detail;
  console.log('type', type);
  console.log('detail', detail);
  // Check if the user pressed the "Mark as read" action
  // if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
  // Update external API
  //   await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
  //     method: 'POST',
  //   });

  // Remove the notification
  //   await notifee.cancelNotification(notification.id);
  // }
});
AppRegistry.registerComponent(appName, () => App);
