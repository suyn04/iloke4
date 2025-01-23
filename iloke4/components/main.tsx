import React from 'react';
import { ScrollView, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-web-swiper';

function main(props) {
    const imgs = [
        require('./image/main/main_1.jpg'),
        require('./image/main/main_2.jpg'),
        require('./image/main/main_3.jpg'),
        require('./image/main/main_4.jpg'),
    ];

    // 이벤트 페이지로 이동하는 함수
    const goEvent = () => {
        props.navigation.navigate('event'); // 'EventPage'는 이동하려는 페이지 이름입니다.
    };

    return (
        <ScrollView contentContainerStyle={styles.wrapper}> {/* ScrollView로 전체 컨텐츠 감싸기 */}
            <View style={styles.banner}>
                <Swiper containerStyle={{ width: '100%', height: 100 }} loop timeout={3} controlsEnabled={false}>
                    {imgs.map((item, i) => (
                        <View key={i}>
                            <TouchableOpacity>
                                <Image source={item} style={styles.img} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </Swiper>
            </View>

            <TouchableOpacity style={styles.btn} onPress={goEvent}>
                <Text style={styles.btnText}>이벤트 확인하기</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                고객님을 위한 추천상품
            </Text>

            {/* 두 번째 스와이퍼: 아이템 2개씩 보이게 하며 아래로 스크롤하도록 설정 */}

            <Text>
                고객센터 : 01012341234
            </Text>
            <Text>
                평일09:00 ~ 17:30 (주말 및 공휴일 휴무)
                점심12:00 ~ 13:00
                (주)이로케 대표 : 간첩 서울 서초구 서초대로78길 48 송림빌딩 사업자등록번호 : 123-456-789 사업자정보확인 통신판매업신고번호 : 2024-배고프다-0920 개인정보보호책임자 : 우수정 팩스번호 : 123-456-789 이메일 : abcde@abcde.co.kr
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, // 전체 컨텐츠가 넘칠 때 스크롤이 가능하도록 설정
        justifyContent: 'center', // 상단 정렬
        alignItems: 'center',
    },
    banner: {
        width: '100%',
        height: '100%', // 첫 번째 스와이퍼의 높이 설정
        marginBottom: 10, // 아래쪽 여백 추가
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    btn: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        margin: 10,
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
        textAlign: 'left',
        marginBottom: 10, // 제목과 내용 사이에 여백 추가
    },
});

export default main;