import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, FlatList, StyleSheet, TouchableOpacity, PermissionsAndroid, ActivityIndicator, Modal, Image } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';

const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadius = 6371000; // 지구 반지름 (m)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // m 단위 반환
};


const shoppnew = ({ navigation }) => {
    const [shops, setShops] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setloading] = useState(true);

    // 위치 권한 요청 및 현재 위치 가져오기
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);

            if (
                granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED ||
                granted["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log("위치 권한 허용됨");
                return true;
            } else {
                console.log("위치 권한 거부됨");
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    };
    //현재위치패치
    const fetchCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setCurrentLocation(location);
                    resolve(location);
                },
                (error) => {
                    console.error("현재 위치를 가져오는 데 실패함:", error);
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    };
    const checkGPS = async () => {

        Geolocation.getCurrentPosition(
            (position) => {
                console.log("GPS 사용 가능", position);
            },
            (error) => {
                console.error("GPS가 비활성화됨. 위치 설정을 확인하세요.", error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

    };

    //패치정렬
    const fetchData = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;

        try {
            await checkGPS();
            const location = await fetchCurrentLocation();
            if (!location) {
                console.error("현재 위치 정보를 가져올 수 없습니다.");
                return;
            }

            const shopRef = database().ref('shop');
            shopRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const shopArray = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key]
                    }));
                    setShops(shopArray);
                }
                setloading(false);
            });
            return () => database().ref('shop').off();
        }
        catch (error) {
            console.error("fetchData오류")
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    //가까운순 정렬
    const sorted = currentLocation
        ? shops
            .map((shop) => ({
                ...shop,
                distance: haversine(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    shop.location.latitude,
                    shop.location.longitude
                ),
            }))
            .sort((a, b) => a.distance - b.distance)
        : shops;

    //로딩
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>매장 정보를 불러오는 중...</Text>
            </View>
        );
    }

    //이미지배열
    const Shopimages = [
        { id: 1, img: require("../image/shop/store21.jpg") },
        { id: 2, img: require("../image/shop/store22.jpg") },
        { id: 3, img: require("../image/shop/store23.jpg") },
        { id: 4, img: require("../image/shop/store24.jpg") },
        { id: 5, img: require("../image/shop/store25.jpg") },
        { id: 6, img: require("../image/shop/store26.jpg") },
        { id: 7, img: require("../image/shop/store27.jpg") },
        { id: 8, img: require("../image/shop/store28.jpg") },
        { id: 9, img: require("../image/shop/store29.jpg") },
        // { id: 10, img: require("../image/shop/store2.jpg") },
    ];
    const selectimage = (shopid) => {
        const oneimg = Shopimages.find((img) => img.id === shopid);
        return oneimg ? oneimg.img : require("../image/shop/store.jpg");
    };


    //모달창
    const openModal = (shop) => {
        setSelectedShop(shop);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedShop(null);
    };
    const renderItem = ({ item }) => {

        const formattedDistance =
            item.distance >= 1000
                ? `${(item.distance / 1000).toFixed(2)} km`
                : `${Math.round(item.distance)} m`;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => openModal(item)}
            >
                <View style={styles.head}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.distance && <Text style={styles.distance}>{formattedDistance}</Text>}
                </View>
                <Text style={styles.address}>{item.address}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.maplmg} onPress={() =>
                navigation.navigate('주변매장찾기', {
                    shops,
                    currentLocation,
                })
            }>
                <Text style={styles.maptext}>지도보기</Text>
                {/* <Image
                    source={require("../image/shop/store.jpg")}
                    style={styles.icon}
                /> */}
            </TouchableOpacity>
            <Text style={styles.title}>매장 리스트s</Text>
            <FlatList
                data={sorted}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
            />
            {/* 모달 창 */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedShop && (
                            <>
                                {/* {Shopimages.map((Shopimage) => (
                                    <Image
                                        key={Shopimage.id}
                                        source={Shopimage.img} 
                                        style={styles.image}
                                    />
                                ))} */}
                                <Image
                                    source={selectimage(selectedShop.id)}
                                    style={styles.image}
                                />
                                <Text style={styles.modalTitle}>{selectedShop.name}</Text>
                                <Text style={styles.modalAddress}>{selectedShop.address}</Text>
                                <Text style={styles.modaltime}>{selectedShop.time}</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                    <Text style={styles.closeButtonText}>닫기</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    icon: {
        width: 20,
        height: 20
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    head: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    distance: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 300,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalAddress: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    modaltime: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#f294b2',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    maplmg: {
        width: 50,
        height: 40,
        backgroundColor: '#f294b2',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    maptext: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default shoppnew;
