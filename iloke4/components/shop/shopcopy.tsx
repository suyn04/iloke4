import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, PermissionsAndroid, Platform, Text, Modal, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
//npm install react-native-geolocation-service

const shopcopy = () => {
    const [loading, setLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 37.541, // 서울 위도
        longitude: 126.986, // 서울 경도
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });
    const stores = [
        {
            id: "store1",
            name: "가구 브랜드 A",
            location: { latitude: 37.5091, longitude: 127.055 },
            address: "서울특별시 강남구 테헤란로 12길 34",
        },
        {
            id: "store2",
            name: "가구 브랜드 B",
            location: { latitude: 37.497, longitude: 127.027 },
            address: "서울특별시 서초구 반포대로 45길 18",
        },
        {
            id: "store3",
            name: "가구 브랜드 C",
            location: { latitude: 37.541, longitude: 126.986 },
            address: "서울특별시 송파구 올림픽로 22길 10",
        },
    ];
    // 위치 권한 요청 함수
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: '위치 접근 권한 요청',
                        message: '현재 위치를 사용하려면 권한이 필요합니다.',
                        buttonNeutral: '나중에',
                        buttonNegative: '거부',
                        buttonPositive: '허용',
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("위치 권한이 허용되었습니다.");
                    return true;
                } if (!granted) {
                    Alert.alert("위치 권한 필요", "앱에서 위치 정보를 사용하려면 권한을 허용해주세요.");
                }
                else {
                    console.log("위치 권한이 거부되었습니다.");
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        else {
            // iOS에서는 기본적으로 권한 요청 필요 없음
            return true;
        }
    }



    useEffect(() => {
        const getCurrentLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({
                        latitude,
                        longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    });
                    setLoading(false); // 로딩 완료
                },
                error => {
                    console.error('현재 위치를 가져오는 데 실패했습니다:', error.code, error.message)
                    Alert.alert("현재 위치를 가져올 수 없습니다. GPS 설정을 확인하세요.");
                    setCurrentLocation({
                        latitude: 37.541, // 서울 위도
                        longitude: 126.986, // 서울 경도
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    });
                    setLoading(false); // 로딩 완료
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getCurrentLocation();
    }, []);
    if (!currentLocation.latitude || !currentLocation.longitude) {
        return <View><Text>현재 위치를 불러오는 중...</Text></View>;
    }
    const [storeinfo, setstoreinfo] = useState("")
    const [modal, setmodal] = useState(false)
    const handleMarkerPress = (store) => {
        setstoreinfo(store)
        setmodal(true)
        setTimeout(() => {
            setmodal(true);
        }, 2000); // 2000ms = 2초
    }
    return (
        <View style={styles.container}>

            <MapView
                provider={PROVIDER_GOOGLE}
                region={currentLocation} // 현재 위치를 기준으로 초기화
                style={styles.map}
            >
                {/* 현재 위치 표시 */}
                <Marker
                    coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                    }}
                    title="현재 위치"
                    description="여기에 있습니다."
                />
                {/* 매장 마커 */}
                {stores.map((store) => (
                    <Marker
                        key={store.id}
                        // coordinate={store.location}
                        // title={store.name}
                        // description={store.address}
                        onPress={() => handleMarkerPress(store)}
                    />
                ))}
            </MapView>
            {/* 모달 창 */}
            <Modal
                visible={modal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setmodal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {storeinfo && (
                            <>
                                <Text style={styles.modalTitle}>{storeinfo.name}</Text>
                                <Text style={styles.modalAddress}>{storeinfo.address}</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setmodal(false)}
                                >
                                    <Text style={styles.closeButtonText}>닫기</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalAddress: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default shopcopy;
