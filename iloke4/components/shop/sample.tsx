import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';


function sample() {

    const [region, setregion] = useState(null)
    const [userpos, setuserpos] = useState(null)
    const stores = [
        {
            id: "store1",
            name: "이로케 강남점",
            location: { latitude: 37.498207, longitude: 127.027611 },
            address: "서울특별시 강남구 테헤란로 12길 34",
        },
        {
            id: "store2",
            name: "이로케 역삼점",
            location: { latitude: 37.500139, longitude: 127.036209 },
            address: "서울특별시 강남구 역삼동 123-4",
        },
        {
            id: "store3",
            name: "이로케 삼성점",
            location: { latitude: 37.514283, longitude: 127.056144 },
            address: "서울특별시 강남구 영동대로 513",
        },
        {
            id: "store4",
            name: "이로케 송파점",
            location: { latitude: 37.5024, longitude: 127.1035 },
            address: "서울특별시 송파구 올림픽로 300",
        },
        {
            id: "store5",
            name: "이로케 서초점",
            location: { latitude: 37.4837, longitude: 127.0323 },
            address: "서울특별시 서초구 반포대로 57",
        },
        {
            id: "store6",
            name: "이로케 마포점",
            location: { latitude: 37.5562, longitude: 126.9238 },
            address: "서울특별시 마포구 마포대로 18",
        },
        {
            id: "store7",
            name: "이로케 종로점",
            location: { latitude: 37.5727, longitude: 126.979 },
            address: "서울특별시 종로구 종로 1",
        },
        {
            id: "store8",
            name: "이로케 노원점",
            location: { latitude: 37.6543, longitude: 127.0569 },
            address: "서울특별시 노원구 동일로 123",
        },
        {
            id: "store9",
            name: "이로케 은평점",
            location: { latitude: 37.6012, longitude: 126.929 },
            address: "서울특별시 은평구 은평로 45",
        },
        {
            id: "store10",
            name: "이로케 일산점",
            location: { latitude: 37.674, longitude: 126.767 },
            address: "경기도 고양시 일산서구 호수로 595",
        },
        {
            id: "store11",
            name: "이로케 분당점",
            location: { latitude: 37.377, longitude: 127.112 },
            address: "경기도 성남시 분당구 분당로 124",
        },
        {
            id: "store12",
            name: "이로케 수원점",
            location: { latitude: 37.2636, longitude: 127.0286 },
            address: "경기도 수원시 팔달구 중부대로 123",
        },
        {
            id: "store13",
            name: "이로케 용인점",
            location: { latitude: 37.237, longitude: 127.177 },
            address: "경기도 용인시 기흥구 강남로 25",
        },
        {
            id: "store14",
            name: "이로케 평택점",
            location: { latitude: 36.990, longitude: 127.088 },
            address: "경기도 평택시 평남로 123",
        },
        {
            id: "store15",
            name: "이로케 안양점",
            location: { latitude: 37.394, longitude: 126.927 },
            address: "경기도 안양시 만안구 안양로 45",
        },
        {
            id: "store16",
            name: "이로케 의정부점",
            location: { latitude: 37.738, longitude: 127.045 },
            address: "경기도 의정부시 평화로 123",
        },
        {
            id: "store17",
            name: "이로케 구리점",
            location: { latitude: 37.594, longitude: 127.143 },
            address: "경기도 구리시 검배로 45",
        },
        {
            id: "store18",
            name: "이로케 하남점",
            location: { latitude: 37.539, longitude: 127.214 },
            address: "경기도 하남시 하남로 78",
        },
        {
            id: "store19",
            name: "이로케 남양주점",
            location: { latitude: 37.635, longitude: 127.216 },
            address: "경기도 남양주시 다산로 22",
        },
        {
            id: "store20",
            name: "이로케 김포점",
            location: { latitude: 37.619, longitude: 126.715 },
            address: "경기도 김포시 김포대로 94",
        },
    ];

    const requestlocationPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "위치권한",
                message: "이 앱은 사용자 위치 정보를 사용합니다.",
                buttonNeutral: "나중에",
                buttonNegative: "취소",
                buttonPositive: "확인"

            }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    // 현재위치가져오기
    const getcurrentlocation = () => {
        Geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords
            console.log("현재위치보자:", latitude, longitude);
            setuserpos({ latitude, longitude }) //사용자위치업데이트
            setregion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            })
        })
    }

    useEffect(() => {
        const fetchLocation = async () => {
            const haspermission = await requestlocationPermission()
            if (haspermission) {
                console.log("위치권한부여 성공")
                setregion({
                    latitude: 37.498207,
                    longitude: 22.027611,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                })
                //gps 좌표 받기 호출
                getcurrentlocation()
            }
            else {
                console.log("위치권한부여 거부")
            }
        }
        fetchLocation()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {region && (
                <MapView style={{ flex: 1 }} region={region}>
                    <Marker coordinate={userpos} title='현재위치' />
                    {stores.map((store) => (
                        <Marker
                            key={store.id}
                            coordinate={store.location}
                            title={store.name}
                            description={store.address}
                        // onPress={() => handleMarkerPress(store)}
                        />
                    ))}
                </MapView>
            )
            }

        </View>
    )
}

export default sample;