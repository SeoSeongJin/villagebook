import {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import {setCurrentLocation} from '../store/reducers/LocationRecuder';

export const useGeoLocation = () => {
  const dispatch = useDispatch();

  const _requestPermissions = async callback => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    callback();
  };

  const _getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('cur location', latitude, longitude);
        dispatch(setCurrentLocation({lat: latitude, lon: longitude}));
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    _requestPermissions(_getCurrentLocation);
  }, []);
  return {_requestPermissions, _getCurrentLocation};
};
