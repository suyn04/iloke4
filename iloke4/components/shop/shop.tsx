import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function shop() {
    // const navigation = useNavigation();
    // const mapgo = () => {
    //     navigation.navigate('shop')
    // }
    // const listgo = () => {
    //     navigation.navigate('map')
    // }
    const datas = [
        { id: 1, name: "강남점", content: "서울시 강남구" },
        { id: 2, name: "신논현점", content: "서울시 강남구" },
    ]
    return (
        <View>
            <View style={style.wrapper}>
                <View style={style.tapwrap}>
                    <TouchableOpacity style={style.tap} onPress={mapgo}>
                        <Text >
                            가까운매장ㄴㄴㄹ
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.tap} onPress={listgo}>
                        <Text>주변매장</Text>
                    </TouchableOpacity>
                </View>
                <FlatList data={datas} keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <Text style={style.list}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )} />
            </View>

        </View>
    );
}

const style = StyleSheet.create(
    {
        wrapper: { flex: 1 },
        tapwrap: { flex: 1 },
        tap: { width: 200, height: 100, backgroundColor: "#faf" },
        list: { fontSize: 20 }
    })

export default shop;