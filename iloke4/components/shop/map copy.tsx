import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const map = ({ route }) => {
    const { shops } = route.params; // route.params로 shops 데이터 받기
    console.log("정보오나", shops)
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 37.498207,
        longitude: 127.027611,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // 권한요청
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: '위치 권한 요청',
                    message: '현재 위치를 사용하려면 권한이 필요합니다.',
                    buttonNeutral: '나중에',
                    buttonNegative: '취소',
                    buttonPositive: '확인',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    useEffect(() => {
        // 현재위치가져오기
        const getCurrentLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("현재위치보자:", latitude, longitude);
                    setCurrentLocation({
                        latitude,
                        longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    });
                },
                (error) => {
                    console.error('위치 가져오기 실패:', error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={currentLocation} // 현재위치기반
                showsUserLocation={true} // 사용자 위치 표시
            >
                <Marker coordinate={currentLocation} title='현재위치' />
                {/* 매장 데이터를 마커로 표시 */}
                {shops.map((shop) => (
                    <Marker
                        key={shop.id}
                        coordinate={shop.location}
                        title={shop.name}
                        description={shop.address}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default map;
