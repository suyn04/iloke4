import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

function Goods({ navigation }) {
    // 전체 데이터 (실제 프로젝트에서는 서버에서 받아올 데이터로 구현 가능)
    const allGoodsData = [
        { id:1, image: require('../image/goods/chair1.jpg'), name: '모던 의자', price: '200,000 원', description: "모던하고 모던하고 모던한 의자" },
        { id:2, image: require('../image/goods/drawer1.jpg'), name: '베이직 서랍', price: '300,000 원', description: "베이직하고 베이직한 서랍" },
        { id:3, image: require('../image/goods/drawer2.jpg'), name: '모던 서랍', price: '400,000 원', description: "모던한 서랍" },
        { id:4, image: require('../image/goods/drawer3.jpg'), name: '원더플 서랍', price: '300,000 원', description: "원더플한 서랍" },
        { id:5, image: require('../image/goods/drawer4.jpg'), name: '굿 서랍', price: '250,000 원', description: "굿 서랍" },
        { id:6, image: require('../image/goods/chair2.jpg'), name: '깔끔 의자', price: '210,000 원', description: "깔끔한 의자" },
        { id:7, image: require('../image/goods/drawer5.jpg'), name: '모던 서랍', price: '400,000 원', description: "모던한 서랍" },
        { id:8, image: require('../image/goods/bed1.jpg'), name: '원더플 침대', price: '300,000 원', description: "원더플한 침대" },
        { id:9, image: require('../image/goods/bed2.jpg'), name: '굿 침대', price: '250,000 원', description: "굿 침대" },
        { id:10, image: require('../image/goods/chair3.jpg'), name: '깔끔 의자', price: '210,000 원', description: "깔끔한 의자" },
        { id:11, image: require('../image/goods/chair4.jpg'), name: '와우 의자', price: '310,000 원', description: "와우한 의자" },
        { id:12, image: require('../image/goods/chair5.jpg'), name: '짱짱 의자', price: '250,000 원', description: "짱짱한 의자" },
        { id:13, image: require('../image/goods/chair6.jpg'), name: '튼튼 의자', price: '270,000 원', description: "튼튼한 의자" },
        { id:14, image: require('../image/goods/sofa1.jpg'), name: '튼튼 쇼파', price: '410,000 원', description: "튼튼한 쇼파" },
        { id:15, image: require('../image/goods/sofa2.jpg'), name: '쩌는 쇼파', price: '486,000 원', description: "쩌는 쇼파" },
        // 여기까지 한싸이클.. 더미데이터를 더 넣어주면 됨
        { id:16, image: require('../image/goods/drawer5.jpg'), name: '모던 서랍', price: '400,000 원', description: "모던 서랍" },
        { id:17, image: require('../image/goods/chair1.jpg'), name: '모던 의자', price: '200,000 원', description: "모던하고 모던하고 모던한 의자" },
        { id:18, image: require('../image/goods/drawer1.jpg'), name: '베이직 서랍', price: '300,000 원', description: "베이직하고 베이직한 서랍" },
        { id:19, image: require('../image/goods/drawer2.jpg'), name: '모던 서랍', price: '400,000 원', description: "모던한 서랍" },
        { id:20, image: require('../image/goods/drawer3.jpg'), name: '원더플 서랍', price: '300,000 원', description: "원더플한 서랍" },
        { id:21, image: require('../image/goods/drawer4.jpg'), name: '굿 서랍', price: '250,000 원', description: "굿 서랍" },
        { id:22, image: require('../image/goods/chair2.jpg'), name: '깔끔 의자', price: '210,000 원', description: "깔끔한 의자" },
        { id:23, image: require('../image/goods/drawer5.jpg'), name: '모던 서랍', price: '400,000 원', description: "모던한 서랍" },
        { id:24, image: require('../image/goods/bed1.jpg'), name: '원더플 침대', price: '300,000 원', description: "원더플한 침대" },
        { id:25, image: require('../image/goods/bed2.jpg'), name: '굿 침대', price: '250,000 원', description: "굿 침대" },
        { id:26, image: require('../image/goods/chair3.jpg'), name: '깔끔 의자', price: '210,000 원', description: "깔끔한 의자" },
        { id:27, image: require('../image/goods/chair4.jpg'), name: '와우 의자', price: '310,000 원', description: "와우한 의자" },
        { id:28, image: require('../image/goods/chair5.jpg'), name: '짱짱 의자', price: '250,000 원', description: "짱짱한 의자" },
        { id:29, image: require('../image/goods/chair6.jpg'), name: '튼튼 의자', price: '270,000 원', description: "튼튼한 의자" },
        { id:30, image: require('../image/goods/sofa1.jpg'), name: '튼튼 쇼파', price: '410,000 원', description: "튼튼한 쇼파" },
        { id:31, image: require('../image/goods/sofa2.jpg'), name: '쩌는 쇼파', price: '486,000 원', description: "쩌는 쇼파" },
    ];

    const [goodsData, setGoodsData] = useState([]); // 현재 화면에 표시할 데이터
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
    const [enableLoading, setEnableLoading] = useState(true); // 로딩 표시 숨기기 여부
    const itemsPerPage = 12; // 한 번에 로드할 데이터 개수

    // 초기 데이터 로드
    useEffect(() => {
        loadMoreData();
    }, []);

    // 데이터 로드 함수
    const loadMoreData = () => {
        if (isLoading) return; // 이미 로딩 중이면 중복 호출 방지
        setIsLoading(true);

        setTimeout(() => {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = page * itemsPerPage;
            
            const newData = allGoodsData.slice(startIndex, endIndex);
            
            if (newData.length > 0) {
                setGoodsData((prevData) => [...prevData, ...newData]);
                setPage((prevPage) => prevPage + 1);
            }else{
                Alert.alert('마지막 상품입니다.');
                setEnableLoading(false);
            }
            setIsLoading(false);
        }, 1000); // 로딩 효과를 위해 1초 지연
    };

    // 데이터를 두 줄로 나누기
    const rows = [];
    for (let i = 0; i < goodsData.length; i += 2) {
        rows.push(goodsData.slice(i, i + 2));
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            onMomentumScrollEnd={(e) => {
                // 최하단 스크롤 시 추가 데이터 로드
                const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
                if (contentOffset.y + layoutMeasurement.height >= contentSize.height) {
                    loadMoreData();
                }
            }}
        >
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((item, itemIndex) => (
                        <TouchableOpacity
                            key={itemIndex}
                            style={styles.card}
                            onPress={() => navigation.navigate('goodsDetail', { item })}
                        >
                            <Image source={item.image} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            {
                enableLoading &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00f" />
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    card: {
        width: 180,
        height: 260,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        overflow: 'hidden',
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
    loadingContainer: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Goods;
