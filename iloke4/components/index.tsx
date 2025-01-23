import React from 'react';
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import {enableScreens} from 'react-native-screens';
import database from '@react-native-firebase/database';


enableScreens();

import main from './main';
import board from './board/board';
import goods from './goods/goods';
import goodsDetail from './goods/goodsDetail';
import promotion from './promotion/promotion';
import shop from './shop/shop';

const Stack = createStackNavigator();  //네비게이션을 Stack 기반으로 동작

function index() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='goods'>
                    <Stack.Screen name='main' component={main}/>
                    <Stack.Screen name='board' component={board}/>
                    <Stack.Screen name='goods' component={goods}/>
                    <Stack.Screen name='goodsDetail' component={goodsDetail}/>
                    <Stack.Screen name='promotion' component={promotion}/>
                    <Stack.Screen name='shop' component={shop}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default index;