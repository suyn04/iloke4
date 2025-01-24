import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';

enableScreens();

// 각 스크린 컴포넌트 import
import main from './main';
import board from './board/board';
import goods from './goods/goods';
import goodsDetail from './goods/goodsDetail';
import promotion from './promotion/promotion';
import shoplist from './shop/shoplist';
import sample from './shop/sample';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator(); // Footer를 위한 Bottom Tab Navigator 생성
const Stack = createStackNavigator();

// Tab Navigator (Footer 포함)
function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#1B2228', // 활성 탭 글자색
                tabBarInactiveTintColor: '#C7CDD3', // 비활성 탭 글자색
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'main') {
                        iconName = 'home-outline';
                    } else if (route.name === 'shop') {
                        iconName = 'map-outline';
                    } else if (route.name === 'goods') {
                        iconName = 'gift-outline';
                    } else if (route.name === 'event') {
                        iconName = 'bullhorn-outline';
                    } else if (route.name === 'board') {
                        iconName = 'clipboard-outline';
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                headerShown: false, // 헤더 숨김
            })}
        >
            <Tab.Screen name="main" component={main} options={{ title: 'Home' }} />
            <Tab.Screen name="goods" component={goods} options={{ title: 'Goods' }} />
            <Tab.Screen name="event" component={promotion} options={{ title: 'Event' }} />
            <Tab.Screen name="board" component={board} options={{ title: 'Board' }} />
            <Tab.Screen name="shop" component={shoplist} options={{ title: 'Shop' }} />
        </Tab.Navigator>
    );
}

// 메인 컴포넌트
function index() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Stack" component={AppTabs}
                        options={({ navigation }) => ({
                            headerTitle: () => (
                                <TouchableOpacity onPress={() => navigation.navigate('Stack', { screen: 'main' })}>
                                    <Image
                                        source={require('./image/main/logo.png')} // 로고 이미지 경로
                                        style={styles.headerImage}
                                    />
                                </TouchableOpacity>
                            ),
                            headerTitleAlign: 'center',
                        })}
                    />
                    <Stack.Screen name='goodsDetail' component={goodsDetail} />
                    <Stack.Screen name='sample' component={sample} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        width: 120,
        height: 40,
        resizeMode: 'contain', // 이미지 크기를 유지하며 맞추기
    },
});

export default index;
