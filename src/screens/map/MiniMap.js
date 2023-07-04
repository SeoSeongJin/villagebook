import {View, Text, useWindowDimensions} from 'react-native';
import React from 'react';
import NaverMapView from 'react-native-nmap';
import {Marker} from 'react-native-nmap';
import colors from '../../styles/colors';

const MiniMap = ({lng, lat, isStore, width, height, canUseZoom}) => {
  const layout = useWindowDimensions();
  return (
    <View
      style={{
        paddingHorizontal: isStore ? 0 : 22,
      }}>
      <NaverMapView
        style={{width: width ? width : '100%', height: height ? height : 200}}
        showsMyLocationButton={isStore ? false : true}
        zoomControl={isStore ? (canUseZoom ? true : false) : false}
        scaleBar={false}
        center={
          lat && lng
            ? {
                latitude: Number(lat),
                longitude: Number(lng),
                zoom: 16,
              }
            : undefined
        }
        scrollGesturesEnabled={true}
        zoomGesturesEnabled={true}
        tiltGesturesEnabled={false}
        rotateGesturesEnabled={true}
        stopGesturesEnabled={false}
        liteModeEnabled={false}
        onCameraChange={e => {
          //   setPosition({latitude: e.latitude, longitude: e.longitude});
          //   _convertCoor({lon: e.longitude, lat: e.latitude});
        }}
        onMapClick={e => {
          //   setPosition({latitude: e.latitude, longitude: e.longitude});
          //   _convertCoor({lon: e.longitude, lat: e.latitude});
          // setPosition({latitude: e.latitude, longitude: e.longitude});
        }}>
        {lat && lng && (
          <Marker
            width={25}
            height={30}
            animateToCoordinate={e => {
              console.log('anime', e);
            }}
            coordinate={
              lat && lng
                ? {
                    latitude: Number(lat),
                    longitude: Number(lng),
                  }
                : undefined
            }
            onClick={() => console.log('onClick! p0')}
          />
        )}
      </NaverMapView>
    </View>
  );
};

export default MiniMap;
