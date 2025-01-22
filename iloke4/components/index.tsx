import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import database from '@react-native-firebase/database';

enableScreens();

// 각 스크린 컴포넌트 import
import main from './main';
import board from './board/board';
import goods from './goods/goods';
import promotion from './promotion/promotion';
import shop from './shop/shop';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // Footer를 위한 Bottom Tab Navigator 생성

// Stack Navigator (Main 화면용)
function MainStack() {
  return (
    <Stack.Navigator 
      initialRouteName="main" 
    >
      <Stack.Screen 
        name="main" 
        component={main} 
        options={{ title: 'Main' }} // Header 제목 설정
      />
      <Stack.Screen name="board" component={board} options={{ title: 'Board Screen' }} />
      <Stack.Screen name="goods" component={goods} options={{ title: 'Goods Screen' }} />
      <Stack.Screen name="promotion" component={promotion} options={{ title: 'Promotion Screen' }} />
      <Stack.Screen name="shop" component={shop} options={{ title: 'Shop Screen' }} />
    </Stack.Navigator>
  );
}

// Tab Navigator (Footer 포함)
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#6200ea', // Footer 배경색
        },
        tabBarActiveTintColor: '#fff', // 활성 탭 글자색
        tabBarInactiveTintColor: '#bdbdbd', // 비활성 탭 글자색
      }}
    >
      <Tab.Screen name="Home" component={MainStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Shop" component={shop} options={{ title: 'Shop' }} />
      <Tab.Screen name="Goods" component={goods} options={{ title: 'Goods' }} />
      <Tab.Screen name="Promotion" component={promotion} options={{ title: 'Promotion' }} />
      <Tab.Screen name="board" component={board} options={{ title: 'Board' }} />
    </Tab.Navigator>
  );
}

// 메인 컴포넌트
function index() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default index;
