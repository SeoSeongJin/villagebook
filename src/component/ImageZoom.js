import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import colors from '../styles/colors';

const ImageZoom = ({image, modal, setModal}) => {
  return (
    <Modal
      transparent
      visible={modal}
      onRequestClose={() => {
        setModal(!modal);
      }}>
      <ImageViewer
        imageUrls={image}
        useNativeDriver
        loadingRender={() => (
          <ActivityIndicator size={'large'} color={colors.primary} />
        )}
      />
    </Modal>
  );
};

export default ImageZoom;
