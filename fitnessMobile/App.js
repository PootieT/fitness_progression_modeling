/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './LoginScreen';
import WorkoutScreen from './WorkoutScreen';

const MainNavigator = createStackNavigator({
  Home: {screen: LoginScreen},
  Workout: {screen: WorkoutScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
