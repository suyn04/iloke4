import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

function main({ navigation }) {
    return (
        <View>
            <Text>main</Text>
            <TouchableOpacity style={{ backgroundColor: "#faf" }} onPress={() => navigation.navigate('shoplist')}>
                <Text>매장</Text>
            </TouchableOpacity>
        </View>
    );
}

export default main;