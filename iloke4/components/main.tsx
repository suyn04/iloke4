import React from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-web-swiper';

function main({navigation}) {
  const imgs = [
    require('./image/main/main_1.jpg'),
    require('./image/main/main_2.jpg'),
    require('./image/main/main_3.jpg'),
    require('./image/main/main_4.jpg'),
  ];

  const goEvent = () => {
    navigation.navigate('event');
  };

  const promotionData = [
    {
      id: 1,
      image: require('./image/main/main_1.jpg'),
      name: '신규 구매자 대상 10% 할인 이벤트',
      period: '상시',
      url: 'https://www.instagram.com/p/DFMQp0ZTDdM/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    },
    {
      id: 2,
      image: require('./image/main/main_2.jpg'),
      name: '신년맞이 거실 제품 2개 이상 구매시 램프 증정 이벤트',
      period: '2025.1.1 ~ 2025.1.31',
      url: 'https://www.instagram.com/p/DFMQsBqTjRV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    },
    {
      id: 3,
      image: require('./image/main/main_3.jpg'),
      name: '수험생 인증시 책상, 의자 10% 할인 이벤트',
      period: '2024.12.1 ~ 2025.2.28',
      url: 'https://www.instagram.com/p/DFMQ1qyT1Oa/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    },
    {
      id: 4,
      image: require('./image/main/main_4.jpg'),
      name: '디스플레이 샹품 40% 할인 구매 이벤트',
      period: '2025.1.1 ~ 2025.3.30',
      url: 'https://www.instagram.com/p/DFMQ2iUTzJq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    },
  ];

  const goodsData = [
    {
      id: 1,
      image: require('./image/goods/chair1.jpg'),
      name: '모던 의자',
      price: '200,000 원',
      description: '모던하고 모던하고 모던한 의자',
    },
    {
      id: 2,
      image: require('./image/goods/drawer1.jpg'),
      name: '베이직 서랍',
      price: '300,000 원',
      description: '베이직하고 베이직한 서랍',
    },
    {
      id: 3,
      image: require('./image/goods/drawer2.jpg'),
      name: '모던 서랍',
      price: '400,000 원',
      description: '모던한 서랍',
    },
    {
      id: 4,
      image: require('./image/goods/drawer3.jpg'),
      name: '원더플 서랍',
      price: '300,000 원',
      description: '원더플한 서랍',
    },
  ];

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.banner}>
        <Swiper
          containerStyle={{ width: '100%', height: 500 }}
          loop
          timeout={3}
          controlsEnabled={false}>
          {promotionData.map((item, i) => (
            <View key={i} style={styles.promotionContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('promotionDetail', { item })}>
                <Image source={item.image} style={styles.img} />
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
      </View>

        <TouchableOpacity style={styles.btn} onPress={goEvent}>
          <Text style={styles.btnText}>이벤트 확인하기</Text>
        </TouchableOpacity>

        <Text style={styles.title}>고객님을 위한 추천상품</Text>

        <ScrollView
          horizontal
          contentContainerStyle={styles.horizontalScroll}
          showsHorizontalScrollIndicator={false}>
          {goodsData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate('goodsDetail', {item})}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>고객센터 : 01012341234</Text>
          <Text style={styles.bottomText}>
            평일09:00 ~ 17:30 (주말 및 공휴일 휴무)
          </Text>
          <Text style={styles.bottomText}>점심12:00 ~ 13:00</Text>
          <Text style={styles.bottomText}>
            (주)이로케 대표 : 간첩 서울 서초구 서초대로78길 48 송림빌딩
          </Text>
          <Text style={styles.bottomText}>사업자등록번호 : 123-456-789</Text>
          <Text style={styles.bottomText}>
            통신판매업신고번호 : 2024-배고프다-0920
          </Text>
          <Text style={styles.bottomText}>개인정보보호책임자 : 우수정</Text>
          <Text style={styles.bottomText}>팩스번호 : 123-456-789</Text>
          <Text style={styles.bottomText}>이메일 : abcde@abcde.co.kr</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  banner: {
    width: '100%',
    height: 500,
    marginBottom: 10,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promotionContainer: {
    flex: 1,
    position: 'relative',
  },
  btn: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  card: {
    width: 180,
    height: 260,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 15,
    color: '#888',
  },
  bottomTextContainer: {
    padding: 10,
    backgroundColor: '#005d75',
  },
  bottomText: {
    color: '#fff',
  },
  horizontalScroll: {
    paddingHorizontal: 10,
  },
});

export default main;
