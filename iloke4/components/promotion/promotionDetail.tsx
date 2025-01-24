import React, {useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import WebView from 'react-native-webview';

function promotionDetail({route}) {
  const {item} = route.params; // Goods에서 전달된 데이터

  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri: item.url}}
        style={{
          width: '100%',
          height: '60%',
        }}
      />
    </View>
  );
}

export default promotionDetail;
