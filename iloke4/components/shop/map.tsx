import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const map = () => {
    return (
        <View>
            <MapView
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 37.541,
                    longitude: 126.986,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={styles.map}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        height: "100%",
        width: "100%"
    }
});

export default map;