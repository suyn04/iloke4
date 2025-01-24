import React, {useState} from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

const promotionData = [
  {
    id: 1,
    image: require('../image/main/main_1.jpg'),
    name: '신규 구매자 대상 10% 할인 이벤트',
    period: '상시',
    url: 'https://www.instagram.com/p/DFMQp0ZTDdM/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 2,
    image: require('../image/main/main_2.jpg'),
    name: '신년맞이 거실 제품 2개 이상 구매시 램프 증정 이벤트',
    period: '2025.1.1 ~ 2025.1.31',
    url: 'https://www.instagram.com/p/DFMQsBqTjRV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 3,
    image: require('../image/main/main_3.jpg'),
    name: '수험생 인증시 책상, 의자 10% 할인 이벤트',
    period: '2024.12.1 ~ 2025.2.28',
    url: 'https://www.instagram.com/p/DFMQ1qyT1Oa/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: 4,
    image: require('../image/main/main_4.jpg'),
    name: '디스플레이 샹품 40% 할인 구매 이벤트',
    period: '2025.1.1 ~ 2025.3.30',
    url: 'https://www.instagram.com/p/DFMQ2iUTzJq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
];

function Promotion({navigation}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {promotionData.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate('promotionDetail', {item})}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.period}>{item.period}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  period: {
    fontSize: 14,
    color: '#666',
  },
});

export default Promotion;
