/**
 * @format
 */

import { AppRegistry } from 'react-native';
import shoplist from './components/shop/shoplist';
import sample from './components/shop/sample';
import main from './components/main';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => sample);
