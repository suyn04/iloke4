import React from 'react';
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens';
import database from '@react-native-firebase/database';


enableScreens();

import main from './main';
import board from './board/board';
import goods from './goods/goods';
import promotion from './promotion/promotion';
import shoplist from './shop/shoplist';
import sample from './shop/sample';
import shopcopy from './shop/shopcopy';

const Stack = createStackNavigator();  //네비게이션을 Stack 기반으로 동작

function index() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='main'>
                    <Stack.Screen name='main' component={main} />
                    <Stack.Screen name='board' component={board} />
                    <Stack.Screen name='goods' component={goods} />
                    <Stack.Screen name='promotion' component={promotion} />
                    <Stack.Screen name='shoplist' component={shoplist} />
                    {/* <Stack.Screen name='sample' component={sample} />
                    <Stack.Screen name='shopcopy' component={shopcopy} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default index;