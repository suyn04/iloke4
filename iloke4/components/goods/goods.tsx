import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';

function goods({ navigation }) {
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
        { id:31, image: require('../image/goods/chair3.jpg'), name: '깔끔 의자', price: '210,000 원', description: "깔끔한 의자" },
        { id:32, image: require('../image/goods/chair4.jpg'), name: '와우 의자', price: '310,000 원', description: "와우한 의자" },
        { id:33, image: require('../image/goods/chair5.jpg'), name: '짱짱 의자', price: '250,000 원', description: "짱짱한 의자" },
        { id:34, image: require('../image/goods/chair6.jpg'), name: '튼튼 의자', price: '270,000 원', description: "튼튼한 의자" },
    ];

    const [goodsData, setGoodsData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollViewRef = useRef(null); // ScrollView 참조

    const itemsPerPage = 10;

    useEffect(() => {
        loadMoreData();
    }, []);

    const loadMoreData = () => {
        if (isLoading) return;
        setIsLoading(true);
    
        setTimeout(() => {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = page * itemsPerPage;
    
            const newData = allGoodsData.slice(startIndex, endIndex);
    
            if (newData.length > 0) {
                setGoodsData((prevData) => [...prevData, ...newData]);
                setPage((prevPage) => prevPage + 1);
            } else {
                // 상품이 더 이상 없을 때 알림
                if (goodsData.length === allGoodsData.length) {
                    Alert.alert('마지막 상품입니다.');
                }
            }
            setIsLoading(false);
        }, 1000);
    };
    
    const filteredGoods = goodsData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const rows = [];
    for (let i = 0; i < filteredGoods.length; i += 2) {
        rows.push(filteredGoods.slice(i, i + 2));
    }

    const scrollToTop = () => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.container}
                onMomentumScrollEnd={(e) => {
                    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
                    if (contentOffset.y + layoutMeasurement.height >= contentSize.height-1) {
                        loadMoreData();
                    }
                }}
                ref={scrollViewRef}
            >
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="상품 제목 검색"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

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

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00f" />
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
                <Text style={styles.scrollToTopText}>TOP</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    searchContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
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
    scrollToTopButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 10,
        zIndex: 1,
    },
    scrollToTopText: {
        color: '#fff',
        fontSize: 20,
    },
});

export default goods;
