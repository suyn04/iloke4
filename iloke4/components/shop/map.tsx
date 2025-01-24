import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const map = ({ route }) => {
    const { shops, currentLocation } = route.params;
    console.log("정보오나", shops, currentLocation)
    console.log("가게위치", shops[0].location)
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
            >
                {/* 현재 위치 */}
                <Marker
                    coordinate={currentLocation}
                    title="현재 위치"
                    pinColor="blue"
                />

                {/* 가게 마커 */}
                {shops && shops.map((shop) => {
                    if (!shop.location || !shop.location.latitude || !shop.location.longitude) {
                        return null;
                    }
                    return (
                        <Marker
                            key={shop.id}
                            coordinate={{
                                latitude: shop.location.latitude,
                                longitude: shop.location.longitude,
                            }}
                            title={shop.name}
                            description={shop.address || '주소 정보 없음'}
                        />
                    )
                })}
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
