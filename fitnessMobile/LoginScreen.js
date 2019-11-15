import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import DefaultInputForm from './DefaultInputForm/DefaultInputForm';


class LoginScreen extends React.Component {
  
  state = {
    username: ''
  }

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log("previous username found! and it is:",value);
        this.setState({
          username: username.toLowerCase().replace(/ /g,"_")
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  componentDidMount = () => {
    this._retrieveData('@MySuperStore:PreviousAppUser')
  }

  updateUsername = (username) => {
    this.setState({
      username: username.toLowerCase().replace(/ /g,"_")
    })
    this._storeData('@MySuperStore:PreviousAppUser', username)
    console.log("login screen state:", this.state.username)
  }

  static navigationOptions = {
    title: "Welcome to Peter Fitness Tracking App",
    headerStyle: {backgroundColor: '#e2c499'},
    headerTitleStyle: { color: 'white' },
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.usernameInput}>
          <DefaultInputForm updateHandler={this.updateUsername}>Username</DefaultInputForm>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigate('Workout', {username: this.state.username})}>
          <Text style={styles.buttonText}>Begin Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#e2c499',
  },
  usernameInput: {
    // position: 'absolute',
    // top: '30%'
    marginTop: '50%'
  },
  button: {
    backgroundColor: '#e8a735',
    alignSelf: 'center',
    marginTop: '10%',
    width: '60%',
    height: 40,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
});

export default LoginScreen;