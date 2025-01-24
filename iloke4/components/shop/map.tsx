import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import database from '@react-native-firebase/database';
// import { useNavigation } from '@react-navigation/native';

const map = ({ route }) => {
    const { shops } = route.params; // Goods에서 전달된 데이터
    console.log("item", shops)
    return (
        <ScrollView >
            <View>
                <Text>매장 리스트</Text>

            </View>
        </ScrollView>
    );
};



export default map;
